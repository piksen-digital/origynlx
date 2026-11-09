"use client";

import { useEffect, useRef, useState } from "react";
import {
  parseBatchCsv,
  runBatch,
  downloadBatchTemplate,
  resultsCsv,
  type BatchRowResult,
} from "@/lib/batch-qualify";
import { getStoredLicenseKey, storeLicenseKey, tryRestoreLicense } from "@/lib/trial";
import { downloadTextCsv } from "@/lib/csv-download";
import { tt, ttBatch } from "@/lib/result-i18n";

const BATCH_COPY_EN = {
  checkingLicense: "Checking license...",
  licensed: "License active - results export unlocked.",
  freeBar: "Matrix view is free. Results export (Excel or CSV) is a licensed feature.",
  keyPlaceholder: "Have a license key?",
  unlock: "Unlock",
  licenseInactive: "That license key is not active.",
  uploadTitle: "Upload your catalog",
  uploadBlurb: "One row per component, grouped by SKU. Download the template for the exact format.",
  downloadTemplate: "Download CSV template",
  processing: "Processing...",
  uploadCta: "Upload CSV",
  readFileError: "Could not read that file. Try re-saving it as CSV and upload again.",
  exportLicensed: "Results export is a licensed feature. Enter your license key above, or get one from the pricing page.",
  keyMissing: "License key missing from this browser. Re-enter your key above and try again.",
  exportFail: "Export failed. Try again.",
  exportFailConn: "Export failed. Check your connection and try again.",
  qualifiesCount: "Qualifies: ",
  failsCount: "Fails: ",
  reviewCount: "Needs review: ",
  skusCount: "SKUs: ",
  exporting: "Exporting...",
  downloadXlsx: "Download results (Excel)",
  downloadCsv: "Download CSV",
  thProduct: "Product",
  thMethod: "Method",
  thThreshold: "Threshold",
  thMargin: "Margin",
  thStatus: "Status",
  netCost: "Net cost",
  transValue: "Trans. value",
  statusQualifies: "Qualifies",
  statusFails: "Fails",
  statusReview: "Needs review",
  thresholdSource: { csv: "csv", rule: "rule", default: "default" },
};

const BATCH_COPY_ES: typeof BATCH_COPY_EN = {
  checkingLicense: "Verificando licencia...",
  licensed: "Licencia activa - exportación de resultados desbloqueada.",
  freeBar: "La vista matricial es gratis. La exportación de resultados (Excel o CSV) es una función con licencia.",
  keyPlaceholder: "¿Tienes una clave de licencia?",
  unlock: "Desbloquear",
  licenseInactive: "Esa clave de licencia no está activa.",
  uploadTitle: "Sube tu catálogo",
  uploadBlurb: "Una fila por componente, agrupadas por SKU. Descarga la plantilla para el formato exacto.",
  downloadTemplate: "Descargar plantilla CSV",
  processing: "Procesando...",
  uploadCta: "Subir CSV",
  readFileError: "No se pudo leer el archivo. Guárdalo de nuevo como CSV y vuelve a subirlo.",
  exportLicensed: "La exportación de resultados es una función con licencia. Ingresa tu clave de licencia arriba, o consigue una en la página de precios.",
  keyMissing: "Falta la clave de licencia en este navegador. Reingresa tu clave arriba e inténtalo de nuevo.",
  exportFail: "La exportación falló. Inténtalo de nuevo.",
  exportFailConn: "La exportación falló. Revisa tu conexión e inténtalo de nuevo.",
  qualifiesCount: "Califica: ",
  failsCount: "No califica: ",
  reviewCount: "Requiere revisión: ",
  skusCount: "SKUs: ",
  exporting: "Exportando...",
  downloadXlsx: "Descargar resultados (Excel)",
  downloadCsv: "Descargar CSV",
  thProduct: "Producto",
  thMethod: "Método",
  thThreshold: "Umbral",
  thMargin: "Margen",
  thStatus: "Estado",
  netCost: "Costo neto",
  transValue: "Valor de trans.",
  statusQualifies: "Califica",
  statusFails: "No califica",
  statusReview: "Requiere revisión",
  thresholdSource: { csv: "csv", rule: "regla", default: "predeterminado" },
};

