import { NextRequest, NextResponse } from "next/server";
import { getLicenseByReference } from "@/lib/license";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  const record = await getLicenseByReference(ref);
  if (!record) {
    return NextResponse.json({ status: "unknown" });
  }

  return NextResponse.json({
    status: record.status,
    licenseKey: record.status === "active" ? record.licenseKey : undefined,
  });
}
