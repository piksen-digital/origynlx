import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, ackRuleWatchAlert } from "@/lib/rule-watch";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const licenseKey = typeof body?.licenseKey === "string" ? body.licenseKey : "";
    const id = typeof body?.id === "string" ? body.id : "";
    if (!licenseKey || !id) {
      return NextResponse.json({ error: "Missing license key or watch id." }, { status: 400 });
    }
    if (!(await isLicenseActive(licenseKey))) {
      return NextResponse.json({ error: "That license is not active." }, { status: 403 });
    }
    const ok = await ackRuleWatchAlert(licenseKey, id);
    if (!ok) {
      return NextResponse.json({ error: "No pending alert on that watch." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("rule-watch/ack error:", err);
    return NextResponse.json({ error: "Could not dismiss that alert." }, { status: 500 });
  }
}
