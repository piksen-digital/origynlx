import Papa from "papaparse";
import {
  calculateRVC,
  checkDeMinimis,
  type BOMLineItem,
  type DeMinimisResult,
  type RVCResult,
} from "./rvc-calculator";
import { THRESHOLD_PICKER_OPTIONS, type ThresholdPickerReference } from "./usmca-rule-picker";
import { flagTradeRemedies } from "./trade-remedy-flags";
import { downloadTextCsv } from "./csv-download";

/**
 * Batch CSV qualification (P3).
 *
 * One row per component, grouped by SKU. Required columns: sku,
 * transaction_value, component, component_value. Optional columns:
 * product_name, hs_subheading, net_cost, method (tv | nc), threshold,
 * component_hs, component_country, component_origin_status.
 *
 * Each SKU is matched to its sourced USMCA rule by HS subheading (same
 * matching logic as the calculator's visible-rule filter). When no rule
 * matches, the threshold defaults and the row is flagged needs-review -
 * the batch view never silently guesses a rule.
 */

export type BatchMethod = "transaction-value" | "net-cost";

export interface BatchProductInput {
  sku: string;
  productName: string;
  hsSubheading: string;
  transactionValue: number;
  netCost?: number;
  method: BatchMethod;
  thresholdPercent: number | null;
  lineItems: BOMLineItem[];
}

export interface BatchRowResult {
  sku: string;
  productName: string;
  hsSubheading: string;
  method: BatchMethod;
  thresholdPercent: number;
  thresholdSource: "csv" | "rule" | "default";
  matchedRule: string | null;
  rvcPercent: number;
  marginPercent: number;
  qualifies: boolean;
  status: "qualifies" | "fails" | "needs-review";
  reviewReason: string | null;
  remedyFlags: string[];
  lineItems: BOMLineItem[];
  result: RVCResult;
  deMinimis: DeMinimisResult;
}

function findRulesForHS(hsSubheading: string): ThresholdPickerReference[] {
  const sub4 = hsSubheading.replace(/\D+/g, "").slice(0, 4);
  if (sub4.length !== 4) return [];
  const n = Number(sub4);
  return THRESHOLD_PICKER_OPTIONS.filter((r: ThresholdPickerReference) => {
    const codes = (r.hsRange.match(/\d{4}/g) || []).map(Number);
    if (codes.length >= 2) return n >= codes[0] && n <= codes[codes.length - 1];
    if (codes.length === 1) return n === codes[0];
    return false;
  });
}

export function findRuleForHS(hsSubheading: string): ThresholdPickerReference | null {
  const matches = findRulesForHS(hsSubheading);
  return matches.length > 0 ? matches[0] : null;
}

