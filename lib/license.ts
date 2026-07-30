import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * The entire "backend" of this app is one flat key per purchase.
 * No user accounts, no relational data - just a license record keyed
 * by the merchant reference we generated when checkout started.
 */

export type LicenseStatus = "pending" | "active" | "failed";

export interface LicenseRecord {
  merchantReference: string;
  status: LicenseStatus;
  email?: string;
  amount: number;
  currencyCode: string;
  pesepayReferenceNumber?: string;
  licenseKey?: string;
  createdAt: string;
  activatedAt?: string;
}

const keyFor = (merchantReference: string) => `license:${merchantReference}`;

export async function createPendingLicense(record: {
  merchantReference: string;
  amount: number;
  currencyCode: string;
  email?: string;
}): Promise<void> {
  const value: LicenseRecord = {
    merchantReference: record.merchantReference,
    status: "pending",
    amount: record.amount,
    currencyCode: record.currencyCode,
    email: record.email,
    createdAt: new Date().toISOString(),
  };
  await kv.set(keyFor(record.merchantReference), value);
}

export async function activateLicense(
  merchantReference: string,
  pesepayReferenceNumber: string
): Promise<LicenseRecord> {
  const existing = (await kv.get<LicenseRecord>(keyFor(merchantReference))) || ({} as Partial<LicenseRecord>);

  const licenseKey = generateLicenseKey();

  const value: LicenseRecord = {
    merchantReference,
    status: "active",
    amount: existing.amount ?? 0,
    currencyCode: existing.currencyCode ?? "USD",
    email: existing.email,
    pesepayReferenceNumber,
    licenseKey,
    createdAt: existing.createdAt ?? new Date().toISOString(),
    activatedAt: new Date().toISOString(),
  };

  await kv.set(keyFor(merchantReference), value);
  // Also index by license key so /license lookups don't need the merchant reference
  await kv.set(`licensekey:${licenseKey}`, merchantReference);

  return value;
}

export async function markLicenseFailed(merchantReference: string): Promise<void> {
  const existing = (await kv.get<LicenseRecord>(keyFor(merchantReference))) || ({} as Partial<LicenseRecord>);
  const value: LicenseRecord = {
    merchantReference,
    status: "failed",
    amount: existing.amount ?? 0,
    currencyCode: existing.currencyCode ?? "USD",
    email: existing.email,
    createdAt: existing.createdAt ?? new Date().toISOString(),
  };
  await kv.set(keyFor(merchantReference), value);
}

export async function getLicenseByReference(
  merchantReference: string
): Promise<LicenseRecord | null> {
  const record = await kv.get<LicenseRecord>(keyFor(merchantReference));
  return record || null;
}

export async function getLicenseByKey(licenseKey: string): Promise<LicenseRecord | null> {
  const merchantReference = await kv.get<string>(`licensekey:${licenseKey}`);
  if (!merchantReference) return null;
  return getLicenseByReference(merchantReference);
}

function generateLicenseKey(): string {
  // Format: OLX-XXXX-XXXX-XXXX, easy to read back over email
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  const group = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `OLX-${group()}-${group()}-${group()}`;
}

export function generateMerchantReference(): string {
  return `olx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
