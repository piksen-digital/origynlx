import { NextRequest, NextResponse } from "next/server";
import { getLicenseByKey, type LicenseRecord } from "@/lib/license";
import { buildXlsx, type XlsxCell, type XlsxSheetSpec } from "@/lib/xlsx";

export const runtime = "nodejs";

/**
 * Licensed batch results export as a real XLSX workbook.
 *
 * CSV is the lingua franca of trade data, but some Excel installs open
 * downloaded CSVs as a blank grid (encoding guesses plus line-ending
 * quirks). A real .xlsx removes that entire class of problems: Excel owns
 * the format, colors survive, and the license check happens server-side
 * instead of trusting the client-side gate alone.
 */

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: NextRequest) {
  let body: { licenseKey?: unknown; rows?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const licenseKey = typeof body.licenseKey === "string" ? body.licenseKey.trim().toUpperCase() : "";
  if (!licenseKey) {
    return NextResponse.json({ error: "A license key is required for export." }, { status: 403 });
  }

  let record: LicenseRecord | null = null;
  try {
    record = await getLicenseByKey(licenseKey);
  } catch {
    console.error("export-xlsx: license lookup failed");
    return NextResponse.json({ error: "Could not verify license key." }, { status: 500 });
  }
  if (!record || record.status !== "active") {
    return NextResponse.json({ error: "That license key is not active." }, { status: 403 });
  }

  const rawRows: unknown[] = Array.isArray(body.rows) ? (body.rows as unknown[]) : [];
  if (rawRows.length === 0) {
    return NextResponse.json({ error: "No results to export." }, { status: 400 });
  }

  const spec: XlsxSheetSpec = {
    name: "Batch results",
    columns: [
      { header: "SKU", width: 14 },
      { header: "Product", width: 30 },
      { header: "HS subheading", width: 14 },
      { header: "Method", width: 13 },
      { header: "Threshold %", width: 13 },
      { header: "Threshold source", width: 16 },
      { header: "Matched rule", width: 42 },
      { header: "RVC %", width: 10 },
      { header: "Margin pts", width: 11 },
      { header: "Status", width: 14 },
      { header: "Review reason", width: 55 },
      { header: "Trade remedy flags", width: 40 },
    ],
    rows: [],
  };

  rawRows.slice(0, 5000).forEach((raw: unknown): void => {
    const o = (raw || {}) as Record<string, unknown>;
    const status = str(o.status);
    const isPass = status === "qualifies";
    const isFail = status === "fails";
    const statusLabel = isPass ? "Qualifies" : isFail ? "Fails" : "Needs review";
    const statusStyle = isPass ? "statusPass" : isFail ? "statusFail" : "statusWarn";
    const textStyle = isPass ? "textPass" : isFail ? "textFail" : "textWarn";
    const flags = Array.isArray(o.remedyFlags)
      ? (o.remedyFlags as unknown[]).map((f: unknown): string => str(f)).filter((f: string): boolean => f !== "").join("; ")
      : "";
    spec.rows.push([
      { value: str(o.sku) },
      { value: str(o.productName) },
      { value: str(o.hsSubheading) },
      { value: o.method === "net-cost" ? "Net cost" : "Trans. value" },
      { value: num(o.thresholdPercent) },
      { value: str(o.thresholdSource) },
      { value: str(o.matchedRule) },
      { value: num(o.rvcPercent), style: textStyle },
      { value: num(o.marginPercent) },
      { value: statusLabel, style: statusStyle },
      { value: str(o.reviewReason) },
      { value: flags, style: flags === "" ? undefined : "textFail" },
    ] as XlsxCell[]);
  });

  const bytes: Uint8Array = buildXlsx(spec);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": "attachment; filename=\"origynlx-batch-results.xlsx\"",
    },
  });
}