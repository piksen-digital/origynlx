import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, saveVaultRecord } from "@/lib/vault";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const licenseKey = typeof body?.licenseKey === "string" ? body.licenseKey : "";
    if (!licenseKey) {
      return NextResponse.json({ error: "Missing license key." }, { status: 400 });
    }
    if (!(await isLicenseActive(licenseKey))) {
      return NextResponse.json({ error: "That license is not active." }, { status: 403 });
    }
    const raw = (body?.record && typeof body.record === "object" ? body.record : {}) as Record<
      string,
      unknown
    >;
    const record = await saveVaultRecord(licenseKey, raw);
    return NextResponse.json({ id: record.id, createdAt: record.createdAt });
  } catch (err: any) {
    console.error("vault/save error:", err);
    return NextResponse.json({ error: err.message || "Could not save to the vault." }, { status: 400 });
  }
}
