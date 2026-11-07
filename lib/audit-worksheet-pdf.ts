import type { BOMLineItem, RVCResult, DeMinimisResult } from "./rvc-calculator";
import {
  BRAND,
  MARGIN,
  PAGE_W,
  newBrandedDoc,
  heading,
  bodyText,
  keyLine,
  statusBadge,
  ensureSpace,
  wrappedBody,
  drawFooters,
} from "./pdf-branding";

export async function generateAuditWorksheetPDF(
  productName: string,
  lineItems: BOMLineItem[],
  result: RVCResult,
  deMinimis: DeMinimisResult | null
): Promise<Uint8Array> {
  const ctx = await newBrandedDoc(
    "USMCA Qualification Worksheet",
    "Internal audit record - generated " + new Date().toLocaleString("en-US")
  );

  bodyText(ctx, "Product: " + productName, { size: 12.5, font: ctx.fonts.bold });
  bodyText(
    ctx,
    "Method: " + (result.basis === "net-cost" ? "Net cost (Article 4.5(2))" : "Transaction value (Article 4.5(1))"),
    { size: 9, color: BRAND.gray }
  );
  ctx.y -= 4;

  heading(ctx, "RVC determination");
  keyLine(ctx, "Transaction value", "$" + result.transactionValue.toLocaleString("en-US"));
  if (result.basis === "net-cost" && result.netCost !== null) {
    keyLine(ctx, "Net cost", "$" + result.netCost.toLocaleString("en-US"));
  }
  keyLine(ctx, "Originating value", "$" + result.originatingValue.toLocaleString("en-US"));
  keyLine(ctx, "Non-originating value", "$" + result.nonOriginatingValue.toLocaleString("en-US"));
  ensureSpace(ctx, 26, "OrigynLX");
  statusBadge(ctx, result.qualifies);
  ctx.page.drawText(
    "RVC result: " + result.rvcPercent + "%   vs   " + result.thresholdPercent + "% threshold",
    { x: MARGIN, y: ctx.y, size: 11.5, font: ctx.fonts.bold, color: BRAND.ink }
  );
  ctx.y -= 17;
  bodyText(
    ctx,
    "Margin above/below threshold: " + (result.marginPercent > 0 ? "+" : "") + result.marginPercent + " percentage points",
    { size: 9, color: BRAND.gray }
  );
  ctx.y -= 4;

  if (deMinimis) {
    heading(ctx, "De minimis reference check (Article 4.12)");
    keyLine(ctx, "Non-originating value", "$" + deMinimis.nonOriginatingValue.toLocaleString("en-US"));
    keyLine(ctx, "As % of transaction value", deMinimis.nonOriginatingPercent + "% (reference limit " + deMinimis.thresholdPercent + "%)");
    keyLine(ctx, "Within de minimis", deMinimis.withinDeMinimis ? "Yes - see notes" : "No");
    for (const note of deMinimis.notes) {
      wrappedBody(ctx, note, 105, { size: 8.5, color: BRAND.gray });
    }
    ctx.y -= 4;
  }

  if (result.warnings.length > 0) {
    heading(ctx, "Warnings");
    for (const w of result.warnings) {
      wrappedBody(ctx, w, 105, { size: 9, color: BRAND.gray });
    }
    ctx.y -= 4;
  }

  heading(ctx, "Bill of materials");
  ensureSpace(ctx, 34, "OrigynLX");
  const colDesc = MARGIN;
  const colHs = MARGIN + 230;
  const colOrigin = MARGIN + 328;
  const colValue = MARGIN + 395;
  const colStatus = MARGIN + 465;
  ctx.page.drawText("Description", { x: colDesc, y: ctx.y, size: 8.5, font: ctx.fonts.bold, color: BRAND.ink });
  ctx.page.drawText("HS code", { x: colHs, y: ctx.y, size: 8.5, font: ctx.fonts.bold, color: BRAND.ink });
  ctx.page.drawText("Origin", { x: colOrigin, y: ctx.y, size: 8.5, font: ctx.fonts.bold, color: BRAND.ink });
  ctx.page.drawText("Value", { x: colValue, y: ctx.y, size: 8.5, font: ctx.fonts.bold, color: BRAND.ink });
  ctx.page.drawText("USMCA orig.", { x: colStatus, y: ctx.y, size: 8.5, font: ctx.fonts.bold, color: BRAND.ink });
  ctx.y -= 6;
  ctx.page.drawLine({ start: { x: MARGIN, y: ctx.y + 2 }, end: { x: PAGE_W - MARGIN, y: ctx.y + 2 }, thickness: 0.7, color: BRAND.gold });
  ctx.y -= 6;

  lineItems.forEach((item: BOMLineItem, i: number) => {
    ensureSpace(ctx, 17, "OrigynLX");
    if (i % 2 === 1) {
      ctx.page.drawRectangle({ x: MARGIN - 4, y: ctx.y - 4, width: PAGE_W - 2 * MARGIN + 8, height: 15, color: BRAND.rowShade });
    }
    ctx.page.drawText((item.description || "-").slice(0, 34), { x: colDesc, y: ctx.y, size: 8.5, font: ctx.fonts.regular, color: BRAND.ink });
    ctx.page.drawText(item.hsCode || "-", { x: colHs, y: ctx.y, size: 8.5, font: ctx.fonts.mono, color: BRAND.ink });
    ctx.page.drawText(item.countryOfOrigin || "-", { x: colOrigin, y: ctx.y, size: 8.5, font: ctx.fonts.regular, color: BRAND.ink });
    ctx.page.drawText("$" + item.value.toLocaleString("en-US"), { x: colValue, y: ctx.y, size: 8.5, font: ctx.fonts.regular, color: BRAND.ink });
    ctx.page.drawText(item.originating ? "Yes" : "No", { x: colStatus, y: ctx.y, size: 8.5, font: ctx.fonts.regular, color: item.originating ? BRAND.pass : BRAND.fail });
    ctx.y -= 15;
  });

  ctx.y -= 10;
  wrappedBody(
    ctx,
    "This worksheet reflects the data entered at the time of generation. It is not a signed Certificate of Origin and carries no legal weight on its own - keep it as your own audit trail for how this qualification decision was reached.",
    105,
    { size: 8.5, color: BRAND.gray }
  );

  drawFooters(ctx);
  return ctx.doc.save();
}
