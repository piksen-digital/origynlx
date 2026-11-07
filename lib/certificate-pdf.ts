import type { BOMLineItem, RVCResult } from "./rvc-calculator";
import {
  BRAND,
  MARGIN,
  PAGE_W,
  newBrandedDoc,
  heading,
  bodyText,
  statusBadge,
  ensureSpace,
  drawFooters,
} from "./pdf-branding";

export interface CertifierInfo {
  certifierType: "Importer" | "Exporter" | "Producer";
  certifierName: string;
  certifierAddress: string;
  certifierEmail: string;
  certifierPhone: string;
  producerName: string;
  producerAddress: string;
  importerName: string;
  importerAddress: string;
  blanketPeriodStart: string;
  blanketPeriodEnd: string;
}

function clip(s: string, max: number): string {
  return s && s.length > max ? s.slice(0, max - 1) + "..." : s || "-";
}

export async function generateCertificatePDF(
  productName: string,
  lineItems: BOMLineItem[],
  result: RVCResult,
  info: CertifierInfo
): Promise<Uint8Array> {
  const ctx = await newBrandedDoc(
    "USMCA Certification of Origin",
    "DRAFT - not valid until reviewed and signed by the certifying party"
  );

  heading(ctx, "1. Certifier");
  bodyText(ctx, "Certifying as: " + info.certifierType, { size: 9.5 });
  bodyText(ctx, clip(info.certifierName, 90), { size: 9.5 });
  bodyText(ctx, clip(info.certifierAddress, 90), { size: 9.5, color: BRAND.gray });
  bodyText(ctx, clip(info.certifierEmail, 60) + "   " + clip(info.certifierPhone, 30), { size: 9.5, color: BRAND.gray });
  ctx.y -= 6;

  heading(ctx, "2. Exporter");
  bodyText(ctx, "Same as certifier", { size: 9.5, color: BRAND.gray });
  ctx.y -= 6;

  heading(ctx, "3. Producer");
  bodyText(ctx, clip(info.producerName, 90) || "Same as certifier", { size: 9.5 });
  if (info.producerAddress) {
    bodyText(ctx, clip(info.producerAddress, 90), { size: 9.5, color: BRAND.gray });
  }
  ctx.y -= 6;

  heading(ctx, "4. Importer");
  bodyText(ctx, clip(info.importerName, 90), { size: 9.5 });
  if (info.importerAddress) {
    bodyText(ctx, clip(info.importerAddress, 90), { size: 9.5, color: BRAND.gray });
  }
  ctx.y -= 6;

  heading(ctx, "5. Description and HS classification of goods");
  bodyText(ctx, "Product: " + clip(productName, 80), { size: 9.5, font: ctx.fonts.bold });
  for (const item of lineItems.slice(0, 8)) {
    bodyText(
      ctx,
      "- " + clip(item.description || "Unnamed component", 40) + "  HS " + (item.hsCode || "-") + "  " + (item.countryOfOrigin || "-"),
      { size: 8.5, color: BRAND.gray }
    );
  }
  if (lineItems.length > 8) {
    bodyText(ctx, "Plus " + String(lineItems.length - 8) + " more line items (see worksheet / BOM).", { size: 8.5, color: BRAND.gray });
  }
  ctx.y -= 6;

  heading(ctx, "6. Origin criterion");
  ensureSpace(ctx, 26, "OrigynLX");
  statusBadge(ctx, result.qualifies);
  ctx.page.drawText(
    "Regional Value Content (" + (result.basis === "net-cost" ? "net cost" : "transaction value") + " method): " +
      result.rvcPercent + "% vs " + result.thresholdPercent + "% threshold",
    { x: MARGIN, y: ctx.y, size: 9.5, font: ctx.fonts.bold, color: BRAND.ink }
  );
  ctx.y -= 17;
  bodyText(ctx, "Origin criterion: satisfies the applicable product-specific rule of origin (USMCA Annex 4-B).", { size: 9, color: BRAND.gray });
  ctx.y -= 6;

  heading(ctx, "7. Blanket period (if applicable)");
  bodyText(ctx, (info.blanketPeriodStart || "-") + "  to  " + (info.blanketPeriodEnd || "-"), { size: 9.5 });
  ctx.y -= 6;

  heading(ctx, "8. Authorized signature");
  ensureSpace(ctx, 46, "OrigynLX");
  ctx.page.drawLine({ start: { x: MARGIN, y: ctx.y }, end: { x: MARGIN + 230, y: ctx.y }, thickness: 0.8, color: BRAND.gray });
  ctx.y -= 12;
  bodyText(ctx, "Signature of certifying party", { size: 8.5, color: BRAND.gray });
  ctx.y -= 10;

  heading(ctx, "9. Company, title and date");
  ensureSpace(ctx, 30, "OrigynLX");
  ctx.page.drawLine({ start: { x: MARGIN, y: ctx.y }, end: { x: MARGIN + 170, y: ctx.y }, thickness: 0.7, color: BRAND.gray });
  ctx.page.drawLine({ start: { x: MARGIN + 190, y: ctx.y }, end: { x: MARGIN + 360, y: ctx.y }, thickness: 0.7, color: BRAND.gray });
  ctx.page.drawLine({ start: { x: MARGIN + 380, y: ctx.y }, end: { x: MARGIN + 500, y: ctx.y }, thickness: 0.7, color: BRAND.gray });
  ctx.y -= 12;
  bodyText(ctx, "Company                                            Title                                       Date", { size: 8.5, color: BRAND.gray });
  ctx.y -= 8;

  drawFooters(ctx);
  return ctx.doc.save();
}
