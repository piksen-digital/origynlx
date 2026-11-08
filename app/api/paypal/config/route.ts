import { NextResponse } from "next/server";
import { paypalConfigured } from "@/lib/paypal";

export async function GET() {
  return NextResponse.json({
    enabled: paypalConfigured(),
    clientId: process.env.PAYPAL_CLIENT_ID || null,
    priceUsd: Number(process.env.LICENSE_PRICE_USD || 149),
    monthlyPriceUsd: Number(process.env.LICENSE_PRICE_USD_MONTHLY || 19),
    mode: process.env.PAYPAL_ENV === "live" ? "live" : "sandbox",
  });
}
