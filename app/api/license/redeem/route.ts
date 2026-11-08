import { NextRequest, NextResponse } from "next/server";
import {
  createResumeCookieToken,
  getLicenseByKey,
  RESUME_COOKIE_NAME,
  resumeCookieOptions,
} from "@/lib/license";

export async function POST(req: NextRequest) {
  try {
    const { licenseKey } = await req.json();
    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json({ valid: false, error: "Enter a license key." }, { status: 400 });
    }

    const record = await getLicenseByKey(licenseKey.trim().toUpperCase());
    if (!record || record.status !== "active") {
      return NextResponse.json({ valid: false, error: "That license key isn't active." }, { status: 404 });
    }

    const response = NextResponse.json({ valid: true });
    // No-signup persistence: remember this browser with an opaque httpOnly
    // cookie so a cleared localStorage never demotes a paying customer.
    try {
      const token = await createResumeCookieToken(record.merchantReference, record.email);
      response.cookies.set(RESUME_COOKIE_NAME, token, resumeCookieOptions());
    } catch (err) {
      console.error("license/redeem: could not set resume cookie:", err);
    }
    return response;
  } catch (err) {
    console.error("license/redeem error:", err);
    return NextResponse.json({ valid: false, error: "Could not verify license key." }, { status: 500 });
  }
}
