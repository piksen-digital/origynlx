"use client";

import { useEffect, useRef, useState } from "react";
import {
  parseBatchCsv,
  runBatch,
  downloadBatchTemplate,
  resultsCsv,
  type BatchRowResult,
} from "@/lib/batch-qualify";
import { getStoredLicenseKey, storeLicenseKey } from "@/lib/trial";

export default function BatchQualifier() {
  const [licensed, setLicensed] = useState(false);
  const [checkingLicense, setCheckingLicense] = useState(true);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [rows, setRows] = useState<BatchRowResult[] | null>(null);
  const [parseMessages, setParseMessages] = useState<string[]>([]);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = getStoredLicenseKey();
    if (!key) {
      setCheckingLicense(false);
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
      setLicenseError(data.error || "That license key is not active.");
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
      setParseMessages(["Could not read that file. Try re-saving it as CSV and upload again."]);
      setBusy(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDownloadResults() {
    if (!rows) return;
    if (!licensed) {
      setDownloadMessage("CSV export is a licensed feature. Enter your license key above, or get one from the pricing page.");
      return;
    }
    setDownloadMessage(null);
    const csv = resultsCsv(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "origynlx-batch-results.csv";
    a.click();
    URL.revokeObjectURL(url);
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
            ? "Checking license..."
            : licensed
            ? "License active - results CSV export unlocked."
            : "Matrix view is free. Results CSV export is a licensed feature."}
        </p>
        {!licensed && (
          <div className="flex items-center gap-3">
            <input
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value)}
              placeholder="Have a license key?"
              className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
            <button onClick={handleRedeem} className="rounded-lg border border-white/20 px-3 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors">
              Unlock
            </button>
          </div>
        )}
      </div>
      {licenseError && <p className="text-[13px] text-fail">{licenseError}</p>}

      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-paper/60">Upload your catalog</p>
            <p className="mt-1 text-[12px] text-paper/40">One row per component, grouped by SKU. Download the template for the exact format.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={downloadBatchTemplate} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">
              Download CSV template
            </button>
            <button onClick={() => fileRef.current?.click()} disabled={busy} className="rounded-full bg-seal px-5 py-2 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors disabled:opacity-50">
              {busy ? "Processing..." : "Upload CSV"}
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
          </div>
        </div>
        {parseMessages.length > 0 && (
          <div className="mt-4 space-y-1">
            {parseMessages.map((m, i) => (
              <p key={i} className="text-[12px] text-paper/50">{m}</p>
            ))}
          </div>
        )}
      </div>

      {rows && (
        <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-[13px]">
              <span className="rounded-full bg-pass/15 px-3 py-1 font-medium text-pass">{"Qualifies: " + counts.qualifies}</span>
              <span className="rounded-full bg-fail/15 px-3 py-1 font-medium text-fail">{"Fails: " + counts.fails}</span>
              <span className="rounded-full bg-seal/15 px-3 py-1 font-medium text-seal">{"Needs review: " + counts.review}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-paper/50">{"SKUs: " + rows.length}</span>
            </div>
            <button onClick={handleDownloadResults} className="rounded-full border border-white/20 px-5 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors">
              Download results CSV
            </button>
          </div>
          {downloadMessage && <p className="mt-3 text-[13px] text-seal">{downloadMessage}</p>}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-paper/45">
                  <th className="py-2 pr-4 font-medium">SKU</th>
                  <th className="py-2 pr-4 font-medium">Product</th>
                  <th className="py-2 pr-4 font-medium">HS</th>
                  <th className="py-2 pr-4 font-medium">Method</th>
                  <th className="py-2 pr-4 font-medium">Threshold</th>
                  <th className="py-2 pr-4 font-medium">RVC</th>
                  <th className="py-2 pr-4 font-medium">Margin</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sku} className="border-b border-white/5 align-top">
                    <td className="py-2.5 pr-4 text-paper">{r.sku}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.productName}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.hsSubheading || "-"}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.method === "net-cost" ? "Net cost" : "Trans. value"}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{r.thresholdPercent + "% (" + r.thresholdSource + ")"}</td>
                    <td className="py-2.5 pr-4 font-semibold text-paper">{r.rvcPercent + "%"}</td>
                    <td className="py-2.5 pr-4 text-paper/70">{(r.marginPercent > 0 ? "+" : "") + r.marginPercent}</td>
                    <td className="py-2.5 pr-4">
                      <span className={r.status === "qualifies" ? "font-medium text-pass" : r.status === "fails" ? "font-medium text-fail" : "font-medium text-seal"}>
                        {r.status === "qualifies" ? "Qualifies" : r.status === "fails" ? "Fails" : "Needs review"}
                      </span>
                      {r.reviewReason && <p className="mt-1 max-w-md text-[12px] leading-relaxed text-paper/40">{r.reviewReason}</p>}
                    {r.remedyFlags.length > 0 && (
                      <p className="mt-1 max-w-md text-[12px] font-medium text-fail/80">{r.remedyFlags.join(" | ")}</p>
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
