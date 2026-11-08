import { NextRequest, NextResponse } from "next/server";
import {
  activateLicense,
  getLicenseByPaypalOrderId,
  markLicenseFailed,
  sendLicenseEmail,
} from "@/lib/license";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = typeof body?.orderId === "string" ? body.orderId : "";
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
    }
    const capture = await capturePayPalOrder(orderId);
    const alreadyCaptured = capture.status === "ALREADY_CAPTURED";
    if (capture.status !== "COMPLETED" && !alreadyCaptured) {
      if (capture.merchantReference) {
        await markLicenseFailed(capture.merchantReference);
      }
      return NextResponse.json({ status: "failed" });
    }
    let ref = capture.merchantReference;
    if (!ref) {
      const byOrder = await getLicenseByPaypalOrderId(orderId);
      ref = byOrder ? byOrder.merchantReference : null;
    }
    if (!ref) {
      return NextResponse.json(
        { error: "Order is missing its OrigynLX reference - please contact support with your PayPal receipt." },
        { status: 500 }
      );
    }
    const { record, justActivated } = await activateLicense(ref, "paypal_order_" + orderId);
    if (justActivated) {
      const forEmail = capture.payerEmail && !record.email ? { ...record, email: capture.payerEmail } : record;
      await sendLicenseEmail(forEmail);
    }
    return NextResponse.json({ status: "active", licenseKey: record.licenseKey });
  } catch (err: any) {
    console.error("paypal/capture-order error:", err);
    return NextResponse.json(
      { error: "Could not confirm the PayPal payment. If you were charged, contact support with your PayPal receipt." },
      { status: 500 }
    );
  }
}
