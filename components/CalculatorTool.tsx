"use client";

import { useEffect, useState } from "react";
import {
  calculateRVC,
  emptyLineItem,
  DEFAULT_THRESHOLDS,
  type BOMLineItem,
  type RVCResult,
} from "@/lib/rvc-calculator";
import {
  checksRemaining,
  hasFreeChecksLeft,
  recordCheckUsed,
  getStoredLicenseKey,
  storeLicenseKey,
} from "@/lib/trial";
import { generateCertificatePDF, type CertifierInfo } from "@/lib/certificate-pdf";

let idCounter = 0;
const newId = () => `li_${++idCounter}_${Date.now()}`;

export default function CalculatorTool() {
  const [productName, setProductName] = useState("");
  const [transactionValue, setTransactionValue] = useState<number>(0);
  const [method, setMethod] = useState<"transaction-value" | "net-cost">("transaction-value");
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLDS["transaction-value"]);
  const [lineItems, setLineItems] = useState<BOMLineItem[]>([emptyLineItem(newId()), emptyLineItem(newId())]);
  const [result, setResult] = useState<RVCResult | null>(null);

  const [licensed, setLicensed] = useState(false);
  const [checkingLicense, setCheckingLicense] = useState(true);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(5);

  const [showCert, setShowCert] = useState(false);
  const [certInfo, setCertInfo] = useState<CertifierInfo>({
    certifierType: "Producer",
    certifierName: "",
    certifierAddress: "",
    certifierEmail: "",
    certifierPhone: "",
    producerName: "",
    producerAddress: "",
    importerName: "",
    importerAddress: "",
    blanketPeriodStart: "",
    blanketPeriodEnd: "",
  });

  useEffect(() => {
    setRemaining(checksRemaining());
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

  function updateItem(id: string, patch: Partial<BOMLineItem>) {
    setLineItems((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setLineItems((items) => [...items, emptyLineItem(newId())]);
  }

  function removeItem(id: string) {
    setLineItems((items) => items.filter((it) => it.id !== id));
  }

  function handleMethodChange(next: "transaction-value" | "net-cost") {
    setMethod(next);
    setThreshold(DEFAULT_THRESHOLDS[next]);
  }

  function handleCalculate() {
    if (!licensed && !hasFreeChecksLeft()) return;
    const r = calculateRVC({
      productName,
      transactionValue,
      method,
      thresholdPercent: threshold,
      lineItems,
    });
    setResult(r);
    if (!licensed) {
      recordCheckUsed();
      setRemaining(checksRemaining());
    }
  }

  async function handleRedeem() {
    setLicenseError(null);
    const res = await fetch("/api/license/redeem", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: licenseInput }),
    });
    const data = await res.json();
    if (!data.valid) {
      setLicenseError(data.error || "That license key isn't active.");
      return;
    }
    storeLicenseKey(licenseInput.trim().toUpperCase());
    setLicensed(true);
  }

  async function handleDownloadCertificate() {
    if (!result) return;
    const bytes = await generateCertificatePDF(productName || "Untitled product", lineItems, result, certInfo);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(productName || "origynlx-draft-certificate").replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const blocked = !licensed && remaining <= 0;

  return (
    <div className="space-y-8">
      {/* Trial / license status bar */}
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {checkingLicense ? (
          <p className="text-sm text-paper/50">Checking license…</p>
        ) : licensed ? (
          <p className="text-sm text-pass">License active — unlimited checks and certificates.</p>
        ) : (
          <p className="text-sm text-paper/70">
            {remaining} of 5 free checks remaining this browser.
          </p>
        )}
        {!licensed && (
          <div className="flex items-center gap-2">
            <input
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value)}
              placeholder="Have a license key?"
              className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
            <button
              onClick={handleRedeem}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
            >
              Unlock
            </button>
          </div>
        )}
      </div>
      {licenseError && <p className="text-[13px] text-fail">{licenseError}</p>}

      {/* Product + transaction inputs */}
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-6 sm:p-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium text-paper/60">Product name</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Aluminum bracket assembly"
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">Transaction value (USD)</label>
            <input
              type="number"
              min={0}
              value={transactionValue || ""}
              onChange={(e) => setTransactionValue(Number(e.target.value))}
              placeholder="0.00"
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">Method</label>
            <select
              value={method}
              onChange={(e) => handleMethodChange(e.target.value as "transaction-value" | "net-cost")}
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60"
            >
              <option value="transaction-value">Transaction value</option>
              <option value="net-cost">Net cost</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">Threshold (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60"
            />
          </div>
        </div>

        {/* BOM table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[13px] font-medium text-paper/60">Bill of materials</label>
            <button onClick={addItem} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">
              + Add line item
            </button>
          </div>
          <div className="space-y-2">
            {lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  placeholder="Component"
                  className="col-span-4 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
                />
                <input
                  value={item.hsCode}
                  onChange={(e) => updateItem(item.id, { hsCode: e.target.value })}
                  placeholder="HS code"
                  className="col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-mono text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
                />
                <input
                  value={item.countryOfOrigin}
                  onChange={(e) => updateItem(item.id, { countryOfOrigin: e.target.value.toUpperCase() })}
                  placeholder="US"
                  maxLength={2}
                  className="col-span-1 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
                />
                <input
                  type="number"
                  value={item.value || ""}
                  onChange={(e) => updateItem(item.id, { value: Number(e.target.value) })}
                  placeholder="Value"
                  className="col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
                />
                <label className="col-span-2 flex items-center gap-2 text-[13px] text-paper/60">
                  <input
                    type="checkbox"
                    checked={item.originating}
                    onChange={(e) => updateItem(item.id, { originating: e.target.checked })}
                    className="accent-seal"
                  />
                  Originating
                </label>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove line item"
                  className="col-span-1 text-paper/40 hover:text-fail transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={blocked}
          className="w-full rounded-full bg-seal text-ink text-sm font-semibold h-12 hover:bg-seal/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculate
        </button>

        {blocked && (
          <p className="text-center text-[13px] text-paper/60">
            You've used your 5 free checks.{" "}
            <a href="/pricing" className="text-seal underline">
              Buy a license
            </a>{" "}
            for unlimited checks and certificates.
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-card border border-white/12 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-paper/50">Result</span>
              <p className="mt-2 font-display text-4xl font-semibold text-paper">{result.rvcPercent}%</p>
              <p className="text-[13px] text-paper/50">vs {result.thresholdPercent}% threshold</p>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                result.qualifies ? "bg-pass/15 text-pass" : "bg-fail/15 text-fail"
              }`}
            >
              {result.qualifies ? "Qualifies" : "Does not qualify"}
            </span>
          </div>

          {result.warnings.length > 0 && (
            <div className="mt-6 space-y-2">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-paper/60 border-l-2 border-seal/40 pl-3">
                  {w}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6">
            {!showCert ? (
              <button
                onClick={() => setShowCert(true)}
                disabled={!licensed}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {licensed ? "Prepare draft certificate" : "Unlock a license to generate certificates"}
              </button>
            ) : (
              <CertificateForm certInfo={certInfo} setCertInfo={setCertInfo} onDownload={handleDownloadCertificate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CertificateForm({
  certInfo,
  setCertInfo,
  onDownload,
}: {
  certInfo: CertifierInfo;
  setCertInfo: (c: CertifierInfo) => void;
  onDownload: () => void;
}) {
  function set<K extends keyof CertifierInfo>(key: K, value: CertifierInfo[K]) {
    setCertInfo({ ...certInfo, [key]: value });
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <p className="text-[13px] text-paper/50">
        These fields fill the nine required certificate elements. You'll still sign it yourself.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={certInfo.certifierType}
          onChange={(e) => set("certifierType", e.target.value as CertifierInfo["certifierType"])}
          className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60"
        >
          <option>Producer</option>
          <option>Exporter</option>
          <option>Importer</option>
        </select>
        <input placeholder="Certifier name" value={certInfo.certifierName} onChange={(e) => set("certifierName", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Certifier address" value={certInfo.certifierAddress} onChange={(e) => set("certifierAddress", e.target.value)} className="sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Certifier email" value={certInfo.certifierEmail} onChange={(e) => set("certifierEmail", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Certifier phone" value={certInfo.certifierPhone} onChange={(e) => set("certifierPhone", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Producer name (if different)" value={certInfo.producerName} onChange={(e) => set("producerName", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Producer address" value={certInfo.producerAddress} onChange={(e) => set("producerAddress", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Importer name" value={certInfo.importerName} onChange={(e) => set("importerName", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Importer address" value={certInfo.importerAddress} onChange={(e) => set("importerAddress", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Blanket period start (YYYY-MM-DD)" value={certInfo.blanketPeriodStart} onChange={(e) => set("blanketPeriodStart", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
        <input placeholder="Blanket period end (YYYY-MM-DD)" value={certInfo.blanketPeriodEnd} onChange={(e) => set("blanketPeriodEnd", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
      </div>
      <button
        onClick={onDownload}
        className="rounded-full bg-seal text-ink text-sm font-semibold px-6 h-11 hover:bg-seal/90 transition-colors"
      >
        Download draft certificate (PDF)
      </button>
    </div>
  );
}
