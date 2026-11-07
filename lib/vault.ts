import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { getLicenseByKey } from "./license";
import {
  calculateRVC,
  checkDeMinimis,
  type BOMLineItem,
  type DeMinimisResult,
  type RVCResult,
} from "./rvc-calculator";
import type { CertifierInfo } from "./certificate-pdf";

/**
 * Record vault (P6).
 *
 * USMCA Article 5-C requires the certifying party, exporter, producer and
 * importer to retain the records behind a certification for five years -
 * exactly the window CBP reaches into when it sends a verification
 * request. This vault stores the qualification snapshot server-side,
 * keyed by license, so records survive browser loss. The RVC result is
 * always recomputed server-side from the stored inputs - the client never
 * supplies the stored result.
 */

const kv = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const REMINDER_WINDOW_DAYS = 30;
const MAX_LINE_ITEMS = 200;
const MAX_RECORDS_PER_LICENSE = 250;

export interface VaultRecord {
  id: string;
  licenseKey: string;
  createdAt: string;
  productName: string;
  hsSubheading: string;
  tariffItem: string;
  productionCountry: string;
  importingParty: string;
  method: "transaction-value" | "net-cost";
  threshold: number;
  transactionValue: number;
  netCost: number | null;
  lineItems: BOMLineItem[];
  certInfo: CertifierInfo;
  result: RVCResult;
  deMinimis: DeMinimisResult;
  blanketReminderSentAt?: string;
}

export interface VaultMeta {
  id: string;
  productName: string;
  hsSubheading: string;
  createdAt: string;
  blanketPeriodEnd: string;
  rvcPercent: number;
  qualifies: boolean;
}

const keyFor = (licenseKey: string, id: string) => "vault:" + licenseKey + ":" + id;

export async function isLicenseActive(licenseKey: string): Promise<boolean> {
  const record = await getLicenseByKey(licenseKey.trim().toUpperCase());
  if (!record || record.status !== "active" || !record.expiresAt) return false;
  return new Date(record.expiresAt).getTime() > Date.now();
}

function capString(raw: unknown, max: number): string {
  const s = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  return s.trim().slice(0, max);
}

function capNumber(raw: unknown, min: number, max: number): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, min), max);
}

function capOriginStatus(raw: unknown): BOMLineItem["originStatus"] {
  if (raw === "non-originating" || raw === "undetermined") return raw;
  return "originating";
}

function sanitizeLineItems(raw: unknown): BOMLineItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_LINE_ITEMS).map((item: unknown) => {
    const o = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    return {
      id: capString(o.id, 60),
      description: capString(o.description, 200),
      hsCode: capString(o.hsCode, 20),
      countryOfOrigin: capString(o.countryOfOrigin, 40).toUpperCase(),
      value: capNumber(o.value, 0, 1e9),
      originating: o.originating === true,
      tariffItem: capString(o.tariffItem, 20),
      originStatus: capOriginStatus(o.originStatus),
    };
  });
}

function sanitizeCertInfo(raw: unknown): CertifierInfo {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const f = (k: string) => capString(c[k], 200);
  const type = f("certifierType");
  return {
    certifierType: type === "Exporter" || type === "Importer" ? type : "Producer",
    certifierName: f("certifierName"),
    certifierAddress: f("certifierAddress"),
    certifierEmail: f("certifierEmail"),
    certifierPhone: f("certifierPhone"),
    producerName: f("producerName"),
    producerAddress: f("producerAddress"),
    importerName: f("importerName"),
    importerAddress: f("importerAddress"),
    blanketPeriodStart: capString(c.blanketPeriodStart, 10),
    blanketPeriodEnd: capString(c.blanketPeriodEnd, 10),
  };
}

