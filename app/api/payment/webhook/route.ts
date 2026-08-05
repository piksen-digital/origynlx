import { NextRequest, NextResponse } from "next/server";
import { decryptPesepayWebhookBody } from "@/lib/pesepay";
import { activateLicense, markLicenseFailed, sendLicenseEmail } from "@/lib/license";

/**
 * Pesepay calls this URL server-to-server once a payment resolves (the
 * resultUrl we send at initiate time). This is a best-effort fast path -
 * /api/payment/verify actively polls Pesepay too, so a purchase still
 * completes correctly even if this webhook never arrives or the payload
 * shape here turns out to be wrong. Don't remove this once verify's
 * polling is confirmed working - a working webhook is still faster than
 * waiting for the next poll interval.
 *
 * VERIFY BEFORE GOING LIVE: confirm the exact field names Pesepay sends
 * here against a real sandbox transaction.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const encryptedPayload: string | undefined = body?.payload;

    if (!encryptedPayload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const decrypted = decryptPesepayWebhookBody(encryptedPayload);

    const merchantReference: string | undefined =
      decrypted?.merchantReference || decrypted?.reference;
    const pesepayReferenceNumber: string | undefined =
      decrypted?.referenceNumber || decrypted?.transactionReference;
    const rawStatus: string =
      String(decrypted?.transactionStatus || decrypted?.status || "").toUpperCase();

    if (!merchantReference) {
      return NextResponse.json({ error: "No merchant reference in payload" }, { status: 400 });
    }

    const isSuccess = ["SUCCESS", "SUCCESSFUL", "PAID", "COMPLETE", "COMPLETED"].includes(rawStatus);

    if (isSuccess) {
      const { record, justActivated } = await activateLicense(merchantReference, pesepayReferenceNumber || "unknown");
      if (justActivated) await sendLicenseEmail(record);
    } else {
      await markLicenseFailed(merchantReference);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("payment/webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
