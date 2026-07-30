import { NextRequest, NextResponse } from "next/server";
import { initiatePesepayTransaction } from "@/lib/pesepay";
import { createPendingLicense, generateMerchantReference } from "@/lib/license";

const PRICE_USD = Number(process.env.LICENSE_PRICE_USD || 149);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const merchantReference = generateMerchantReference();

    await createPendingLicense({
      merchantReference,
      amount: PRICE_USD,
      currencyCode: "USD",
      email,
    });

    const result = await initiatePesepayTransaction({
      amount: PRICE_USD,
      currencyCode: "USD",
      reasonForPayment: "OrigynLX annual license",
      merchantReference,
      resultUrl: `${siteUrl}/api/payment/webhook`,
      returnUrl: `${siteUrl}/payment/success?ref=${merchantReference}`,
    });

    return NextResponse.json({ redirectUrl: result.redirectUrl, merchantReference });
  } catch (err: any) {
    console.error("payment/initiate error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again shortly." },
      { status: 500 }
    );
  }
}
