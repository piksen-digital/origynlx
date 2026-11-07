import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { getLicenseByKey } from "./license";
import { THRESHOLD_PICKER_OPTIONS, type ThresholdPickerReference } from "./usmca-rule-picker";

/**
 * Rule-change watch (P5).
 *
 * The USMCA review cycle makes product-specific rules a moving target.
 * Licensed users pin the SKUs they certified against the rule they relied
 * on; a daily job re-checks each watch against the sourced, revision-
 * tagged rule registry (THRESHOLD_PICKER_OPTIONS) and raises an alert
 * when the governing rule changed, expired or disappeared.
 *
 * Honest framing: OrigynLX monitors its own sourced registry, not the
 * Federal Register directly. Alerts are a prompt to re-qualify, not
 * legal notice.
 */

const kv = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const MAX_WATCHES_PER_LICENSE = 100;

export interface RuleWatchAlert {
  detectedAt: string;
  message: string;
  oldSummary: string;
  newSummary: string;
}

export interface RuleWatch {
  id: string;
  licenseKey: string;
  sku: string;
  productName: string;
  hsSubheading: string;
  ruleId: string | null;
  ruleLabel: string;
  thresholdPercent: number | null;
  method: "transaction-value" | "net-cost";
  fingerprint: string | null;
  matchedCount: number;
  createdAt: string;
  alertHistoryCount: number;
  pendingAlert?: RuleWatchAlert;
}

const keyFor = (licenseKey: string, id: string) => "watch:" + licenseKey + ":" + id;

export async function isLicenseActive(licenseKey: string): Promise<boolean> {
  const record = await getLicenseByKey(licenseKey.trim().toUpperCase());
  if (!record || record.status !== "active" || !record.expiresAt) return false;
  return new Date(record.expiresAt).getTime() > Date.now();
}

function capString(raw: unknown, max: number): string {
  const s = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  return s.trim().slice(0, max);
}

/** Same 4-digit hsRange matching the calculator and batch qualifier use. */
export function findRulesForHS(hsSubheading: string): ThresholdPickerReference[] {
  const sub4 = hsSubheading.replace(/\D+/g, "").slice(0, 4);
  if (sub4.length !== 4) return [];
  const n = Number(sub4);
  return THRESHOLD_PICKER_OPTIONS.filter((r) => {
    const codes = (r.hsRange.match(/\d{4}/g) || []).map(Number);
    if (codes.length >= 2) return n >= codes[0] && n <= codes[codes.length - 1];
    if (codes.length === 1) return n === codes[0];
    return false;
  });
}

function ruleFingerprint(r: ThresholdPickerReference): string {
  return [r.label, r.thresholdPercent, r.method, r.ruleEffectiveFrom || "", r.ruleEffectiveTo || ""].join("|");
}

function storedSummary(w: RuleWatch): string {
  return w.ruleLabel + " (" + (w.thresholdPercent == null ? "?" : w.thresholdPercent) + "%)";
}

export async function subscribeRuleWatch(
  licenseKey: string,
  raw: Record<string, unknown>
): Promise<RuleWatch> {
  const key = licenseKey.trim().toUpperCase();
  const productName = capString(raw.productName, 200) || "Untitled product";
  const sku = capString(raw.sku, 60) || capString(productName, 60);
  const hsSubheading = capString(raw.hsSubheading, 20);
  if (!hsSubheading) {
    throw new Error("An HS subheading is required to watch a product.");
  }

  const ids = await kv.keys("watch:" + key + ":*");
  if (ids.length >= MAX_WATCHES_PER_LICENSE) {
    throw new Error("Watch limit reached for this license (100 SKUs).");
  }
  const existingWatches = await Promise.all(ids.map((k: string) => kv.get<RuleWatch>(k)));
  const dup = existingWatches.find(
    (w): w is RuleWatch => !!w && w.sku === sku && w.hsSubheading === hsSubheading
  );
  if (dup) return dup;

  const matches = findRulesForHS(hsSubheading);
  const requestedId = capString(raw.ruleId, 120);
  const rule = requestedId
    ? THRESHOLD_PICKER_OPTIONS.find((r) => r.id === requestedId) || null
    : matches[0] || null;

  const watch: RuleWatch = {
    id: "w_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    licenseKey: key,
    sku,
    productName,
    hsSubheading,
    ruleId: rule ? rule.id : null,
    ruleLabel: rule ? rule.label : "No matching sourced rule",
    thresholdPercent: rule ? rule.thresholdPercent : null,
    method: rule ? rule.method : "transaction-value",
    fingerprint: rule ? ruleFingerprint(rule) : null,
    matchedCount: matches.length,
    createdAt: new Date().toISOString(),
    alertHistoryCount: 0,
  };
  await kv.set(keyFor(key, watch.id), watch);
  return watch;
}

