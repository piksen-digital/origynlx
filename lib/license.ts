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
  paypalOrderId?: string;
  licenseKey?: string;
  emailSentAt?: string;
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  renewalReminderSentAt?: string;
  termDays?: number;
}

const keyFor = (merchantReference: string) => `license:${merchantReference}`;
const refIndexKey = (pesepayReferenceNumber: string) => `pesepayref:${pesepayReferenceNumber}`;

export async function createPendingLicense(record: {
  merchantReference: string;
  amount: number;
  currencyCode: string;
  email?: string;
  termDays?: number;
}): Promise<void> {
  const value: LicenseRecord = {
    merchantReference: record.merchantReference,
    status: "pending",
    amount: record.amount,
    currencyCode: record.currencyCode,
    email: record.email,
    termDays: record.termDays,
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
 * PayPal flow: stores the order id on the pending record and indexes it,
 * mirroring attachPesepayTracking. Activation goes through the same
 * idempotent activateLicense() path with "paypal_order_<orderId>" in the
 * reference slot.
 */
export async function attachPaypalOrderId(
  merchantReference: string,
  paypalOrderId: string
): Promise<void> {
  const existing = await kv.get<LicenseRecord>(keyFor(merchantReference));
  if (!existing) {
    console.error("attachPaypalOrderId: no pending record found for " + merchantReference);
    return;
  }
  await kv.set(keyFor(merchantReference), {
    ...existing,
    paypalOrderId,
  });
  await kv.set("paypalorder:" + paypalOrderId, merchantReference);
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
  const termDays = existing.termDays ?? LICENSE_TERM_DAYS;
  expires.setDate(expires.getDate() + termDays);

  const value: LicenseRecord = {
    merchantReference,
    status: "active",
    amount: existing.amount ?? 0,
    currencyCode: existing.currencyCode ?? "USD",
    email: existing.email,
    pesepayReferenceNumber,
    pesepayPollUrl: existing.pesepayPollUrl,
    licenseKey,
    termDays,
    createdAt: existing.createdAt ?? now.toISOString(),
    activatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  await kv.set(keyFor(merchantReference), value);
  await kv.set(`licensekey:${licenseKey}`, merchantReference);
  await kv.set(refIndexKey(pesepayReferenceNumber), merchantReference);
  if (value.email) {
    await kv.set("licenseemail:" + value.email.trim().toLowerCase(), merchantReference);
  }

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

/**
 * Fallback lookup for the PayPal capture path: the sandbox signup flow can
 * return a completed capture without echoing purchase_units custom_id, so
 * resolve the license through the order-id index written at checkout start.
 */
export async function getLicenseByPaypalOrderId(paypalOrderId: string): Promise<LicenseRecord | null> {
  const merchantReference = await kv.get<string>("paypalorder:" + paypalOrderId);
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

/* ---------------------------------------------------------------
 * No-signup license restore (P-lite).
 *
 * Two persistence paths, both keyed by opaque tokens in Redis so the
 * browser never carries the license key itself in a cookie:
 *
 * 1. Same device: an httpOnly cookie (olx_rid) minted at redeem time
 *    survives localStorage clears; GET /api/license/restore silently
 *    re-attaches the key.
 * 2. New device: POST /api/license/resume emails a one-time link
 *    (30 min TTL) that mints the same cookie on whatever browser
 *    clicks it. No passwords, no accounts, no email enumeration.
 * ------------------------------------------------------------- */

export const RESUME_COOKIE_NAME = "olx_rid";
const RESUME_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 400; // ~13 months
const RESUME_LINK_TTL_SECONDS = 60 * 30; // 30 minutes

interface ResumeTokenRecord {
  merchantReference: string;
  email?: string;
  createdAt: string;
}

function randomToken(prefix: string): string {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 12) +
    Math.random().toString(36).slice(2, 12)
  );
}

export function resumeCookieOptions(): {
  httpOnly: true;
  secure: true;
  sameSite: "lax";
  maxAge: number;
  path: string;
} {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: RESUME_COOKIE_TTL_SECONDS,
    path: "/",
  };
}

function isUsableLicense(license: LicenseRecord | null): license is LicenseRecord {
  if (!license || license.status !== "active" || !license.licenseKey) return false;
  if (!license.expiresAt || new Date(license.expiresAt).getTime() <= Date.now()) return false;
  return true;
}

export async function createResumeCookieToken(merchantReference: string, email?: string): Promise<string> {
  const token = randomToken("rc");
  const record: ResumeTokenRecord = { merchantReference, email, createdAt: new Date().toISOString() };
  await kv.set("resumecookie:" + token, record);
  return token;
}

export async function getLicenseByResumeCookieToken(token: string): Promise<LicenseRecord | null> {
  const record = await kv.get<ResumeTokenRecord>("resumecookie:" + token);
  if (!record) return null;
  const license = await getLicenseByReference(record.merchantReference);
  return isUsableLicense(license) ? license : null;
}

export async function createResumeLinkToken(merchantReference: string, email?: string): Promise<string> {
  const token = randomToken("rl");
  const record: ResumeTokenRecord = { merchantReference, email, createdAt: new Date().toISOString() };
  await kv.set("resumelink:" + token, record, { ex: RESUME_LINK_TTL_SECONDS });
  return token;
}

export async function getLicenseByResumeLinkToken(token: string): Promise<LicenseRecord | null> {
  const record = await kv.get<ResumeTokenRecord>("resumelink:" + token);
  if (!record) return null;
  const license = await getLicenseByReference(record.merchantReference);
  return isUsableLicense(license) ? license : null;
}

/**
 * Most recent active license for an email. Prefers the licenseemail
 * index written at activation; falls back to a scan of active licenses
 * for records activated before the index existed, then writes the index.
 */
export async function findActiveLicenseByEmail(email: string): Promise<LicenseRecord | null> {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return null;
  const indexed = await kv.get<string>("licenseemail:" + normalized);
  if (indexed) {
    const direct = await getLicenseByReference(indexed);
    if (isUsableLicense(direct)) return direct;
  }
  const actives = await listActiveLicenses();
  const matches = actives.filter(
    (r: LicenseRecord) => (r.email || "").trim().toLowerCase() === normalized
  );
  if (matches.length === 0) return null;
  matches.sort((a: LicenseRecord, b: LicenseRecord) => {
    const at = a.activatedAt || a.createdAt;
    const bt = b.activatedAt || b.createdAt;
    return at < bt ? 1 : at > bt ? -1 : 0;
  });
  const best = matches[0];
  await kv.set("licenseemail:" + normalized, best.merchantReference);
  return best;
}
