import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { BOMLineItem, RVCResult, DeMinimisResult } from "./rvc-calculator";

export async function generateAuditWorksheetPDF(
  productName: string,
  lineItems: BOMLineItem[],
  result: RVCResult,
  deMinimis: DeMinimisResult | null
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  let page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  const margin = 54;
  let y = 792 - margin;
  const ink = rgb(0.06, 0.06, 0.07);
  const gray = rgb(0.4, 0.4, 0.42);

  function ensureSpace(needed: number) {
    if (y - needed < margin) {
      page = doc.addPage([612, 792]);
      y = 792 - margin;
    }
  }

  function text(str: string, size = 10, f = font, color = ink, x = margin) {
    ensureSpace(size + 4);
    page.drawText(str, { x, y, size, font: f, color });
  }
  function line(gap = 16) {
    y -= gap;
  }

  text("OrigynLX — Internal Qualification Worksheet", 16, bold);
  line(18);
  text(`Generated ${new Date().toLocaleString()} — for internal recordkeeping, not a signed certificate.`, 9, font, gray);
  line(28);

  text(`Product: ${productName}`, 12, bold);
  line(22);

  text("Regional Value Content", 11, bold);
  line(16);
  text(`Transaction value: $${result.transactionValue.toLocaleString()}`, 10);
  line(14);
  text(`Originating value: $${result.originatingValue.toLocaleString()}`, 10);
  line(14);
  text(`Non-originating value: $${result.nonOriginatingValue.toLocaleString()}`, 10);
  line(14);
  text(`RVC result: ${result.rvcPercent}%  vs  ${result.thresholdPercent}% threshold  ->  ${result.qualifies ? "QUALIFIES" : "DOES NOT QUALIFY"}`, 11, bold);
  line(14);
  text(`Margin above/below threshold: ${result.marginPercent > 0 ? "+" : ""}${result.marginPercent} points`, 10, font, gray);
  line(26);

  if (deMinimis) {
    text("De Minimis Reference Check (Article 4.12)", 11, bold);
    line(16);
    text(`Non-originating value as % of transaction value: ${deMinimis.nonOriginatingPercent}% (threshold ${deMinimis.thresholdPercent}%)`, 10);
    line(14);
    text(`Within de minimis allowance: ${deMinimis.withinDeMinimis ? "Yes" : "No"}`, 10);
    line(14);
    for (const note of deMinimis.notes) {
      text(wrap(note, 95), 8.5, font, gray);
      line(11);
    }
    line(14);
  }

  if (result.warnings.length > 0) {
    text("Warnings", 11, bold);
    line(16);
    for (const w of result.warnings) {
      text(wrap(w, 95), 9, font, gray);
      line(13);
    }
    line(10);
  }

  ensureSpace(30);
  text("Full Bill of Materials", 11, bold);
  line(18);
  text("Description", 9, bold, ink, margin);
  text("HS Code", 9, bold, ink, margin + 220);
  text("Origin", 9, bold, ink, margin + 320);
  text("Value", 9, bold, ink, margin + 380);
  text("Originating", 9, bold, ink, margin + 450);
  line(14);
  page.drawLine({ start: { x: margin, y: y + 6 }, end: { x: 612 - margin, y: y + 6 }, thickness: 0.5, color: gray });

  for (const item of lineItems) {
    ensureSpace(16);
    text((item.description || "—").slice(0, 34), 9, font, ink, margin);
    text(item.hsCode || "—", 9, mono, ink, margin + 220);
    text(item.countryOfOrigin || "—", 9, font, ink, margin + 320);
    text(`$${item.value.toLocaleString()}`, 9, font, ink, margin + 380);
    text(item.originating ? "Yes" : "No", 9, font, ink, margin + 450);
    line(15);
  }

  line(20);
  text("This worksheet reflects the data entered at the time of generation. It is not a signed", 8.5, font, gray);
  line(11);
  text("Certificate of Origin and carries no legal weight on its own — keep it as your own audit trail", 8.5, font, gray);
  line(11);
  text("for how a qualification decision was reached.", 8.5, font, gray);

  return doc.save();
}

function wrap(str: string, maxChars: number): string {
  return str.length > maxChars ? str.slice(0, maxChars - 1) + "…" : str;
}