export async function listRuleWatches(licenseKey: string): Promise<RuleWatch[]> {
  const key = licenseKey.trim().toUpperCase();
  const ids = await kv.keys("watch:" + key + ":*");
  const watches = await Promise.all(ids.map((k: string) => kv.get<RuleWatch>(k)));
  return watches
    .filter((w): w is RuleWatch => !!w)
    .sort((a: RuleWatch, b: RuleWatch) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteRuleWatch(licenseKey: string, id: string): Promise<boolean> {
  const key = licenseKey.trim().toUpperCase();
  const existing = await kv.get<RuleWatch>(keyFor(key, id));
  if (!existing) return false;
  await kv.del(keyFor(key, id));
  return true;
}

export async function ackRuleWatchAlert(licenseKey: string, id: string): Promise<boolean> {
  const key = licenseKey.trim().toUpperCase();
  const existing = await kv.get<RuleWatch>(keyFor(key, id));
  if (!existing || !existing.pendingAlert) return false;
  const updated: RuleWatch = { ...existing, pendingAlert: undefined };
  await kv.set(keyFor(key, id), updated);
  return true;
}

export async function scanRuleChanges(): Promise<{
  checked: number;
  changed: number;
  alerted: number;
  emailed: number;
  errors: string[];
}> {
  const ids = await kv.keys("watch:*");
  const watches = (await Promise.all(
    ids.map((k: string) => kv.get<RuleWatch>(k))
  )).filter((w): w is RuleWatch => !!w);

  let changed = 0;
  let alerted = 0;
  let emailed = 0;
  const errors: string[] = [];
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  for (const w of watches) {
    if (w.pendingAlert) continue;

    let message = "";
    let oldSummary = "";
    let newSummary = "";

    if (w.ruleId) {
      const rule = THRESHOLD_PICKER_OPTIONS.find((r) => r.id === w.ruleId) || null;
      if (!rule) {
        message =
          "The USMCA rule " + w.sku + " (HS " + w.hsSubheading + ") relied on is no longer in the OrigynLX registry - it was revised or removed. Re-check which rule now governs this HS code and re-qualify.";
        oldSummary = storedSummary(w);
        newSummary = "Removed from the sourced registry";
      } else {
        const fp = ruleFingerprint(rule);
        if (fp !== w.fingerprint) {
          message =
            "The USMCA rule " + w.sku + " (HS " + w.hsSubheading + ") relies on changed in the OrigynLX registry: threshold " +
            (w.thresholdPercent == null ? "?" : w.thresholdPercent) + "% became " + rule.thresholdPercent +
            "% (" + (rule.method === "net-cost" ? "net cost" : "transaction value") + "). Re-run the qualification with the updated rule.";
          oldSummary = storedSummary(w);
          newSummary = rule.label + " (" + rule.thresholdPercent + "%)";
        }
      }
    } else {
      const matches = findRulesForHS(w.hsSubheading);
      if (matches.length !== w.matchedCount) {
        message =
          "The set of sourced USMCA rules matching HS " + w.hsSubheading + " (" + w.sku + ") changed from " +
          w.matchedCount + " to " + matches.length + " rule(s). Review which rule now governs this SKU and re-qualify.";
        oldSummary = w.matchedCount + " matching rule(s)";
        newSummary = matches.length + " matching rule(s)";
      }
    }

    if (!message) continue;
    changed += 1;

    const pendingAlert: RuleWatchAlert = {
      detectedAt: new Date().toISOString(),
      message,
      oldSummary,
      newSummary,
    };
    const updated: RuleWatch = { ...w, pendingAlert, alertHistoryCount: w.alertHistoryCount + 1 };
    await kv.set(keyFor(w.licenseKey, w.id), updated);
    alerted += 1;

    if (resend) {
      const license = await getLicenseByKey(w.licenseKey);
      if (license?.email) {
        try {
          await resend.emails.send({
            from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
            to: license.email,
            subject: "USMCA rule change detected: " + w.sku,
            text:
              message + "\n\n" +
              "Review your watch list and re-qualify: " + (process.env.NEXT_PUBLIC_SITE_URL || "") + "/vault\n\n" +
              "OrigynLX monitors its sourced, revision-tagged rule registry. Treat this as a prompt to re-verify, not legal notice.",
          });
          emailed += 1;
        } catch (err: any) {
          errors.push(w.id + ": email failed - " + err.message);
        }
      }
    }
  }

  return { checked: watches.length, changed, alerted, emailed, errors };
}
