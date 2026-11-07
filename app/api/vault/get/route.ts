import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, getVaultRecord } from "@/lib/vault";

export async function GET(req: NextRequest) {
  try {
    const licenseKey = req.nextUrl.searchParams.get("licenseKey") || "";
    const id = req.nextUrl.searchParams.get("id") || "";
    if (!licenseKey || !id) {
      return NextResponse.json({ error: "Missing license key or record id." }, { status: 400 });
    }
    if (!(await isLicenseActive(licenseKey))) {
      return NextResponse.json({ error: "That license is not active." }, { status: 403 });
    }
    const record = await getVaultRecord(licenseKey, id);
    if (!record) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }
    return NextResponse.json({ record });
  } catch (err: any) {
    console.error("vault/get error:", err);
    return NextResponse.json({ error: "Could not load that record." }, { status: 500 });
  }
}
