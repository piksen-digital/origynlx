"use client";

import { useEffect, useRef, useState } from "react";
import {
  calculateRVC,
  checkDeMinimis,
  emptyLineItem,
  DEFAULT_THRESHOLDS,
  type BOMLineItem,
  type RVCResult,
  type DeMinimisResult,
} from "@/lib/rvc-calculator";
import {
  checksRemaining,
  hasFreeChecksLeft,
  recordCheckUsed,
  getStoredLicenseKey,
  storeLicenseKey,
} from "@/lib/trial";
import { generateCertificatePDF, type CertifierInfo } from "@/lib/certificate-pdf";
import { generateAuditWorksheetPDF } from "@/lib/audit-worksheet-pdf";
import { parseBOMCsv, downloadBomTemplate } from "@/lib/csv-import";
import { listSavedBOMs, saveBOM, deleteSavedBOM, type SavedBOM } from "@/lib/saved-boms";
import { THRESHOLD_REFERENCES } from "@/lib/usmca-thresholds";

let idCounter = 0;
const newId = () => `li_${++idCounter}_${Date.now()}`;

export default function CalculatorTool() {
  const [productName, setProductName] = useState("");
  const [transactionValue, setTransactionValue] = useState<number>(0);
  type RuleBasis = "tariff-shift" | "rvc" | "tariff-shift-or-rvc" | "special" | "custom";
  type RVCMethod = "transaction-value" | "net-cost";
  type OriginStatus = "originating" | "non-originating" | "undetermined";

  const [method, setMethod] = useState<RVCMethod>("transaction-value");
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLDS["transaction-value"]);
  const [ruleBasis, setRuleBasis] = useState<RuleBasis>("rvc");
  const [rvcMethod, setRvcMethod] = useState<RVCMethod>("transaction-value");
  const [categoryId, setCategoryId] = useState<string>("general");
  const [hsHeading, setHsHeading] = useState("");
  const [hsSubheading, setHsSubheading] = useState("");
  const [tariffItem, setTariffItem] = useState("");
  const [annexTariffItem, setAnnexTariffItem] = useState("");
  const [showAdvancedClassification, setShowAdvancedClassification] = useState(false);
  const [importingParty, setImportingParty] = useState("United States");
  const [productionCountry, setProductionCountry] = useState("");
  const [lineItems, setLineItems] = useState<BOMLineItem[]>([emptyLineItem(newId()), emptyLineItem(newId())]);
  const [result, setResult] = useState<RVCResult | null>(null);
  const [deMinimis, setDeMinimis] = useState<DeMinimisResult | null>(null);

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

  // CSV import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);

  // Saved BOMs
  const [savedBOMs, setSavedBOMs] = useState<SavedBOM[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    setRemaining(checksRemaining());
    setSavedBOMs(listSavedBOMs());
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

  function handleRuleBasisChange(next: RuleBasis) {
    setRuleBasis(next);
    setCategoryId("");
  }

  function handleRvcMethodChange(next: RVCMethod) {
    setRvcMethod(next);
    setMethod(next);
    setThreshold(DEFAULT_THRESHOLDS[next]);
    setCategoryId("");
  }

  function handleCategoryChange(id: string) {
    setCategoryId(id);
    const ref = THRESHOLD_REFERENCES.find((r) => r.id === id);
    if (ref) {
      setRuleBasis("rvc");
      setRvcMethod(ref.method);
      setMethod(ref.method);
      setThreshold(ref.thresholdPercent);
    }
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
    setDeMinimis(checkDeMinimis({ transactionValue, lineItems }));
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
    downloadPdf(bytes, `${slug(productName || "origynlx-draft-certificate")}.pdf`);
  }

  async function handleDownloadWorksheet() {
    if (!result) return;
    const bytes = await generateAuditWorksheetPDF(productName || "Untitled product", lineItems, result, deMinimis);
    downloadPdf(bytes, `${slug(productName || "origynlx-worksheet")}-worksheet.pdf`);
  }

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { items, errors } = parseBOMCsv(String(reader.result || ""));
      setCsvErrors(errors);
      if (items.length > 0) {
        setLineItems(items);
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function handleSaveBOM() {
    const record = saveBOM(saveName || productName, {
      productName,
      transactionValue,
      method,
      threshold,
      lineItems,
    });
    setSavedBOMs(listSavedBOMs());
    setSaveName("");
    void record;
  }

  function handleLoadBOM(b: SavedBOM) {
    setProductName(b.productName);
    setTransactionValue(b.transactionValue);
    setMethod(b.method);
    setThreshold(b.threshold);
    setLineItems(b.lineItems);
    setResult(null);
    setDeMinimis(null);
    setShowSaved(false);
  }

  function handleDeleteBOM(id: string) {
    deleteSavedBOM(id);
    setSavedBOMs(listSavedBOMs());
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
          <p className="text-sm text-paper/70">{remaining} of 5 free checks remaining this browser.</p>
        )}
        {!licensed && (
          <div className="flex items-center gap-3">
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
            <a href="/pricing" className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors whitespace-nowrap">
              Get a license →
            </a>
          </div>
        )}
      </div>
      {licenseError && <p className="text-[13px] text-fail">{licenseError}</p>}

      {/* Saved products */}
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Name this product to save it"
              className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
            <button
              onClick={handleSaveBOM}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
            >
              Save
            </button>
          </div>
          {savedBOMs.length > 0 && (
            <button
              onClick={() => setShowSaved((v) => !v)}
              className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors"
            >
              {showSaved ? "Hide" : `Saved products (${savedBOMs.length})`}
            </button>
          )}
        </div>
        <p className="mt-2 text-[12px] text-paper/40">Saved to this browser only — nothing is sent anywhere.</p>

        {showSaved && (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            {savedBOMs.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                <div>
                  <p className="text-sm text-paper">{b.name}</p>
                  <p className="text-[12px] text-paper/40">{new Date(b.savedAt).toLocaleDateString()} • {b.lineItems.length} line items</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleLoadBOM(b)} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">Load</button>
                  <button onClick={() => handleDeleteBOM(b.id)} className="text-[13px] text-paper/40 hover:text-fail transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product + transaction inputs */}
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-6 sm:p-8 space-y-6">
        {/* Finished product classification */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-[13px] font-medium text-paper/60">Finished product classification</label>
            <span className="text-[11px] uppercase tracking-wide text-paper/35">USMCA rule routing</span>
          </div>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[12px] text-paper/45">HS heading</label>
              <input value={hsHeading} onChange={(e) => setHsHeading(e.target.value)} placeholder="e.g. 85" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 font-mono text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
            </div>
            <div>
              <label className="text-[12px] text-paper/45">HS subheading *</label>
              <input value={hsSubheading} onChange={(e) => setHsSubheading(e.target.value)} placeholder="e.g. 8536.50" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 font-mono text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
            </div>
          </div>
          <button type="button" onClick={() => setShowAdvancedClassification((v) => !v)} className="mt-3 text-[12px] font-medium text-seal hover:text-seal/80 transition-colors">
            {showAdvancedClassification ? "Hide advanced classification" : "Show advanced tariff-item details"}
          </button>
          {showAdvancedClassification && (
            <div className="mt-3 grid gap-5 sm:grid-cols-2 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div>
                <label className="text-[12px] text-paper/45">U.S. HTS tariff item</label>
                <input value={tariffItem} onChange={(e) => setTariffItem(e.target.value)} placeholder="e.g. 8536.50.40" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2.5 font-mono text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
              </div>
              <div>
                <label className="text-[12px] text-paper/45">USMCA Annex 4-B tariff item</label>
                <input value={annexTariffItem} onChange={(e) => setAnnexTariffItem(e.target.value)} placeholder="e.g. 8536.50.aa" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2.5 font-mono text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
              </div>
            </div>
          )}
          {tariffItem.trim() && (
            <div className="mt-3 rounded-lg border border-seal/25 bg-seal/[0.06] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-seal/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-seal">Tariff-item-specific rule detected</span>
                <span className="text-[12px] text-paper/45">Manual rule entry remains available.</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-paper/55">This classification may have a USMCA rule that overrides or qualifies the broader subheading rule. Enter the exact tariff item when known. This notice does not lock or overwrite any manual fields.</p>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium text-paper/60">Product name</label>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Aluminum bracket assembly" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">Transaction value (USD)</label>
            <input type="number" min={0} value={transactionValue || ""} onChange={(e) => setTransactionValue(Number(e.target.value))} placeholder="0.00" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">Production country</label>
            <input value={productionCountry} onChange={(e) => setProductionCountry(e.target.value)} placeholder="e.g. Mexico" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">Importing Party</label>
            <select value={importingParty} onChange={(e) => setImportingParty(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60">
              <option>United States</option><option>Canada</option><option>Mexico</option>
            </select>
          </div>
        </div>

        {/* Rule basis */}
        <div>
          <label className="text-[13px] font-medium text-paper/60">Rule basis</label>
          <select value={ruleBasis} onChange={(e) => handleRuleBasisChange(e.target.value as RuleBasis)} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60">
            <option value="custom">Custom rule</option>
            <option value="tariff-shift">Tariff shift</option>
            <option value="rvc">Regional value content (RVC)</option>
            <option value="tariff-shift-or-rvc">Tariff shift or RVC</option>
            <option value="special">Special / product-specific rule</option>
          </select>
        </div>

        {(ruleBasis === "rvc" || ruleBasis === "tariff-shift-or-rvc") && (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <label className="text-[13px] font-medium text-paper/60">RVC method</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-paper/70"><input type="radio" name="rvc-method" checked={rvcMethod === "transaction-value"} onChange={() => handleRvcMethodChange("transaction-value")} className="accent-seal" />Transaction value</label>
              <label className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-paper/70"><input type="radio" name="rvc-method" checked={rvcMethod === "net-cost"} onChange={() => handleRvcMethodChange("net-cost")} className="accent-seal" />Net cost</label>
            </div>
            <div className="mt-4">
              <label className="text-[12px] text-paper/45">Threshold (%)</label>
              <input type="number" min={0} max={100} value={threshold} onChange={(e) => { setThreshold(Number(e.target.value)); setCategoryId(""); }} className="mt-2 w-full rounded-lg border border-white/[0.15] bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
            </div>
          </div>
        )}

        {ruleBasis === "tariff-shift" && <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-[13px] leading-relaxed text-paper/55">Tariff-shift rules do not use an RVC percentage. Enter the applicable product-specific tariff-shift rule manually or select a verified rule when available.</div>}

        <div>
          <label className="text-[13px] font-medium text-paper/60">Verified rule category (optional)</label>
          <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60">
            {categoryId === "" && <option value="">Custom / manually set</option>}
            {THRESHOLD_REFERENCES.map((r) => <option key={r.id} value={r.id}>{r.label} — {r.thresholdPercent}% ({r.method === "net-cost" ? "net cost" : "transaction value"})</option>)}
          </select>
          {(() => { const ref = THRESHOLD_REFERENCES.find((r) => r.id === categoryId); if (!ref) return null; return (
            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <span className={`text-[11px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${ref.verified ? "bg-pass/15 text-pass" : "bg-fail/15 text-fail"}`}>{ref.verified ? "Sourced" : "Unverified placeholder"}</span>
              {ref.notes && <p className="text-[13px] leading-relaxed text-paper/60">{ref.notes}</p>}
              {ref.sources.length > 0 && <ul className="space-y-1">{ref.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-seal hover:text-seal/80 underline transition-colors">{s.title}</a></li>)}</ul>}
            </div>
          ); })()}
        </div>

        {/* BOM */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <label className="text-[13px] font-medium text-paper/60">Bill of materials</label>
              <p className="mt-1 text-[12px] text-paper/35">Origin country and USMCA origin status are separate. Country alone does not establish originating status.</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={downloadBomTemplate} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">Download CSV template</button>
              <button onClick={() => fileInputRef.current?.click()} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">Import CSV</button>
              <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleCsvFile} className="hidden" />
              <button onClick={addItem} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">+ Add line item</button>
            </div>
          </div>
          {csvErrors.length > 0 && <div className="mb-3 space-y-1">{csvErrors.map((e, i) => <p key={i} className="text-[12px] text-fail">{e}</p>)}</div>}
          <div className="space-y-2">
            {lineItems.map((item) => {
              const status = item.originStatus || (item.originating ? "originating" : "non-originating");
              return <div key={item.id} className="rounded-lg border border-white/8 bg-white/[0.015] p-3">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <input value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} placeholder="Component" className="col-span-12 sm:col-span-3 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
                  <input value={item.hsCode} onChange={(e) => updateItem(item.id, { hsCode: e.target.value })} placeholder="HS subheading" className="col-span-6 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-mono text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
                  <input value={item.tariffItem || ""} onChange={(e) => updateItem(item.id, { tariffItem: e.target.value })} placeholder="Tariff item" className="col-span-6 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-mono text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
                  <input value={item.countryOfOrigin} onChange={(e) => updateItem(item.id, { countryOfOrigin: e.target.value.toUpperCase() })} placeholder="Origin country" maxLength={2} className="col-span-5 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
                  <input type="number" value={item.value || ""} onChange={(e) => updateItem(item.id, { value: Number(e.target.value) })} placeholder="Value" className="col-span-5 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60" />
                  <button onClick={() => removeItem(item.id)} aria-label="Remove line item" className="col-span-2 sm:col-span-1 text-paper/40 hover:text-fail transition-colors text-sm">✕</button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <select value={status} onChange={(e) => { const next = e.target.value as NonNullable<BOMLineItem["originStatus"]>; updateItem(item.id, { originStatus: next, originating: next === "originating" }); }} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-[12px] text-paper outline-none focus:border-seal/60">
                    <option value="originating">USMCA originating</option><option value="non-originating">Non-originating</option><option value="undetermined">Undetermined</option>
                  </select>
                  <span className="text-[11px] text-paper/35">Origin country is factual; USMCA status is a separate qualification determination.</span>
                  {item.tariffItem && <span className="rounded-full bg-seal/10 px-2 py-0.5 text-[10px] font-medium text-seal">Tariff item recorded</span>}
                </div>
              </div>;
            })}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-start gap-3"><span className="mt-0.5 text-seal">◈</span><div><p className="text-[13px] font-medium text-paper/75">De minimis safeguard</p><p className="mt-1 text-[12px] leading-relaxed text-paper/45">After calculation, OrigynLX shows the separate 10% reference check. It does not automatically override a product-specific tariff-shift rule or change the RVC calculation.</p></div></div>
        </div>

        <button onClick={handleCalculate} disabled={blocked} className="w-full rounded-full bg-seal text-ink text-sm font-semibold h-12 hover:bg-seal/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Calculate</button>
        {blocked && <div className="text-center space-y-3"><p className="text-[13px] text-paper/60">You've used your 5 free checks.</p><a href="/pricing" className="inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-11 hover:bg-seal/90 transition-colors">Unlock unlimited checks — $149/year</a></div>}
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

          {deMinimis && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-paper/50">
                  De minimis reference check
                </span>
                <span className={`text-sm font-semibold ${deMinimis.withinDeMinimis ? "text-pass" : "text-fail"}`}>
                  {deMinimis.nonOriginatingPercent}% {deMinimis.withinDeMinimis ? "— within 10% reference limit" : "— exceeds 10% reference limit"}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-paper/55">
                This only matters if your product also needs a tariff-shift test and some inputs fail it — it
                does not change the RVC result above, and those materials still count as non-originating there.
              </p>
            </div>
          )}

          {!licensed && result.qualifies && (
            <p className="mt-6 text-[13px] leading-relaxed text-paper/60 bg-seal/[0.06] border border-seal/20 rounded-lg px-4 py-3">
              This one qualifies — a license gets you the signed-ready certificate for it, plus unlimited
              checks as your sourcing changes.{" "}
              <a href="/pricing" className="text-seal font-medium hover:text-seal/80 transition-colors">
                See pricing →
              </a>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleDownloadWorksheet}
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
            >
              Download worksheet (PDF)
            </button>
            {!showCert ? (
              licensed ? (
                <button
                  onClick={() => setShowCert(true)}
                  className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
                >
                  Prepare draft certificate
                </button>
              ) : (
                <a
                  href="/pricing"
                  className="rounded-full bg-seal text-ink px-6 py-2.5 text-sm font-semibold hover:bg-seal/90 transition-colors"
                >
                  Unlock the certificate →
                </a>
              )
            ) : null}
          </div>

          {showCert && (
            <div className="mt-4">
              <CertificateForm certInfo={certInfo} setCertInfo={setCertInfo} onDownload={handleDownloadCertificate} />
            </div>
          )}
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

function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(str: string): string {
  return str.replace(/\s+/g, "-").toLowerCase();
}
