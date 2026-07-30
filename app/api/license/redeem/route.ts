import { NextRequest, NextResponse } from "next/server";
import { getLicenseByKey } from "@/lib/license";

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

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("license/redeem error:", err);
    return NextResponse.json({ valid: false, error: "Could not verify license key." }, { status: 500 });
  }
}
