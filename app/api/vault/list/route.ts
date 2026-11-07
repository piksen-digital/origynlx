import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, listVaultRecords } from "@/lib/vault";

export async function GET(req: NextRequest) {
  try {
    const licenseKey = req.nextUrl.searchParams.get("licenseKey") || "";
    if (!licenseKey) {
      return NextResponse.json({ error: "Missing license key." }, { status: 400 });
    }
    if (!(await isLicenseActive(licenseKey))) {
      return NextResponse.json({ error: "That license is not active." }, { status: 403 });
    }
    const records = await listVaultRecords(licenseKey);
    return NextResponse.json({ records });
  } catch (err: any) {
    console.error("vault/list error:", err);
    return NextResponse.json({ error: "Could not load the vault." }, { status: 500 });
  }
}
