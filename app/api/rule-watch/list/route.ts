import { NextRequest, NextResponse } from "next/server";
import { isLicenseActive, listRuleWatches } from "@/lib/rule-watch";

export async function GET(req: NextRequest) {
  try {
    const licenseKey = req.nextUrl.searchParams.get("licenseKey") || "";
    if (!licenseKey) {
      return NextResponse.json({ error: "Missing license key." }, { status: 400 });
    }
    if (!(await isLicenseActive(licenseKey))) {
      return NextResponse.json({ error: "That license is not active." }, { status: 403 });
    }
    const watches = await listRuleWatches(licenseKey);
    return NextResponse.json({ watches });
  } catch (err: any) {
    console.error("rule-watch/list error:", err);
    return NextResponse.json({ error: "Could not load the watch list." }, { status: 500 });
  }
}
