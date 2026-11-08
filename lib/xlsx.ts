/**
 * Minimal, dependency-free XLSX (Office Open XML) writer.
 *
 * Builds a real .xlsx workbook: a ZIP (stored entries) containing the
 * six required OOXML parts, with inline strings, column widths, a frozen
 * header row, and a small style sheet for color-coded statuses.
 *
 * Why hand-rolled: the repo ships a package-lock.json, so adding an npm
 * spreadsheet dependency risks an out-of-sync lockfile on CI; and a real
 * .xlsx removes the entire class of Excel-opens-CSVs-blank problems.
 */

export type XlsxStyleName =
  | "default"
  | "header"
  | "statusPass"
  | "statusFail"
  | "statusWarn"
  | "textPass"
  | "textFail"
  | "textWarn";

export interface XlsxColumn {
  header: string;
  width: number;
}

export interface XlsxCell {
  value: string | number;
  style?: XlsxStyleName;
}

export interface XlsxSheetSpec {
  name: string;
  columns: XlsxColumn[];
  rows: XlsxCell[][];
}

const STYLE_INDEX: Record<XlsxStyleName, number> = {
  default: 0,
  header: 1,
  statusPass: 2,
  statusFail: 3,
  statusWarn: 4,
  textPass: 5,
  textFail: 6,
  textWarn: 7,
};

