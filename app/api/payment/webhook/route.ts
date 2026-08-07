import { NextRequest, NextResponse } from "next/server";
import { decryptPesepayWebhookBody } from "@/lib/pesepay";
import { activateLicense, markLicenseFailed, sendLicenseEmail, getLicenseByPesepayReference } from "@/lib/license";

/**
 * Pesepay calls this URL server-to-server once a payment resolves (the
 * resultUrl we send at initiate time). This is a best-effort fast path -
 * /api/payment/verify actively polls Pesepay too, so a purchase still
 * completes correctly even if this webhook never arrives.
 *
 * Looks up the record by merchantReference if present in the payload,
 * falling back to Pesepay's own referenceNumber (which we indexed at
 * initiate time) since the webhook payload may not echo our reference back.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const encryptedPayload: string | undefined = body?.payload;

    if (!encryptedPayload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const decrypted = decryptPesepayWebhookBody(encryptedPayload);

    let merchantReference: string | undefined =
      decrypted?.merchantReference || decrypted?.reference;
    const pesepayReferenceNumber: string | undefined =
      decrypted?.referenceNumber || decrypted?.transactionReference;
    const rawStatus: string =
      String(decrypted?.transactionStatus || decrypted?.status || "").toUpperCase();

    if (!merchantReference && pesepayReferenceNumber) {
      const byRef = await getLicenseByPesepayReference(pesepayReferenceNumber);
      merchantReference = byRef?.merchantReference;
    }

    if (!merchantReference) {
      console.error("payment/webhook: could not resolve a merchantReference from payload:", decrypted);
      return NextResponse.json({ error: "Could not resolve merchant reference" }, { status: 400 });
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
