import { PDFDocument, PDFFont, PDFPage, StandardFonts, RGB, degrees, rgb } from "pdf-lib";

/**
 * Shared OrigynLX brand kit for generated PDFs: dark header band with gold
 * accents, gold section headings, status badges, and one small-print
 * disclaimer across the footer of every page. Used by the audit worksheet,
 * the draft certificate and the broker review package.
 */

export const BRAND = {
  gold: rgb(0.788, 0.635, 0.153),
  goldDim: rgb(0.545, 0.439, 0.114),
  ink: rgb(0.039, 0.039, 0.043),
  paper: rgb(0.961, 0.961, 0.941),
  white: rgb(1, 1, 1),
  pass: rgb(0.243, 0.557, 0.361),
  passBg: rgb(0.886, 0.945, 0.906),
  fail: rgb(0.761, 0.294, 0.247),
  failBg: rgb(0.949, 0.898, 0.886),
  gray: rgb(0.42, 0.42, 0.45),
  grayLight: rgb(0.66, 0.66, 0.69),
  rowShade: rgb(0.945, 0.949, 0.941),
  band: rgb(0.039, 0.039, 0.043),
};

export const PAGE_W = 612;
export const PAGE_H = 792;
export const MARGIN = 54;

export interface PdfCtx {
  doc: PDFDocument;
  fonts: { regular: PDFFont; bold: PDFFont; mono: PDFFont };
  page: PDFPage;
  y: number;
}

export interface TextOpts {
  size?: number;
  color?: RGB;
  font?: PDFFont;
  indent?: number;
}

export async function newBrandedDoc(title: string, subtitle: string): Promise<PdfCtx> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);
  const page = doc.addPage([PAGE_W, PAGE_H]);
  drawHeaderBand(page, title, subtitle, { regular, bold });
  const ctx: PdfCtx = { doc, fonts: { regular, bold, mono }, page, y: PAGE_H - 124 };
  return ctx;
}

export function drawHeaderBand(
  page: PDFPage,
  title: string,
  subtitle: string,
  fonts: { regular: PDFFont; bold: PDFFont }
): void {
  page.drawRectangle({ x: 0, y: PAGE_H - 96, width: PAGE_W, height: 96, color: BRAND.band });
  page.drawRectangle({ x: 0, y: PAGE_H - 100, width: PAGE_W, height: 4, color: BRAND.gold });
  page.drawText("ORIGYNLX", { x: MARGIN, y: PAGE_H - 30, size: 9, font: fonts.bold, color: BRAND.gold });
  let size = 17;
  while (fonts.bold.widthOfTextAtSize(title, size) > PAGE_W - 2 * MARGIN - 150 && size > 11) {
    size -= 1;
  }
  page.drawText(title, { x: MARGIN, y: PAGE_H - 58, size, font: fonts.bold, color: BRAND.white });
  if (subtitle) {
    page.drawText(subtitle, { x: MARGIN, y: PAGE_H - 76, size: 8.5, font: fonts.regular, color: BRAND.grayLight });
  }
  page.drawRectangle({ x: PAGE_W - MARGIN - 12, y: PAGE_H - 56, width: 12, height: 12, color: BRAND.gold, rotate: degrees(45) });
}

export function addBrandedPage(ctx: PdfCtx, slimTitle: string): void {
  const page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: PAGE_H - 34, width: PAGE_W, height: 34, color: BRAND.band });
  page.drawRectangle({ x: 0, y: PAGE_H - 37, width: PAGE_W, height: 3, color: BRAND.gold });
  page.drawText("ORIGYNLX", { x: MARGIN, y: PAGE_H - 22, size: 8.5, font: ctx.fonts.bold, color: BRAND.gold });
  const labelWidth = ctx.fonts.regular.widthOfTextAtSize(slimTitle, 8.5);
  page.drawText(slimTitle, { x: PAGE_W - MARGIN - labelWidth, y: PAGE_H - 22, size: 8.5, font: ctx.fonts.regular, color: BRAND.grayLight });
  ctx.page = page;
  ctx.y = PAGE_H - 58;
}

export function ensureSpace(ctx: PdfCtx, needed: number, slimTitle: string = "OrigynLX"): void {
  if (ctx.y - needed < 62) {
    addBrandedPage(ctx, slimTitle);
  }
}

