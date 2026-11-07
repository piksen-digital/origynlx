import type { BOMLineItem, RVCResult, DeMinimisResult } from "./rvc-calculator";
import type { CertifierInfo } from "./certificate-pdf";
import type { DutySavingsResult } from "./duty-savings";
import type { OriginEngineeringResult } from "./origin-engineering";
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

export interface BrokerPackageInput {
  productName: string;
  hsSubheading: string;
  tariffItem: string;
  productionCountry: string;
  importingParty: string;
  lineItems: BOMLineItem[];
  result: RVCResult;
  deMinimis: DeMinimisResult | null;
  certInfo: CertifierInfo;
  savings: DutySavingsResult | null;
  engineering: OriginEngineeringResult | null;
}

function clip(s: string, max: number): string {
  return s && s.length > max ? s.slice(0, max - 1) + "..." : s || "-";
}

export async function generateBrokerPackagePDF(input: BrokerPackageInput): Promise<Uint8Array> {
  const ctx = await newBrandedDoc(
    "USMCA Qualification Package",
    "Prepared for review by a licensed customs broker - OrigynLX"
  );

  heading(ctx, "Product snapshot");
  keyLine(ctx, "Product", clip(input.productName, 55));
  keyLine(ctx, "HS subheading", input.hsSubheading || "-");
  keyLine(ctx, "US tariff item", input.tariffItem || "-");
  keyLine(ctx, "Production country", input.productionCountry || "-");
  keyLine(ctx, "Importing party", input.importingParty || "-");
  ctx.y -= 4;

  heading(ctx, "RVC determination");
  keyLine(ctx, "Method", input.result.basis === "net-cost" ? "Net cost (Article 4.5(2))" : "Transaction value (Article 4.5(1))");
  keyLine(ctx, "Transaction value", "$" + input.result.transactionValue.toLocaleString("en-US"));
  if (input.result.basis === "net-cost" && input.result.netCost !== null) {
    keyLine(ctx, "Net cost", "$" + input.result.netCost.toLocaleString("en-US"));
  }
  keyLine(ctx, "Originating value", "$" + input.result.originatingValue.toLocaleString("en-US"));
  keyLine(ctx, "Non-originating value", "$" + input.result.nonOriginatingValue.toLocaleString("en-US"));
  ensureSpace(ctx, 26, "OrigynLX");
  statusBadge(ctx, input.result.qualifies);
  ctx.page.drawText(
    "RVC result: " + input.result.rvcPercent + "%   vs   " + input.result.thresholdPercent + "% threshold",
    { x: MARGIN, y: ctx.y, size: 11, font: ctx.fonts.bold, color: BRAND.ink }
  );
  ctx.y -= 17;
  bodyText(
    ctx,
    "Margin: " + (input.result.marginPercent > 0 ? "+" : "") + input.result.marginPercent + " percentage points",
    { size: 9, color: BRAND.gray }
  );
  for (const w of input.result.warnings.slice(0, 4)) {
    wrappedBody(ctx, "Warning: " + w, 105, { size: 8.5, color: BRAND.gray });
  }
  ctx.y -= 4;

  if (input.engineering) {
    heading(ctx, "Sourcing sensitivity");
    if (input.engineering.mode === "fix-it") {
      keyLine(ctx, "Originating content gap", "$" + (input.engineering.dollarGap ?? 0).toLocaleString("en-US"));
      if (input.engineering.cheapestQualifyingSwaps.length > 0) {
        const s = input.engineering.cheapestQualifyingSwaps[0];
        keyLine(ctx, "Cheapest single swap", clip(s.description, 40) + " ($" + s.value.toLocaleString("en-US") + ") -> RVC " + s.newRvcPercent + "%");
      }
    } else {
      keyLine(ctx, "Headroom before failing", "$" + (input.engineering.headroomValue ?? 0).toLocaleString("en-US"));
    }
    ctx.y -= 4;
  }

  if (input.savings && input.savings.applies) {
    heading(ctx, "Duty savings snapshot (estimate)");
    keyLine(ctx, "MFN duty avoided / yr", "$" + input.savings.annualDutyAvoided.toLocaleString("en-US"));
    keyLine(ctx, "Surcharge avoided / yr", "$" + input.savings.annualSurchargeAvoided.toLocaleString("en-US"));
    keyLine(ctx, "MPF avoided / yr", "$" + input.savings.annualMpfAvoided.toLocaleString("en-US"));
    keyLine(ctx, "Total estimated / yr", "$" + input.savings.totalAnnualAvoided.toLocaleString("en-US"));
    ctx.y -= 4;
  }

  if (input.deMinimis) {
    heading(ctx, "De minimis reference (Article 4.12)");
    keyLine(ctx, "Non-originating % of value", input.deMinimis.nonOriginatingPercent + "% (reference limit 10%)");
    keyLine(ctx, "Within de minimis", input.deMinimis.withinDeMinimis ? "Yes" : "No");
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
  input.lineItems.forEach((item: BOMLineItem, i: number) => {
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
  ctx.y -= 4;

  heading(ctx, "Draft certification data elements (Annex 5-A)");
  keyLine(ctx, "Certifier", clip(input.certInfo.certifierName, 45) + " (" + input.certInfo.certifierType + ")");
  keyLine(ctx, "Producer", clip(input.certInfo.producerName, 50) || "Same as certifier");
  keyLine(ctx, "Importer", clip(input.certInfo.importerName, 50));
  keyLine(ctx, "Blanket period", (input.certInfo.blanketPeriodStart || "-") + " to " + (input.certInfo.blanketPeriodEnd || "-"));
  ctx.y -= 4;

  heading(ctx, "Broker review checklist");
  const checklist: string[] = [
    "Classification confirmed for the 10-digit tariff item",
    "Applicable product-specific rule confirmed (USMCA Annex 4-B / HTSUS GN 11)",
    "RVC arithmetic verified against the BOM and supporting records",
    "Tariff-shift analysis completed for every non-originating input",
    "De minimis (Article 4.12) assessed where relevant",
    "All nine certification data elements complete",
    "Signature and date present on the executed certification",
    "Records retained for five years from the date of the certification",
  ];
  for (const item of checklist) {
    ensureSpace(ctx, 18, "OrigynLX");
    ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 1, width: 9, height: 9, borderColor: BRAND.gray, borderWidth: 0.8, color: BRAND.white });
    ctx.page.drawText(item, { x: MARGIN + 16, y: ctx.y, size: 9, font: ctx.fonts.regular, color: BRAND.ink });
    ctx.y -= 16;
  }
  ctx.y -= 4;

  wrappedBody(
    ctx,
    "Prepared by the certifying party using OrigynLX. This package is a work product for review by a licensed customs broker, who retains final authority over any origin determination, classification and certification.",
    105,
    { size: 8.5, color: BRAND.gray }
  );

  drawFooters(ctx);
  return ctx.doc.save();
}