const COPY: Record<"en" | "es", typeof BATCH_COPY_EN> = { en: BATCH_COPY_EN, es: BATCH_COPY_ES };

export default function BatchQualifier({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  const [licensed, setLicensed] = useState(false);
  const [checkingLicense, setCheckingLicense] = useState(true);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [rows, setRows] = useState<BatchRowResult[] | null>(null);
  const [parseMessages, setParseMessages] = useState<string[]>([]);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = getStoredLicenseKey();
    if (!key) {
      tryRestoreLicense().then((restored: boolean) => {
        if (restored && !window.sessionStorage.getItem("olx_restored_reload")) {
          // The resume cookie held a valid license (localStorage was cleared):
          // reload once so the normal redeem path runs with the restored key.
          // The sessionStorage flag prevents any reload loop.
          window.sessionStorage.setItem("olx_restored_reload", "1");
          window.location.reload();
          return;
        }
        setCheckingLicense(false);
      });
      return;
    }
    fetch("/api/license/redeem", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: key }),
    })
      .then((r) => r.json())
      .then((d) => setLicensed(!!d.valid))
      .finally(() => setCheckingLicense(false));
  }, []);

  async function handleRedeem() {
    setLicenseError(null);
    const res = await fetch("/api/license/redeem", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: licenseInput }),
    });
    const data = await res.json();
    if (!data.valid) {
      setLicenseError(data.error ? tt(data.error, locale) : t.licenseInactive);
      return;
    }
    storeLicenseKey(licenseInput.trim().toUpperCase());
    setLicensed(true);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setDownloadMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      const { products, errors } = parseBatchCsv(String(reader.result || ""));
      setParseMessages(errors);
      if (products.length > 0) {
        setRows(runBatch(products));
      } else {
        setRows(null);
      }
      setBusy(false);
    };
    reader.onerror = () => {
      setParseMessages([t.readFileError]);
      setBusy(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDownloadResults() {
    if (!rows) return;
    if (!licensed) {
      setDownloadMessage(t.exportLicensed);
      return;
    }
    setDownloadMessage(null);
    downloadTextCsv("origynlx-batch-results.csv", resultsCsv(rows));
  }

  async function handleDownloadXlsx() {
    if (!rows) return;
    if (!licensed) {
      setDownloadMessage(t.exportLicensed);
      return;
    }
    const key = getStoredLicenseKey();
    if (!key) {
      setDownloadMessage(t.keyMissing);
      return;
    }
    setDownloadMessage(null);
    setExporting(true);
    try {
      const res = await fetch("/api/batch/export-xlsx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ licenseKey: key, rows }),
      });
      if (!res.ok) {
        let data: { error?: string } = {};
        try {
          data = await res.json();
        } catch {
          // response was not JSON; keep the generic message
        }
        setDownloadMessage(data.error || t.exportFail);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "origynlx-batch-results.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout((): void => {
        URL.revokeObjectURL(url);
      }, 2000);
    } catch {
      setDownloadMessage(t.exportFailConn);
    } finally {
      setExporting(false);
    }
  }

  const counts = { qualifies: 0, fails: 0, review: 0 };
  if (rows) {
    for (const r of rows) {
      if (r.status === "qualifies") counts.qualifies += 1;
      else if (r.status === "fails") counts.fails += 1;
      else counts.review += 1;
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-paper/70">
          {checkingLicense
            ? t.checkingLicense
            : licensed
            ? t.licensed
            : t.freeBar}
        </p>
        {!licensed && (
          <div className="flex items-center gap-3">
            <input
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value)}
              placeholder={t.keyPlaceholder}
              className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
            <button onClick={handleRedeem} className="rounded-lg border border-white/20 px-3 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors">
              {t.unlock}
            </button>
          </div>
        )}
      </div>
      {licenseError && <p className="text-[13px] text-fail">{licenseError}</p>}

      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-paper/60">{t.uploadTitle}</p>
            <p className="mt-1 text-[12px] text-paper/40">{t.uploadBlurb}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={downloadBatchTemplate} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">
              {t.downloadTemplate}
            </button>
            <button onClick={() => fileRef.current?.click()} disabled={busy} className="rounded-full bg-seal px-5 py-2 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors disabled:opacity-50">
              {busy ? t.processing : t.uploadCta}
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
          </div>
        </div>
        {parseMessages.length > 0 && (
          <div className="mt-4 space-y-1">
            {parseMessages.map((m, i) => (
              <p key={i} className="text-[12px] text-paper/50">{tt(m, locale)}</p>
            ))}
          </div>
        )}
      </div>

      {rows && (
        <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-[13px]">
              <span className="rounded-full bg-pass/20 px-3 py-1 font-semibold text-pass ring-1 ring-inset ring-pass/40">{t.qualifiesCount + counts.qualifies}</span>
              <span className="rounded-full bg-fail/20 px-3 py-1 font-semibold text-fail ring-1 ring-inset ring-fail/40">{t.failsCount + counts.fails}</span>
              <span className="rounded-full bg-seal/20 px-3 py-1 font-semibold text-seal ring-1 ring-inset ring-seal/40">{t.reviewCount + counts.review}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-paper/50">{t.skusCount + rows.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleDownloadXlsx} disabled={exporting} className="rounded-full bg-seal px-5 py-2 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors disabled:opacity-50">
                {exporting ? t.exporting : t.downloadXlsx}
              </button>
              <button onClick={handleDownloadResults} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">
                {t.downloadCsv}
              </button>
            </div>
          </div>
          {downloadMessage && <p className="mt-3 text-[13px] text-seal">{downloadMessage}</p>}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-paper/45">
                  <th className="py-2 pr-4 font-medium">SKU</th>
                  <th className="py-2 pr-4 font-medium">{t.thProduct}</th>
                  <th className="py-2 pr-4 font-medium">HS</th>
                  <th className="py-2 pr-4 font-medium">{t.thMethod}</th>
                  <th className="py-2 pr-4 font-medium">{t.thThreshold}</th>
                  <th className="py-2 pr-4 font-medium">RVC</th>
                  <th className="py-2 pr-4 font-medium">{t.thMargin}</th>
                  <th className="py-2 pr-4 font-medium">{t.thStatus}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sku} className="border-b border-white/5 align-top">
                    <td className="py-2.5 pr-4 text-paper">{r.sku}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.productName}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.hsSubheading || "-"}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.method === "net-cost" ? t.netCost : t.transValue}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.thresholdPercent + "% (" + t.thresholdSource[r.thresholdSource] + ")"}</td>
                    <td className={"py-2.5 pr-4 font-semibold " + (r.status === "qualifies" ? "text-pass" : r.status === "fails" ? "text-fail" : "text-seal")}>{r.rvcPercent + "%"}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{(r.marginPercent > 0 ? "+" : "") + r.marginPercent}</td>
                    <td className="py-2.5 pr-4">
                      <span className={r.status === "qualifies" ? "inline-flex items-center rounded-full bg-pass/25 px-3 py-1 font-semibold text-pass ring-1 ring-inset ring-pass/40" : r.status === "fails" ? "inline-flex items-center rounded-full bg-fail/25 px-3 py-1 font-semibold text-fail ring-1 ring-inset ring-fail/40" : "inline-flex items-center rounded-full bg-seal/25 px-3 py-1 font-semibold text-seal ring-1 ring-inset ring-seal/40"}>
                        {r.status === "qualifies" ? t.statusQualifies : r.status === "fails" ? t.statusFails : t.statusReview}
                      </span>
                      {r.reviewReason && <p className="mt-1 max-w-md text-[12px] leading-relaxed text-paper/40">{ttBatch(r.reviewReason, locale)}</p>}
                    {r.remedyFlags.length > 0 && (
                      <p className="mt-1 max-w-md text-[12px] font-medium text-fail/80">{r.remedyFlags.map((f) => tt(f, locale)).join(" | ")}</p>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
