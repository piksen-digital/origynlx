import { Redis } from "@upstash/redis";
import { Resend } from "resend";

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
const LICENSE_TERM_DAYS = 365;

export interface LicenseRecord {
  merchantReference: string;
  status: LicenseStatus;
  email?: string;
  amount: number;
  currencyCode: string;
  pesepayReferenceNumber?: string;
  pesepayPollUrl?: string;
  licenseKey?: string;
  emailSentAt?: string;
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  renewalReminderSentAt?: string;
}

const keyFor = (merchantReference: string) => `license:${merchantReference}`;
const refIndexKey = (pesepayReferenceNumber: string) => `pesepayref:${pesepayReferenceNumber}`;

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

/**
 * Called right after Pesepay's initiate call returns, before the customer
 * even reaches the checkout page. Stores the reference/poll URL so verify
 * can later ask Pesepay directly "did this succeed?", and indexes by
 * Pesepay's own referenceNumber too - their webhook payload may not
 * reliably echo back our merchantReference, so this gives the webhook a
 * second way to find the right record.
 */
export async function attachPesepayTracking(
  merchantReference: string,
  pesepayReferenceNumber: string,
  pollUrl?: string
): Promise<void> {
  const existing = await kv.get<LicenseRecord>(keyFor(merchantReference));
  if (!existing) {
    console.error(`attachPesepayTracking: no pending record found for ${merchantReference}`);
    return;
  }
  await kv.set(keyFor(merchantReference), {
    ...existing,
    pesepayReferenceNumber,
    pesepayPollUrl: pollUrl,
  });
  await kv.set(refIndexKey(pesepayReferenceNumber), merchantReference);
}

/**
 * Idempotent: safe to call from both the webhook and the poll-based verify
 * path without generating two license keys or sending two emails for the
 * same purchase. Returns justActivated=false on the second call.
 */
export async function activateLicense(
  merchantReference: string,
  pesepayReferenceNumber: string
): Promise<{ record: LicenseRecord; justActivated: boolean }> {
  const existing = (await kv.get<LicenseRecord>(keyFor(merchantReference))) || ({} as Partial<LicenseRecord>);

  if (existing.status === "active" && existing.licenseKey) {
    return { record: existing as LicenseRecord, justActivated: false };
  }

  const licenseKey = generateLicenseKey();
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + LICENSE_TERM_DAYS);

  const value: LicenseRecord = {
    merchantReference,
    status: "active",
    amount: existing.amount ?? 0,
    currencyCode: existing.currencyCode ?? "USD",
    email: existing.email,
    pesepayReferenceNumber,
    pesepayPollUrl: existing.pesepayPollUrl,
    licenseKey,
    createdAt: existing.createdAt ?? now.toISOString(),
    activatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  await kv.set(keyFor(merchantReference), value);
  await kv.set(`licensekey:${licenseKey}`, merchantReference);
  await kv.set(refIndexKey(pesepayReferenceNumber), merchantReference);

  return { record: value, justActivated: true };
}

export async function markLicenseFailed(merchantReference: string): Promise<void> {
  const existing = (await kv.get<LicenseRecord>(keyFor(merchantReference))) || ({} as Partial<LicenseRecord>);
  if (existing.status === "active") return; // never downgrade an active license
  const value: LicenseRecord = {
    merchantReference,
    status: "failed",
    amount: existing.amount ?? 0,
    currencyCode: existing.currencyCode ?? "USD",
    email: existing.email,
    pesepayPollUrl: existing.pesepayPollUrl,
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

/**
 * Fallback lookup for the webhook when the payload has Pesepay's own
 * referenceNumber but not our merchantReference.
 */
export async function getLicenseByPesepayReference(
  pesepayReferenceNumber: string
): Promise<LicenseRecord | null> {
  const merchantReference = await kv.get<string>(refIndexKey(pesepayReferenceNumber));
  if (!merchantReference) return null;
  return getLicenseByReference(merchantReference);
}

export async function getLicenseByKey(licenseKey: string): Promise<LicenseRecord | null> {
  const merchantReference = await kv.get<string>(`licensekey:${licenseKey}`);
  if (!merchantReference) return null;
  return getLicenseByReference(merchantReference);
}

/**
 * Every active license key, for the renewal-reminder cron. Fine at this
 * scale (KEYS/SCAN over a few hundred-thousand keys is cheap); revisit if
 * this ever needs to run over millions of records.
 */
export async function listActiveLicenses(): Promise<LicenseRecord[]> {
  const keys = await kv.keys("license:*");
  if (keys.length === 0) return [];
  const records = await Promise.all(keys.map((k) => kv.get<LicenseRecord>(k)));
  return records.filter((r): r is LicenseRecord => !!r && r.status === "active");
}

export async function markRenewalReminderSent(merchantReference: string): Promise<void> {
  const existing = await kv.get<LicenseRecord>(keyFor(merchantReference));
  if (!existing) return;
  await kv.set(keyFor(merchantReference), { ...existing, renewalReminderSentAt: new Date().toISOString() });
}

/**
 * Sends the license key email exactly once per activation - call this only
 * when activateLicense() just returned justActivated=true.
 */
export async function sendLicenseEmail(record: LicenseRecord): Promise<void> {
  if (!record.email || !record.licenseKey || !process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
      to: record.email,
      subject: "Your OrigynLX license key",
      text: `Thanks for your purchase.\n\nYour license key: ${record.licenseKey}\n\nEnter it at ${process.env.NEXT_PUBLIC_SITE_URL}/calculator to unlock unlimited checks and certificates.`,
    });
    await kv.set(keyFor(record.merchantReference), { ...record, emailSentAt: new Date().toISOString() });
  } catch (err) {
    console.error("Failed to send license email:", err);
  }
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