export async function saveVaultRecord(
  licenseKey: string,
  raw: Record<string, unknown>
): Promise<VaultRecord> {
  const key = licenseKey.trim().toUpperCase();
  const existing = await kv.keys("vault:" + key + ":*");
  if (existing.length >= MAX_RECORDS_PER_LICENSE) {
    throw new Error("Vault limit reached for this license (250 records).");
  }
  const lineItems = sanitizeLineItems(raw.lineItems);
  const method: "transaction-value" | "net-cost" =
    raw.method === "net-cost" ? "net-cost" : "transaction-value";
  const transactionValue = capNumber(raw.transactionValue, 0, 1e9);
  const threshold = capNumber(raw.threshold, 0, 100);
  const netCostRaw = capNumber(raw.netCost, 0, 1e9);
  const netCost = method === "net-cost" && netCostRaw > 0 ? netCostRaw : null;
  const productName = capString(raw.productName, 200) || "Untitled product";

  const result = calculateRVC({
    productName,
    transactionValue,
    netCost: netCost ?? undefined,
    method,
    thresholdPercent: threshold,
    lineItems,
  });
  const deMinimis = checkDeMinimis({ transactionValue, lineItems });

  const record: VaultRecord = {
    id: "v_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    licenseKey: key,
    createdAt: new Date().toISOString(),
    productName,
    hsSubheading: capString(raw.hsSubheading, 20),
    tariffItem: capString(raw.tariffItem, 20),
    productionCountry: capString(raw.productionCountry, 60),
    importingParty: capString(raw.importingParty, 60),
    method,
    threshold,
    transactionValue,
    netCost,
    lineItems,
    certInfo: sanitizeCertInfo(raw.certInfo),
    result,
    deMinimis,
  };
  await kv.set(keyFor(key, record.id), record);
  return record;
}

export async function listVaultRecords(licenseKey: string): Promise<VaultMeta[]> {
  const key = licenseKey.trim().toUpperCase();
  const ids = await kv.keys("vault:" + key + ":*");
  const records = await Promise.all(ids.map((k: string) => kv.get<VaultRecord>(k)));
  return records
    .filter((r): r is VaultRecord => !!r)
    .sort((a: VaultRecord, b: VaultRecord) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((r: VaultRecord) => ({
      id: r.id,
      productName: r.productName,
      hsSubheading: r.hsSubheading,
      createdAt: r.createdAt,
      blanketPeriodEnd: r.certInfo.blanketPeriodEnd,
      rvcPercent: r.result.rvcPercent,
      qualifies: r.result.qualifies,
    }));
}

export async function getVaultRecord(licenseKey: string, id: string): Promise<VaultRecord | null> {
  const record = await kv.get<VaultRecord>(keyFor(licenseKey.trim().toUpperCase(), id));
  return record || null;
}

export async function deleteVaultRecord(licenseKey: string, id: string): Promise<boolean> {
  const key = licenseKey.trim().toUpperCase();
  const existing = await kv.get<VaultRecord>(keyFor(key, id));
  if (!existing) return false;
  await kv.del(keyFor(key, id));
  return true;
}

/**
 * Blanket-period expiry reminders: any record whose blanket period ends
 * within REMINDER_WINDOW_DAYS gets one email to the license email, 30
 * days ahead, so a new certification is ready before the old one expires.
 */
export async function scanVaultBlanketReminders(): Promise<{
  checked: number;
  due: number;
  sent: number;
  errors: string[];
}> {
  const ids = await kv.keys("vault:*");
  const records = await Promise.all(ids.map((k: string) => kv.get<VaultRecord>(k)));
  const vaultRecords = records.filter((r): r is VaultRecord => !!r);
  const now = Date.now();
  const windowMs = REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const due: VaultRecord[] = [];
  for (const r of vaultRecords) {
    if (r.blanketReminderSentAt || !r.certInfo.blanketPeriodEnd) continue;
    const end = Date.parse(r.certInfo.blanketPeriodEnd);
    if (Number.isNaN(end)) continue;
    if (end - now > 0 && end - now <= windowMs) due.push(r);
  }

  let sent = 0;
  const errors: string[] = [];
  if (due.length > 0 && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    for (const r of due) {
      const license = await getLicenseByKey(r.licenseKey);
      const to = license?.email;
      if (!to) {
        errors.push(r.id + ": license has no email on file");
        continue;
      }
      try {
        const daysLeft = Math.ceil((Date.parse(r.certInfo.blanketPeriodEnd) - now) / (24 * 60 * 60 * 1000));
        await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
          to,
          subject: "Your blanket certification period ends in " + daysLeft + " days",
          text:
            "The blanket period on your OrigynLX record for " + r.productName +
            " ends on " + r.certInfo.blanketPeriodEnd + ".\n\n" +
            "After it ends, certifications covering that period are no longer valid for new entries. Prepare a new certification with a fresh period, and re-verify qualification in case rules or sourcing changed since you last checked.\n\n" +
            "Your records: " + (process.env.NEXT_PUBLIC_SITE_URL || "") + "/vault",
        });
        await kv.set(keyFor(r.licenseKey, r.id), { ...r, blanketReminderSentAt: new Date().toISOString() });
        sent += 1;
      } catch (err: any) {
        errors.push(r.id + ": " + err.message);
        console.error("vault-reminders: failed for", r.id, err);
      }
    }
  }
  return { checked: vaultRecords.length, due: due.length, sent, errors };
}
