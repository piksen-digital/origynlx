/**
 * Shared CSV download helper.
 *
 * Excel is the main consumer of the CSVs this app exports, and it has two
 * quirks that make plain LF-only, BOM-less UTF-8 CSVs open blank or garbled
 * on some machines. Notepad reads the same file fine, which makes it look
 * like a broken download to the user:
 *
 * 1. Excel only auto-detects UTF-8 when the file starts with a UTF-8 BOM.
 *    Without it, Excel guesses the legacy system code page instead.
 * 2. Excel expects CRLF row endings; some versions and locales mishandle
 *    LF-only files.
 *
 * Every CSV downloaded here is therefore written with a leading BOM and
 * CRLF row endings. The BOM is invisible in Excel, and it is stripped on
 * re-upload (Papa Parse and String.trim both drop it), so templates
 * round-trip through the parsers cleanly.
 */

export function downloadTextCsv(filename: string, csv: string): void {
  if (typeof document === "undefined") return;
  const crlf: string = csv.replace(/\r\n|\r|\n/g, "\r\n");
  const blob = new Blob(["\uFEFF" + crlf], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoking the blob URL immediately after click can abort the download
  // in some browsers; give the download a moment to start first.
  window.setTimeout((): void => {
    URL.revokeObjectURL(url);
  }, 2000);
}