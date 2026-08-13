import Papa from "papaparse";
import type { BOMLineItem } from "./rvc-calculator";

export interface CsvImportResult {
  items: BOMLineItem[];
  errors: string[];
}

const HEADER_ALIASES: Record<string, keyof BOMLineItem> = {
  description: "description",
  component: "description",
  name: "description",
  item: "description",
  hscode: "hsCode",
  hs_code: "hsCode",
  "hs code": "hsCode",
  hts: "hsCode",
  country: "countryOfOrigin",
  countryoforigin: "countryOfOrigin",
  origin: "countryOfOrigin",
  value: "value",
  amount: "value",
  cost: "value",
  originating: "originating",
  isoriginating: "originating",
  tariffitem: "tariffItem",
  tariff_item: "tariffItem",
  "tariff item": "tariffItem",
  usmcaoriginstatus: "originStatus",
  usmca_origin_status: "originStatus",
  "usmca origin status": "originStatus",
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase();
}

function toBoolean(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "yes" || v === "y" || v === "true" || v === "1";
}

let idCounter = 0;
const newId = () => `csv_${Date.now()}_${++idCounter}`;

export function parseBOMCsv(csvText: string): CsvImportResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  });

  const errors: string[] = [];
  if (parsed.errors.length > 0) {
    for (const e of parsed.errors.slice(0, 5)) {
      errors.push(`Row ${e.row ?? "?"}: ${e.message}`);
    }
  }

  const items: BOMLineItem[] = [];

  parsed.data.forEach((row, i) => {
    const mapped: Partial<BOMLineItem> = {};
    for (const [rawKey, rawValue] of Object.entries(row)) {
      const field = HEADER_ALIASES[normalizeHeader(rawKey)];
      if (!field) continue;
      if (field === "value") {
        const num = parseFloat(String(rawValue).replace(/[^0-9.-]/g, ""));
        mapped.value = isNaN(num) ? 0 : num;
      } else if (field === "originating") {
        mapped.originating = toBoolean(rawValue);
      } else if (field === "originStatus") {
        const status = String(rawValue ?? "").trim().toLowerCase();
        if (status === "originating" || status === "non-originating" || status === "undetermined") {
          (mapped as any).originStatus = status;
          mapped.originating = status === "originating";
        }
      } else {
        (mapped as any)[field] = String(rawValue ?? "").trim();
      }
    }

    if (!mapped.description && !mapped.hsCode && !mapped.value) {
      return; // skip fully blank rows
    }

    items.push({
      id: newId(),
      description: mapped.description || `Row ${i + 2}`,
      hsCode: mapped.hsCode || "",
      countryOfOrigin: (mapped.countryOfOrigin || "US").toUpperCase().slice(0, 2),
      value: mapped.value ?? 0,
      originating: mapped.originating ?? true,
      tariffItem: String((mapped as any).tariffItem || "").trim(),
      originStatus: ((mapped as any).originStatus || (mapped.originating === false ? "non-originating" : "originating")) as BOMLineItem["originStatus"],
    });
  });

  if (items.length === 0) {
    errors.push(
      "No rows recognized. Expected columns like: Component Name, HS Subheading, Tariff Item, Origin Country, USMCA Origin Status, Value."
    );
  }

  return { items, errors };
}

export function bomTemplateCsv(): string {
  return [
    "Component Name,HS Heading,HS Subheading,Tariff Item,Origin Country,USMCA Origin Status,Value,Currency,Intermediate Material,Notes",
    "Aluminum housing,76,7616.99,7616.99.00,US,Originating,420,USD,No,Replace example values",
    "Steel fasteners,73,7318.15,7318.15.00,CN,Non-originating,60,USD,No,Replace example values",
    "Injection-molded bracket,39,3926.90,3926.90.00,MX,Originating,180,USD,No,Replace example values",
  ].join("\n");
}

export function downloadBomTemplate(): void {
  const blob = new Blob([bomTemplateCsv()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "origynlx-usmca-bom-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
