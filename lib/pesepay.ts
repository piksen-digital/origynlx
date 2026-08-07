import crypto from "crypto";

/**
 * Server-only helpers for talking to Pesepay.
 * Never import this file from a "use client" component - the encryption key
 * must never reach the browser.
 *
 * Endpoint URLs below are confirmed from Pesepay's own API reference pages
 * (developers.pesepay.com/api-reference/*), not guessed. Env vars still
 * override them if Pesepay ever changes these.
 */

const CONFIRMED_URLS = {
  sandbox: {
    initiate: "https://api.test.sandbox.pesepay.com/payments-engine/v1/payments/initiate",
    checkStatus: "https://api.test.sandbox.pesepay.com/payments-engine/v1/payments/check-payment",
  },
  production: {
    initiate: "https://api.pesepay.com/api/payments-engine/v1/payments/initiate",
    checkStatus: "https://api.pesepay.com/api/payments-engine/v1/payments/check-payment",
  },
};

function getConfig() {
  const integrationKey = process.env.PESEPAY_INTEGRATION_KEY;
  const encryptionKey = process.env.PESEPAY_ENCRYPTION_KEY;
  const env = process.env.PESEPAY_ENV === "production" ? "production" : "sandbox";

  const initiateUrl =
    (env === "production"
      ? process.env.PESEPAY_INITIATE_URL_PRODUCTION
      : process.env.PESEPAY_INITIATE_URL_SANDBOX) || CONFIRMED_URLS[env].initiate;

  const checkStatusUrl =
    (env === "production"
      ? process.env.PESEPAY_CHECK_STATUS_URL_PRODUCTION
      : process.env.PESEPAY_CHECK_STATUS_URL_SANDBOX) || CONFIRMED_URLS[env].checkStatus;

  if (!integrationKey || !encryptionKey) {
    throw new Error("Pesepay is not configured. Set PESEPAY_INTEGRATION_KEY and PESEPAY_ENCRYPTION_KEY.");
  }

  // AES-256-CBC needs a 32-byte key. Pesepay issues 32-character encryption
  // keys, and the IV is the first 16 characters of that same key.
  if (encryptionKey.length !== 32) {
    throw new Error(
      `PESEPAY_ENCRYPTION_KEY must be exactly 32 characters, got ${encryptionKey.length}.`
    );
  }

  return { integrationKey, encryptionKey, initiateUrl, checkStatusUrl, env };
}

function encryptPayload(payload: object, encryptionKey: string): string {
  const key = Buffer.from(encryptionKey, "utf8");
  const iv = Buffer.from(encryptionKey.slice(0, 16), "utf8");
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  return encrypted.toString("base64");
}

function decryptPayload(encryptedBase64: string, encryptionKey: string): any {
  const key = Buffer.from(encryptionKey, "utf8");
  const iv = Buffer.from(encryptionKey.slice(0, 16), "utf8");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8"));
}

export interface InitiateTransactionInput {
  amount: number;
  currencyCode: string;
  reasonForPayment: string;
  merchantReference: string;
  resultUrl: string;
  returnUrl: string;
}

export interface InitiateTransactionResult {
  referenceNumber: string;
  redirectUrl: string;
  pollUrl?: string;
  raw: any;
}

/**
 * Builds the plaintext payload, encrypts it, and posts it to Pesepay's
 * initiate-transaction endpoint. Returns the decrypted redirect + reference.
 */
export async function initiatePesepayTransaction(
  input: InitiateTransactionInput
): Promise<InitiateTransactionResult> {
  const { integrationKey, encryptionKey, initiateUrl } = getConfig();

  const plaintextBody = {
    amountDetails: {
      amount: input.amount,
      currencyCode: input.currencyCode,
    },
    reasonForPayment: input.reasonForPayment,
    merchantReference: input.merchantReference,
    resultUrl: input.resultUrl,
    returnUrl: input.returnUrl,
  };

  const payload = encryptPayload(plaintextBody, encryptionKey);

  const response = await fetch(initiateUrl, {
    method: "POST",
    headers: {
      authorization: integrationKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Pesepay initiate failed (${response.status}): ${text}`);
  }

  const body = await response.json();
  if (!body?.payload) {
    throw new Error("Pesepay response did not include an encrypted payload.");
  }

  const decrypted = decryptPayload(body.payload, encryptionKey);

  if (!decrypted?.redirectUrl || !decrypted?.referenceNumber) {
    throw new Error("Decrypted Pesepay response is missing redirectUrl or referenceNumber.");
  }

  if (!decrypted?.pollUrl) {
    console.warn(
      "Pesepay initiate response had no pollUrl - falling back to the confirmed check-status URL for this environment. This is fine, just noting it."
    );
  }

  return {
    referenceNumber: decrypted.referenceNumber,
    redirectUrl: decrypted.redirectUrl,
    pollUrl: decrypted.pollUrl,
    raw: decrypted,
  };
}

/**
 * Decrypts an inbound webhook body from Pesepay's resultUrl callback.
 * Use this in the webhook route - never trust an unencrypted status.
 */
export function decryptPesepayWebhookBody(rawPayload: string) {
  const { encryptionKey } = getConfig();
  return decryptPayload(rawPayload, encryptionKey);
}

export interface PesepayStatusResult {
  status: "success" | "failed" | "pending";
  raw: any;
}

/**
 * Actively asks Pesepay for a transaction's current status, rather than
 * only waiting for the resultUrl webhook to arrive. Confirmed against
 * Pesepay's Check Payment Status doc: GET request, referenceNumber as a
 * query param, response is { payload: "<encrypted>" }.
 *
 * Prefers the pollUrl returned at initiate time; falls back to the
 * confirmed check-status URL for the current environment if that's
 * missing, so this always has somewhere valid to call.
 */
export async function checkPesepayTransactionStatus(
  referenceNumber: string,
  pollUrl?: string
): Promise<PesepayStatusResult> {
  const { integrationKey, encryptionKey, checkStatusUrl } = getConfig();
  const url = pollUrl || checkStatusUrl;

  const separator = url.includes("?") ? "&" : "?";
  const response = await fetch(`${url}${separator}referenceNumber=${encodeURIComponent(referenceNumber)}`, {
    method: "GET",
    headers: { authorization: integrationKey },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Pesepay status check failed (${response.status}) at ${url}: ${text}`);
  }

  const body = await response.json();
  if (!body?.payload) {
    throw new Error(`Pesepay status response at ${url} did not include an encrypted payload.`);
  }

  const decrypted = decryptPayload(body.payload, encryptionKey);
  const rawStatus = String(decrypted?.transactionStatus || decrypted?.status || "").toUpperCase();

  const status: PesepayStatusResult["status"] = ["SUCCESS", "SUCCESSFUL", "PAID", "COMPLETE", "COMPLETED"].includes(
    rawStatus
  )
    ? "success"
    : ["FAILED", "CANCELLED", "DECLINED"].includes(rawStatus)
      ? "failed"
      : "pending";

  return { status, raw: decrypted };
}
