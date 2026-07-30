import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { BOMLineItem, RVCResult } from "./rvc-calculator";

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

export async function generateCertificatePDF(
  productName: string,
  lineItems: BOMLineItem[],
  result: RVCResult,
  info: CertifierInfo
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // US Letter
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 54;
  let y = 792 - margin;
  const ink = rgb(0.06, 0.06, 0.07);
  const gray = rgb(0.4, 0.4, 0.42);

  function text(str: string, size = 10, f = font, color = ink, x = margin) {
    page.drawText(str, { x, y, size, font: f, color });
  }
  function line(gap = 16) {
    y -= gap;
  }

  text("USMCA Certificate of Origin — DRAFT", 16, bold);
  line(20);
  text("Prepared with OrigynLX. Not valid until reviewed and signed by the certifying party.", 9, font, gray);
  line(26);

  // 1. Certifier
  text("1. Certifier", 11, bold);
  line(15);
  text(`Certifying as: ${info.certifierType}`, 10);
  line(14);
  text(`${info.certifierName}`, 10);
  line(14);
  text(`${info.certifierAddress}`, 10);
  line(14);
  text(`${info.certifierEmail}  •  ${info.certifierPhone}`, 10);
  line(22);

  // 2. Exporter (same as certifier note)
  text("2. Exporter", 11, bold);
  line(15);
  text(`${info.certifierName}`, 10);
  line(22);

  // 3. Producer
  text("3. Producer", 11, bold);
  line(15);
  text(`${info.producerName || "Same as certifier"}`, 10);
  line(14);
  text(`${info.producerAddress || "—"}`, 10);
  line(22);

  // 4. Importer
  text("4. Importer", 11, bold);
  line(15);
  text(`${info.importerName || "—"}`, 10);
  line(14);
  text(`${info.importerAddress || "—"}`, 10);
  line(22);

  // 5. Description and HS classification
  text("5. Description and HS Classification of Good(s)", 11, bold);
  line(15);
  text(`Product: ${productName}`, 10);
  line(16);
  for (const item of lineItems.slice(0, 8)) {
    text(`• ${item.description || "Unnamed component"}  —  HS ${item.hsCode || "—"}  —  ${item.countryOfOrigin}`, 9, font, gray);
    line(13);
  }
  line(8);

  // 6. Origin criterion
  text("6. Origin Criterion", 11, bold);
  line(15);
  text(
    `Regional Value Content (Transaction Value method): ${result.rvcPercent}% vs ${result.thresholdPercent}% threshold — ${result.qualifies ? "MEETS" : "DOES NOT MEET"} threshold.`,
    10
  );
  line(22);

  // 7. Blanket period
  text("7. Blanket Period (if applicable)", 11, bold);
  line(15);
  text(`${info.blanketPeriodStart || "—"} to ${info.blanketPeriodEnd || "—"}`, 10);
  line(22);

  // 8. Authorized signature
  text("8. Authorized Signature", 11, bold);
  line(28);
  page.drawLine({ start: { x: margin, y }, end: { x: margin + 220, y: y }, thickness: 0.8, color: gray });
  line(14);
  text("Signature of certifying party", 9, font, gray);
  line(24);

  // 9. Company, title, date
  text("9. Company, Title, Date", 11, bold);
  line(15);
  text("Company: ______________________   Title: ______________________   Date: ____________", 10);
  line(30);

  text(
    "This document is a draft prepared for internal review. OrigynLX provides an estimate of origin",
    8.5,
    font,
    gray
  );
  line(11);
  text(
    "qualification for informational use only and is not legal advice. The certifying party is solely",
    8.5,
    font,
    gray
  );
  line(11);
  text("responsible for the accuracy of this certification.", 8.5, font, gray);

  return doc.save();
}
