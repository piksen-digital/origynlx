import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, deleteVaultRecord } from "@/lib/vault";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const licenseKey = typeof body?.licenseKey === "string" ? body.licenseKey : "";
    const id = typeof body?.id === "string" ? body.id : "";
    if (!licenseKey || !id) {
      return NextResponse.json({ error: "Missing license key or record id." }, { status: 400 });
    }
    if (!(await isLicenseActive(licenseKey))) {
      return NextResponse.json({ error: "That license is not active." }, { status: 403 });
    }
    const ok = await deleteVaultRecord(licenseKey, id);
    if (!ok) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("vault/delete error:", err);
    return NextResponse.json({ error: "Could not delete that record." }, { status: 500 });
  }
}