function parseNumber(raw: string | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  const cleaned = String(raw).replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

interface RawBatchRow {
  [key: string]: string | undefined;
}

export function parseBatchCsv(text: string): { products: BatchProductInput[]; errors: string[] } {
  const errors: string[] = [];
  const parsed = Papa.parse<RawBatchRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"),
  });
  const rows = (parsed.data || []).filter((r: RawBatchRow) => r && typeof r === "object");
  if (rows.length === 0) {
    errors.push("No data rows found - check the CSV template for the exact format.");
    return { products: [], errors };
  }
  const has = (h: string) => Object.prototype.hasOwnProperty.call(rows[0], h);
  const missing = ["sku", "transaction_value", "component", "component_value"].filter((h) => !has(h));
  if (missing.length > 0) {
    const detected: string = ((parsed.meta && parsed.meta.fields) || []).join(", ").slice(0, 200);
    errors.push(
      "Missing required column(s): " + missing.join(", ") + " - download the template for the exact format. Detected columns: " + detected
    );
    return { products: [], errors };
  }

  const map = new Map<string, BatchProductInput>();
  rows.forEach((row: RawBatchRow, i: number) => {
    const lineNo = i + 2; // header is line 1
    const sku = String(row["sku"] || "").trim();
    const compName = String(row["component"] || "").trim();
    if (!sku) {
      errors.push("Row " + String(lineNo) + ": sku is empty - row skipped.");
      return;
    }
    if (!compName) {
      errors.push("Row " + String(lineNo) + ": component is empty - row skipped.");
      return;
    }
    const compValue = parseNumber(row["component_value"]);
    if (compValue === null || compValue < 0) {
      errors.push("Row " + String(lineNo) + ": component_value is missing or not a number - row skipped.");
      return;
    }
    const transactionValue = parseNumber(row["transaction_value"]);
    if (transactionValue === null || transactionValue <= 0) {
      errors.push("Row " + String(lineNo) + ": transaction_value is missing or not a positive number - row skipped.");
      return;
    }
    const statusRaw = String(row["component_origin_status"] || row["origin_status"] || "").trim().toLowerCase();
    let originating: boolean;
    if (["originating", "o", "y", "yes", "usmca", "origin"].includes(statusRaw)) {
      originating = true;
    } else if (["non-originating", "nonoriginating", "n", "no", "non", "foreign"].includes(statusRaw)) {
      originating = false;
    } else {
      originating = false;
      errors.push("Row " + String(lineNo) + ": component_origin_status not recognized - counted as non-originating.");
    }
    const item: BOMLineItem = {
      id: sku + "-" + String(lineNo),
      description: compName,
      hsCode: String(row["component_hs"] || "").trim(),
      countryOfOrigin: String(row["component_country"] || "").trim().toUpperCase(),
      value: compValue,
      originating,
      originStatus: originating ? "originating" : "non-originating",
    };

    let product = map.get(sku);
    if (!product) {
      const methodRaw = String(row["method"] || "tv").trim().toLowerCase();
      const method: BatchMethod = ["nc", "net-cost", "netcost", "net_cost"].includes(methodRaw)
        ? "net-cost"
        : "transaction-value";
      const netCostRaw = parseNumber(row["net_cost"]);
      const thresholdRaw = parseNumber(row["threshold"]);
      product = {
        sku,
        productName: String(row["product_name"] || sku).trim(),
        hsSubheading: String(row["hs_subheading"] || "").trim(),
        transactionValue,
        netCost: netCostRaw !== null && netCostRaw > 0 ? netCostRaw : undefined,
        method,
        thresholdPercent: thresholdRaw !== null && thresholdRaw > 0 ? thresholdRaw : null,
        lineItems: [item],
      };
      map.set(sku, product);
    } else {
      product.lineItems.push(item);
      if (transactionValue !== product.transactionValue) {
        errors.push("SKU " + sku + ": transaction_value differs between rows - the first value (" + String(product.transactionValue) + ") was used.");
      }
    }
  });

  return { products: Array.from(map.values()), errors };
}

export function runBatch(products: BatchProductInput[]): BatchRowResult[] {
  return products.map((p: BatchProductInput) => runOne(p));
}

