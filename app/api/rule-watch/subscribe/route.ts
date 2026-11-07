import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, subscribeRuleWatch } from "@/lib/rule-watch";

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
    const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const watch = await subscribeRuleWatch(licenseKey, raw);
    return NextResponse.json({ id: watch.id, sku: watch.sku, alreadyWatching: true });
  } catch (err: any) {
    console.error("rule-watch/subscribe error:", err);
    return NextResponse.json({ error: err.message || "Could not add this product to the watch list." }, { status: 400 });
  }
}
