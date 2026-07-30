import { NextRequest, NextResponse } from "next/server";
import { decryptPesepayWebhookBody } from "@/lib/pesepay";
import { activateLicense, markLicenseFailed } from "@/lib/license";
import { Resend } from "resend";

/**
 * Pesepay calls this URL server-to-server once a payment resolves (the
 * resultUrl we send at initiate time). We decrypt the body the same way we
 * decrypt the initiate response, then activate or fail the license record.
 *
 * VERIFY BEFORE GOING LIVE: confirm the exact field names Pesepay sends here
 * (transactionStatus vs status, paid vs PAID, etc.) against a real sandbox
 * transaction - this handler checks several likely variants defensively,
 * but Pesepay's dashboard/docs are the source of truth.
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
      const record = await activateLicense(merchantReference, pesepayReferenceNumber || "unknown");

      if (record.email && process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
            to: record.email,
            subject: "Your OrigynLX license key",
            text: `Thanks for your purchase.\n\nYour license key: ${record.licenseKey}\n\nEnter it at ${process.env.NEXT_PUBLIC_SITE_URL}/calculator to unlock unlimited checks and certificates.`,
          });
        } catch (emailErr) {
          console.error("Failed to send license email:", emailErr);
        }
      }
    } else {
      await markLicenseFailed(merchantReference);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("payment/webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