function runOne(p: BatchProductInput): BatchRowResult {
  const matches = findRulesForHS(p.hsSubheading);
  // One picker entry exists per (rule, method) pair, so a single rule with
  // both transaction-value and net-cost options appears twice. Genuine
  // ambiguity means distinct underlying rules (ruleId), not method variants.
  const uniqueRuleIds = Array.from(new Set(matches.map((r: ThresholdPickerReference) => r.ruleId)));
  const ruleCount = uniqueRuleIds.length;
  // Prefer the option matching the method requested in the CSV.
  const methodMatch = matches.find((r: ThresholdPickerReference) => r.method === p.method) || null;
  const rule = matches.length > 0 ? (methodMatch || matches[0]) : null;
  let method: BatchMethod = p.method;
  let reviewReason: string | null = null;

  let threshold: number;
  let thresholdSource: "csv" | "rule" | "default";
  let matchedRule: string | null = rule ? rule.label : null;

  if (p.thresholdPercent !== null && p.thresholdPercent > 0) {
    threshold = p.thresholdPercent;
    thresholdSource = "csv";
  } else if (rule) {
    threshold = rule.thresholdPercent;
    method = rule.method;
    thresholdSource = "rule";
    if (rule.method !== p.method) {
      reviewReason =
        "The matched USMCA rule defines the " +
        (rule.method === "net-cost" ? "net cost" : "transaction value") +
        " method only - RVC computed with that method instead of the one in the CSV.";
    }
  } else {
    threshold = p.method === "net-cost" ? 50 : 60;
    thresholdSource = "default";
    reviewReason =
      "No sourced USMCA rule matched HS " + (p.hsSubheading || "(empty)") +
      " - threshold defaulted to " + String(threshold) +
      "%. Confirm the governing rule before relying on this result.";
  }

  if (ruleCount > 1 && thresholdSource === "rule") {
    const candidateLabels = matches
      .filter((r: ThresholdPickerReference, i: number, arr: ThresholdPickerReference[]) =>
        arr.findIndex((x: ThresholdPickerReference) => x.ruleId === r.ruleId) === i
      )
      .map((r: ThresholdPickerReference) => r.label)
      .slice(0, 3)
      .join(" | ");
    reviewReason = (reviewReason ? reviewReason + " " : "") +
      "Multiple USMCA rules match this HS code - verify which product-specific rule governs, or pin the threshold in the CSV. Candidates: " +
      candidateLabels +
      (ruleCount > 3 ? " (+" + String(ruleCount - 3) + " more)" : "") +
      ".";
  }

  if (method === "net-cost" && (p.netCost === undefined || p.netCost <= 0)) {
    reviewReason = (reviewReason ? reviewReason + " " : "") +
      "Net-cost method selected without a net_cost column value - RVC was computed on transaction value and is not a valid net-cost result.";
  }

  const result = calculateRVC({
    productName: p.productName || p.sku,
    transactionValue: p.transactionValue,
    netCost: p.netCost,
    method,
    thresholdPercent: threshold,
    lineItems: p.lineItems,
  });
  const deMinimis = checkDeMinimis({ transactionValue: p.transactionValue, lineItems: p.lineItems });

  if (!result.qualifies && deMinimis.withinDeMinimis) {
    reviewReason = (reviewReason ? reviewReason + " " : "") +
      "Fails the RVC threshold but total non-originating content is within the 10% de minimis reference limit - may still qualify if the only issue is a tariff shift. Needs review.";
  }

  const remedyFlags = flagTradeRemedies({ hsCode: p.hsSubheading }).map((f) => f.short);

  const status: BatchRowResult["status"] =
    reviewReason !== null ? "needs-review" : result.qualifies ? "qualifies" : "fails";

  return {
    sku: p.sku,
    productName: p.productName,
    hsSubheading: p.hsSubheading,
    method,
    thresholdPercent: threshold,
    thresholdSource,
    matchedRule,
    rvcPercent: result.rvcPercent,
    marginPercent: result.marginPercent,
    qualifies: result.qualifies,
    status,
    reviewReason,
    remedyFlags,
    lineItems: p.lineItems,
    result,
    deMinimis,
  };
}

export const BATCH_TEMPLATE_CSV = [
  "sku,product_name,hs_subheading,transaction_value,net_cost,method,threshold,component,component_hs,component_country,component_origin_status,component_value",
  "SKU-001,Aluminum bracket assembly,8536.50,1000,,tv,,Aluminum housing,7616.99,US,originating,420",
  "SKU-001,Aluminum bracket assembly,8536.50,1000,,tv,,Steel fasteners,7318.15,CN,non-originating,60",
  "SKU-001,Aluminum bracket assembly,8536.50,1000,,tv,,Plastic housing,3926.90,CN,non-originating,520",
  "SKU-002,LED work light,8513.10,800,,nc,45,LED module,8541.40,US,originating,300",
  "SKU-002,LED work light,8513.10,800,,nc,45,Battery pack,8507.60,CN,non-originating,250",
].join("\n");

export function downloadBatchTemplate(): void {
  downloadTextCsv("origynlx-batch-template.csv", BATCH_TEMPLATE_CSV);
}

function csvField(s: string): string {
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function resultsCsv(rows: BatchRowResult[]): string {
  const header = [
    "sku",
    "product_name",
    "hs_subheading",
    "method",
    "threshold_percent",
    "threshold_source",
    "matched_rule",
    "rvc_percent",
    "margin_percent",
    "status",
    "review_reason",
    "trade_remedy_flags",
  ];
  const lines: string[] = [header.join(",")];
  for (const r of rows) {
    lines.push([
      csvField(r.sku),
      csvField(r.productName),
      csvField(r.hsSubheading),
      r.method,
      String(r.thresholdPercent),
      r.thresholdSource,
      csvField(r.matchedRule || ""),
      String(r.rvcPercent),
      String(r.marginPercent),
      r.status,
      csvField(r.reviewReason || ""),
      csvField(r.remedyFlags.join("; ")),
    ].join(","));
  }
  return lines.join("\n");
}