const CRC_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: number[]): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function utf8Bytes(str: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    if (c < 0x80) {
      out.push(c);
    } else if (c < 0x800) {
      out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
      const lo = str.charCodeAt(i + 1);
      const cp = 0x10000 + ((c - 0xd800) << 10) + (lo - 0xdc00);
      i += 1;
      out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    } else {
      out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return out;
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function u16(v: number): number[] {
  return [v & 0xff, (v >>> 8) & 0xff];
}

function u32(v: number): number[] {
  return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
}

function pushAll(target: number[], source: number[]): void {
  for (let i = 0; i < source.length; i += 1) target.push(source[i]);
}

const DOS_TIME = 0;
const DOS_DATE = (44 << 9) | (1 << 5) | 1; // 2024-01-01 in DOS format

function zipStore(files: { name: string; data: number[] }[]): number[] {
  const out: number[] = [];
  const central: number[] = [];
  for (let fi = 0; fi < files.length; fi += 1) {
    const f = files[fi];
    const nameBytes = utf8Bytes(f.name);
    const crc = crc32(f.data);
    const offset = out.length;
    pushAll(out, u32(0x04034b50));
    pushAll(out, u16(20));
    pushAll(out, u16(0x0800));
    pushAll(out, u16(0));
    pushAll(out, u16(DOS_TIME));
    pushAll(out, u16(DOS_DATE));
    pushAll(out, u32(crc));
    pushAll(out, u32(f.data.length));
    pushAll(out, u32(f.data.length));
    pushAll(out, u16(nameBytes.length));
    pushAll(out, u16(0));
    pushAll(out, nameBytes);
    pushAll(out, f.data);
    pushAll(central, u32(0x02014b50));
    pushAll(central, u16(20));
    pushAll(central, u16(20));
    pushAll(central, u16(0x0800));
    pushAll(central, u16(0));
    pushAll(central, u16(DOS_TIME));
    pushAll(central, u16(DOS_DATE));
    pushAll(central, u32(crc));
    pushAll(central, u32(f.data.length));
    pushAll(central, u32(f.data.length));
    pushAll(central, u16(nameBytes.length));
    pushAll(central, u16(0));
    pushAll(central, u16(0));
    pushAll(central, u16(0));
    pushAll(central, u16(0));
    pushAll(central, u32(0));
    pushAll(central, u32(offset));
    pushAll(central, nameBytes);
  }
  const centralOffset = out.length;
  pushAll(out, central);
  pushAll(out, u32(0x06054b50));
  pushAll(out, u16(0));
  pushAll(out, u16(0));
  pushAll(out, u16(files.length));
  pushAll(out, u16(files.length));
  pushAll(out, u32(central.length));
  pushAll(out, u32(centralOffset));
  pushAll(out, u16(0));
  return out;
}

function xmlBytes(s: string): number[] {
  return utf8Bytes('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + s);
}

function colLetters(i: number): string {
  let n = i;
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

function stylesXml(): string {
  const fonts: string[] = [
    '<font><sz val="11"/><color rgb="FF111111"/><name val="Calibri"/><family val="2"/></font>',
    '<font><b/><sz val="11"/><color rgb="FFC9A227"/><name val="Calibri"/><family val="2"/></font>',
    '<font><b/><sz val="11"/><color rgb="FF2E6B46"/><name val="Calibri"/><family val="2"/></font>',
    '<font><b/><sz val="11"/><color rgb="FFA33A2E"/><name val="Calibri"/><family val="2"/></font>',
    '<font><b/><sz val="11"/><color rgb="FF8A701D"/><name val="Calibri"/><family val="2"/></font>',
  ];
  const fills: string[] = [
    '<fill><patternFill patternType="none"/></fill>',
    '<fill><patternFill patternType="gray125"/></fill>',
    '<fill><patternFill patternType="solid"><fgColor rgb="FF0A0A0B"/><bgColor indexed="64"/></patternFill></fill>',
    '<fill><patternFill patternType="solid"><fgColor rgb="FFE4F0E8"/><bgColor indexed="64"/></patternFill></fill>',
    '<fill><patternFill patternType="solid"><fgColor rgb="FFFAEBE9"/><bgColor indexed="64"/></patternFill></fill>',
    '<fill><patternFill patternType="solid"><fgColor rgb="FFF9F3DC"/><bgColor indexed="64"/></patternFill></fill>',
  ];
  const xfs: string[] = [
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>',
    '<xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1"/>',
    '<xf numFmtId="0" fontId="3" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1"/>',
    '<xf numFmtId="0" fontId="4" fillId="5" borderId="0" xfId="0" applyFont="1" applyFill="1"/>',
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>',
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>',
    '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>',
  ];
  return '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + '<fonts count="' + fonts.length + '">' + fonts.join("") + '</fonts>'
    + '<fills count="' + fills.length + '">' + fills.join("") + '</fills>'
    + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + '<cellXfs count="' + xfs.length + '">' + xfs.join("") + '</cellXfs>'
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
    + '<dxfs count="0"/>'
    + '</styleSheet>';
}

export function buildXlsx(spec: XlsxSheetSpec): Uint8Array {
  const colCount = spec.columns.length;
  const rowsXml: string[] = [];
  const headerCells: string[] = [];
  for (let c = 0; c < colCount; c += 1) {
    headerCells.push('<c r="' + colLetters(c) + '1" s="' + STYLE_INDEX.header + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEscape(spec.columns[c].header) + '</t></is></c>');
  }
  rowsXml.push('<row r="1">' + headerCells.join("") + '</row>');
  for (let ri = 0; ri < spec.rows.length; ri += 1) {
    const cells = spec.rows[ri];
    const parts: string[] = [];
    for (let c = 0; c < colCount; c += 1) {
      const cell: XlsxCell = cells[c] || { value: "" };
      const ref = colLetters(c) + String(ri + 2);
      const s = STYLE_INDEX[cell.style || "default"];
      if (typeof cell.value === "number" && Number.isFinite(cell.value)) {
        parts.push('<c r="' + ref + '" s="' + s + '"><v>' + String(cell.value) + '</v></c>');
      } else {
        parts.push('<c r="' + ref + '" s="' + s + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEscape(String(cell.value == null ? "" : cell.value)) + '</t></is></c>');
      }
    }
    rowsXml.push('<row r="' + String(ri + 2) + '">' + parts.join("") + '</row>');
  }
  const colsXml: string[] = [];
  for (let c = 0; c < colCount; c += 1) {
    colsXml.push('<col min="' + String(c + 1) + '" max="' + String(c + 1) + '" width="' + String(spec.columns[c].width) + '" customWidth="1"/>');
  }
  const sheetXml = '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
    + '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    + '<cols>' + colsXml.join("") + '</cols>'
    + '<sheetData>' + rowsXml.join("") + '</sheetData>'
    + '</worksheet>';
  const workbookXml = '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
    + '<sheets><sheet name="' + xmlEscape(spec.name.slice(0, 31)) + '" sheetId="1" r:id="rId1"/></sheets>'
    + '</workbook>';
  const workbookRels = '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
    + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    + '</Relationships>';
  const rootRels = '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
    + '</Relationships>';
  const contentTypes = '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    + '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
    + '</Types>';
  const files: { name: string; data: number[] }[] = [
    { name: "[Content_Types].xml", data: xmlBytes(contentTypes) },
    { name: "_rels/.rels", data: xmlBytes(rootRels) },
    { name: "xl/workbook.xml", data: xmlBytes(workbookXml) },
    { name: "xl/_rels/workbook.xml.rels", data: xmlBytes(workbookRels) },
    { name: "xl/styles.xml", data: xmlBytes(stylesXml()) },
    { name: "xl/worksheets/sheet1.xml", data: xmlBytes(sheetXml) },
  ];
  return new Uint8Array(zipStore(files));
}