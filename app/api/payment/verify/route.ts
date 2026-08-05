import { NextRequest, NextResponse } from "next/server";
import { getLicenseByReference, activateLicense, markLicenseFailed, sendLicenseEmail } from "@/lib/license";
import { checkPesepayTransactionStatus } from "@/lib/pesepay";

/**
 * The success page polls this. If the license is still "pending" - meaning
 * the webhook hasn't activated it yet, or never will - this actively asks
 * Pesepay for the transaction's real status instead of just waiting.
 * This is what actually closes the "stuck on Confirming payment" loop.
 */
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  let record = await getLicenseByReference(ref);
  if (!record) {
    return NextResponse.json({ status: "unknown" });
  }

  if (record.status === "pending" && record.pesepayReferenceNumber) {
    try {
      const result = await checkPesepayTransactionStatus(record.pesepayReferenceNumber, record.pesepayPollUrl);
      if (result.status === "success") {
        const { record: activated, justActivated } = await activateLicense(ref, record.pesepayReferenceNumber);
        record = activated;
        if (justActivated) await sendLicenseEmail(activated);
      } else if (result.status === "failed") {
        await markLicenseFailed(ref);
        record = await getLicenseByReference(ref);
      }
      // status === "pending": leave as-is, frontend will poll again
    } catch (err) {
      // Don't fail the whole request just because the status check errored -
      // log it and let the frontend retry on the next poll.
      console.error("payment/verify: status check failed:", err);
    }
  }

  return NextResponse.json({
    status: record?.status ?? "unknown",
    licenseKey: record?.status === "active" ? record.licenseKey : undefined,
  });
}
