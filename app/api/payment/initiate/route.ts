import { NextRequest, NextResponse } from "next/server";
import { initiatePesepayTransaction } from "@/lib/pesepay";
import { createPendingLicense, generateMerchantReference, attachPesepayTracking } from "@/lib/license";
import { resolvePlan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = resolvePlan(body?.plan);
    const email = typeof body?.email === "string" ? body.email.trim() : undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const merchantReference = generateMerchantReference();

    await createPendingLicense({
      merchantReference,
      amount: plan.priceUsd,
      currencyCode: "USD",
      email,
      termDays: plan.termDays,
    });

    const result = await initiatePesepayTransaction({
      amount: plan.priceUsd,
      currencyCode: "USD",
      reasonForPayment: plan.reasonForPayment,
      merchantReference,
      resultUrl: `${siteUrl}/api/payment/webhook`,
      returnUrl: `${siteUrl}/payment/success?ref=${merchantReference}`,
    });

    await attachPesepayTracking(merchantReference, result.referenceNumber, result.pollUrl);

    return NextResponse.json({ redirectUrl: result.redirectUrl, merchantReference });
  } catch (err: any) {
    console.error("payment/initiate error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again shortly." },
      { status: 500 }
    );
  }
}
