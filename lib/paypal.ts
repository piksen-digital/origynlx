/**
 * Server-only PayPal REST helpers for the license checkout.
 *
 * Env vars: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV ("live" or
 * anything else for sandbox). Prices and terms live in lib/plans.ts
 * (LICENSE_PRICE_USD, default 149; LICENSE_PRICE_USD_MONTHLY, default 19).
 *
 * Flow: create-order creates a pending license record plus a PayPal order
 * carrying our merchantReference as custom_id; capture-order captures the
 * payment and activates the license through the same idempotent path the
 * Pesepay webhook uses.
 */

const API_BASE = () =>
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export function paypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured (missing client credentials).");
  }
  const creds = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const res = await fetch(API_BASE() + "/v1/oauth2/token", {
    method: "POST",
    headers: {
      authorization: "Basic " + creds,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("PayPal auth failed (" + res.status + "): " + text);
  }
  const data: { access_token: string; expires_in: number } = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export async function createPayPalOrder(input: {
  amount: number;
  merchantReference: string;
  description: string;
}): Promise<{ orderId: string; status: string }> {
  const token = await getPayPalAccessToken();
  const res = await fetch(API_BASE() + "/v2/checkout/orders", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: input.amount.toFixed(2) },
          custom_id: input.merchantReference,
          description: input.description,
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("PayPal order creation failed (" + res.status + "): " + text);
  }
  const data: { id: string; status: string } = await res.json();
  return { orderId: data.id, status: data.status };
}

export async function capturePayPalOrder(orderId: string): Promise<{
  status: string;
  merchantReference: string | null;
  payerEmail?: string;
}> {
  const token = await getPayPalAccessToken();
  const res = await fetch(
    API_BASE() + "/v2/checkout/orders/" + encodeURIComponent(orderId) + "/capture",
    {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 422 && /ORDER_ALREADY_CAPTURED/.test(text)) {
      const details = await getPayPalOrderDetails(orderId);
      return {
        status: "ALREADY_CAPTURED",
        merchantReference: details.custom_id,
        payerEmail: details.payerEmail,
      };
    }
    throw new Error("PayPal capture failed (" + res.status + "): " + text);
  }
  const data: {
    status?: string;
    purchase_units?: { custom_id?: string }[];
    payer?: { email_address?: string };
  } = await res.json();
  const ref = data?.purchase_units?.[0]?.custom_id ?? null;
  const payerEmail = data?.payer?.email_address;
  return { status: data.status || "", merchantReference: ref, payerEmail };
}

/**
 * GET /v2/checkout/orders/{id} - used to recover the merchant reference when
 * the capture response does not echo purchase_units custom_id, and when the
 * order was already captured (a client retry of a capture that failed
 * server-side after PayPal confirmed the payment).
 */
export async function getPayPalOrderDetails(orderId: string): Promise<{
  id: string;
  status: string;
  custom_id: string | null;
  payerEmail?: string;
}> {
  const token = await getPayPalAccessToken();
  const res = await fetch(
    API_BASE() + "/v2/checkout/orders/" + encodeURIComponent(orderId),
    {
      method: "GET",
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("PayPal order lookup failed (" + res.status + "): " + text);
  }
  const data: {
    id?: string;
    status?: string;
    purchase_units?: { custom_id?: string }[];
    payer?: { email_address?: string };
  } = await res.json();
  return {
    id: data.id || orderId,
    status: data.status || "",
    custom_id: data?.purchase_units?.[0]?.custom_id ?? null,
    payerEmail: data?.payer?.email_address,
  };
}
