import { NextRequest, NextResponse } from "next/server";
import {
  createPendingLicense,
  generateMerchantReference,
  attachPaypalOrderId,
} from "@/lib/license";
import { createPayPalOrder, paypalConfigured } from "@/lib/paypal";

const PRICE_USD = Number(process.env.LICENSE_PRICE_USD || 149);

export async function POST(req: NextRequest) {
  try {
    if (!paypalConfigured()) {
      return NextResponse.json(
        { error: "PayPal checkout is not configured yet. Please use the contact page for invoicing." },
        { status: 503 }
      );
    }
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    const merchantReference = generateMerchantReference();
    await createPendingLicense({
      merchantReference,
      amount: PRICE_USD,
      currencyCode: "USD",
      email,
    });
    const order = await createPayPalOrder({ amount: PRICE_USD, merchantReference });
    await attachPaypalOrderId(merchantReference, order.orderId);
    return NextResponse.json({ orderId: order.orderId, merchantReference });
  } catch (err: any) {
    console.error("paypal/create-order error:", err);
    return NextResponse.json(
      { error: "Could not start PayPal checkout. Please try again shortly." },
      { status: 500 }
    );
  }
}