export function heading(ctx: PdfCtx, text: string, slimTitle: string = "OrigynLX"): void {
  ensureSpace(ctx, 34, slimTitle);
  ctx.y -= 8;
  ctx.page.drawText(text.toUpperCase(), { x: MARGIN, y: ctx.y, size: 10.5, font: ctx.fonts.bold, color: BRAND.gold });
  ctx.y -= 7;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_W - MARGIN, y: ctx.y },
    thickness: 0.7,
    color: BRAND.gold,
  });
  ctx.y -= 14;
}

export function bodyText(ctx: PdfCtx, text: string, opts: TextOpts = {}, slimTitle: string = "OrigynLX"): void {
  const size = opts.size ?? 9.5;
  ensureSpace(ctx, size + 8, slimTitle);
  ctx.page.drawText(text, {
    x: MARGIN + (opts.indent ?? 0),
    y: ctx.y,
    size,
    font: opts.font ?? ctx.fonts.regular,
    color: opts.color ?? BRAND.ink,
  });
  ctx.y -= size + 8;
}

export function keyLine(ctx: PdfCtx, label: string, value: string, slimTitle: string = "OrigynLX"): void {
  ensureSpace(ctx, 18, slimTitle);
  ctx.page.drawText(label, { x: MARGIN, y: ctx.y, size: 9.5, font: ctx.fonts.bold, color: BRAND.ink });
  ctx.page.drawText(value, { x: MARGIN + 200, y: ctx.y, size: 9.5, font: ctx.fonts.regular, color: BRAND.gray });
  ctx.y -= 18;
}

export function statusBadge(ctx: PdfCtx, qualifies: boolean): void {
  const label = qualifies ? "QUALIFIES" : "DOES NOT QUALIFY";
  const width = ctx.fonts.bold.widthOfTextAtSize(label, 10) + 16;
  const x = PAGE_W - MARGIN - width;
  ctx.page.drawRectangle({ x, y: ctx.y - 3, width, height: 16, color: qualifies ? BRAND.passBg : BRAND.failBg });
  ctx.page.drawRectangle({ x, y: ctx.y + 13, width, height: 2, color: qualifies ? BRAND.pass : BRAND.fail });
  ctx.page.drawText(label, { x: x + 8, y: ctx.y, size: 10, font: ctx.fonts.bold, color: qualifies ? BRAND.pass : BRAND.fail });
}

export function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const candidate = current ? current + " " + w : w;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function wrappedBody(ctx: PdfCtx, text: string, maxChars: number, opts: TextOpts = {}, slimTitle: string = "OrigynLX"): void {
  for (const line of wrapLines(text, maxChars)) {
    bodyText(ctx, line, opts, slimTitle);
  }
}

export function drawFooters(ctx: PdfCtx): void {
  const pages = ctx.doc.getPages();
  const total = pages.length;
  const disclaimer1 =
    "Generated by OrigynLX for informational purposes only. It is not legal, accounting or customs advice, and not a legal determination of origin.";
  const disclaimer2 =
    "Qualification must be confirmed by the certifying party and, where required, by a licensed customs broker before any claim is made on an entry.";
  const disclaimer3 =
    "OrigynLX accepts no liability for decisions made on the basis of this document.";
  pages.forEach((page: PDFPage, idx: number) => {
    page.drawLine({ start: { x: MARGIN, y: 48 }, end: { x: PAGE_W - MARGIN, y: 48 }, thickness: 0.6, color: BRAND.gold });
    page.drawText(disclaimer1, { x: MARGIN, y: 38, size: 6.5, font: ctx.fonts.regular, color: BRAND.gray });
    page.drawText(disclaimer2, { x: MARGIN, y: 29, size: 6.5, font: ctx.fonts.regular, color: BRAND.gray });
    page.drawText(disclaimer3, { x: MARGIN, y: 20, size: 6.5, font: ctx.fonts.regular, color: BRAND.gray });
    const label = "Page " + String(idx + 1) + " of " + String(total);
    page.drawText(label, { x: PAGE_W - MARGIN - ctx.fonts.regular.widthOfTextAtSize(label, 7), y: 38, size: 7, font: ctx.fonts.regular, color: BRAND.gray });
    const brand = (process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app").replace("https://", "");
    page.drawText(brand, { x: PAGE_W - MARGIN - ctx.fonts.regular.widthOfTextAtSize(brand, 7), y: 27, size: 7, font: ctx.fonts.regular, color: BRAND.goldDim });
  });
}
