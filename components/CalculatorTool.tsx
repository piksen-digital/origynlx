"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  FREE_CHECKS,
  checksRemaining,
  hasFreeChecksLeft,
  recordCheckUsed,
  getStoredLicenseKey,
  storeLicenseKey,
  tryRestoreLicense,
} from "@/lib/trial";
import { generateCertificatePDF, type CertifierInfo } from "@/lib/certificate-pdf";
import { generateAuditWorksheetPDF } from "@/lib/audit-worksheet-pdf";
import { parseBOMCsv, downloadBomTemplate } from "@/lib/csv-import";
import { calculateDutySavings, type DutySavingsResult } from "@/lib/duty-savings";
import { analyzeOriginEngineering, type OriginEngineeringResult } from "@/lib/origin-engineering";
import { generateBrokerPackagePDF } from "@/lib/broker-package-pdf";
import { flagTradeRemedies, flagLineItems } from "@/lib/trade-remedy-flags";
import { listSavedBOMs, saveBOM, deleteSavedBOM, type SavedBOM } from "@/lib/saved-boms";
import {
  THRESHOLD_PICKER_OPTIONS,
  buildGroupedThresholdPickerOptions,
  type ThresholdPickerReference,
} from "@/lib/usmca-rule-picker";
import { CALC_COPY } from "./calc-copy";
import { tt } from "@/lib/result-i18n";

let idCounter = 0;
const newId = () => `li_${++idCounter}_${Date.now()}`;

export default function CalculatorTool({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = CALC_COPY[locale];
  const T = (s: string) => tt(s, locale);
  const [productName, setProductName] = useState("");
  const [transactionValue, setTransactionValue] = useState<number>(0);
  const [netCost, setNetCost] = useState<string>("");
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

  const ruleGroups = useMemo(() => buildGroupedThresholdPickerOptions(THRESHOLD_PICKER_OPTIONS), []);
  const totalPickerOptions = THRESHOLD_PICKER_OPTIONS.length;
  const ruleGroupCount = ruleGroups.length;

  const visibleRuleGroups = useMemo(() => {
    const sub4 = hsSubheading.replace(/\D+/g, "").slice(0, 4);
    const head2 = hsHeading.replace(/\D+/g, "").slice(0, 2);
    const chapterMatch = (r: ThresholdPickerReference) => head2.length === 2 && r.chapters.includes(head2);
    const subMatch = (r: ThresholdPickerReference) => {
      const codes = (r.hsRange.match(/\d{4}/g) || []).map(Number);
      if (codes.length >= 2) return Number(sub4) >= codes[0] && Number(sub4) <= codes[codes.length - 1];
      if (codes.length === 1) return Number(sub4) === codes[0];
      return false;
    };
    const keep = (r: ThresholdPickerReference) => {
      if (sub4.length === 4) return subMatch(r) || chapterMatch(r);
      if (head2.length === 2) return chapterMatch(r);
      return true;
    };
    const groups = ruleGroups
      .map((g) => ({ sector: g.sector, options: g.options.filter(keep) }))
      .filter((g) => g.options.length > 0);
    const selected = THRESHOLD_PICKER_OPTIONS.find((r) => r.id === categoryId);
    if (selected && !groups.some((g) => g.options.some((o) => o.id === selected.id))) {
      groups.unshift({ sector: selected.sector, options: [selected] });
    }
    return groups;
  }, [ruleGroups, hsSubheading, hsHeading, categoryId]);

  const totalVisibleOptions = visibleRuleGroups.reduce((n, g) => n + g.options.length, 0);
  const cappedVisibleOptions = Math.min(totalVisibleOptions, 400);
  const cappedRuleGroups = useMemo(() => {
    if (totalVisibleOptions <= 400) return visibleRuleGroups;
    let left = 400;
    return visibleRuleGroups
      .map((g) => { const take = Math.max(0, Math.min(g.options.length, left)); left -= take; return { sector: g.sector, options: g.options.slice(0, take) }; })
      .filter((g) => g.options.length > 0);
  }, [visibleRuleGroups, totalVisibleOptions]);

  const hsChapterDigits = (hsHeading.replace(/\D+/g, "") + hsSubheading.replace(/\D+/g, "")).slice(0, 2);
  const isTextileChapter = hsChapterDigits.length === 2 && Number(hsChapterDigits) >= 50 && Number(hsChapterDigits) <= 63;

  const [importingParty, setImportingParty] = useState("United States");
  const [productionCountry, setProductionCountry] = useState("");
  const [lineItems, setLineItems] = useState<BOMLineItem[]>([emptyLineItem(newId()), emptyLineItem(newId())]);
  const [result, setResult] = useState<RVCResult | null>(null);
  const [deMinimis, setDeMinimis] = useState<DeMinimisResult | null>(null);

  // P1: dollar-savings inputs (free feature)
  const [annualImportValue, setAnnualImportValue] = useState<string>("");
  const [mfnRateInput, setMfnRateInput] = useState<string>("");
  const [surchargeRateInput, setSurchargeRateInput] = useState<string>("0");
  const [entriesPerYearInput, setEntriesPerYearInput] = useState<string>("12");
  // P2: origin-engineering output (free feature)
  const [engineering, setEngineering] = useState<OriginEngineeringResult | null>(null);

  // P6: record vault
  const [vaultMessage, setVaultMessage] = useState<string | null>(null);

  // P5: rule-change watch
  const [watching, setWatching] = useState(false);
  const [watchMessage, setWatchMessage] = useState<string | null>(null);
  const [ruleAlert, setRuleAlert] = useState<{ id: string; message: string } | null>(null);

  const [licensed, setLicensed] = useState(false);
  const [checkingLicense, setCheckingLicense] = useState(true);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(FREE_CHECKS);

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

  useEffect(() => {
    if (!licensed) return;
    const key = getStoredLicenseKey();
    if (!key) return;
    fetch("/api/rule-watch/list?licenseKey=" + encodeURIComponent(key))
      .then((r) => r.json())
      .then((d) => {
        const watches = Array.isArray(d.watches) ? d.watches : [];
        const alert = watches.find((w: { id: string; pendingAlert?: { message: string } }) => w.pendingAlert);
        if (alert && alert.pendingAlert) {
          setRuleAlert({ id: alert.id, message: alert.pendingAlert.message });
        }
      })
      .catch(() => undefined);
  }, [licensed]);

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
    const ref = THRESHOLD_PICKER_OPTIONS.find((r) => r.id === id);
    if (!ref) return;
    if (ref.ruleBasis === "rvc" || ref.ruleBasis === "tariff-shift-or-rvc" || ref.ruleBasis === "special") {
      setRuleBasis(ref.ruleBasis);
    }
    setRvcMethod(ref.method);
    setMethod(ref.method);
    setThreshold(ref.thresholdPercent);
  }

  function handleCalculate() {
    if (!licensed && !hasFreeChecksLeft()) return;
    const input = {
      productName,
      transactionValue,
      netCost: method === "net-cost" ? Number(netCost) || undefined : undefined,
      method,
      thresholdPercent: threshold,
      lineItems,
    };
    const r = calculateRVC(input);
    setResult(r);
    setDeMinimis(checkDeMinimis({ transactionValue, lineItems }));
    setEngineering(analyzeOriginEngineering(input, r));
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
      setLicenseError(data.error || t.licenseInactive);
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

  async function handleDownloadBrokerPackage() {
    if (!result) return;
    const bytes = await generateBrokerPackagePDF({
      productName: productName || "Untitled product",
      hsSubheading,
      tariffItem,
      productionCountry,
      importingParty,
      lineItems,
      result,
      deMinimis,
      certInfo,
      savings,
      engineering,
    });
    downloadPdf(bytes, (slug(productName || "origynlx-broker-package")) + "-broker-package.pdf");
  }

  async function handleSaveToVault() {
    if (!result) return;
    const key = getStoredLicenseKey();
    if (!key || !licensed) return;
    setVaultMessage(null);
    const res = await fetch("/api/vault/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        licenseKey: key,
        record: {
          productName: productName || "Untitled product",
          hsSubheading,
          tariffItem,
          productionCountry,
          importingParty,
          method,
          threshold,
          transactionValue,
          netCost: method === "net-cost" ? Number(netCost) || undefined : undefined,
          lineItems,
          certInfo,
        },
      }),
    });
    const data = await res.json();
    if (res.ok && data.id) {
      setVaultMessage(t.savedToVault);
    } else {
      setVaultMessage(data.error || t.vaultSaveFail);
    }
  }

  async function handleWatchProduct() {
    const key = getStoredLicenseKey();
    if (!key || !licensed) return;
    setWatchMessage(null);
    const res = await fetch("/api/rule-watch/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        licenseKey: key,
        sku: productName || hsSubheading,
        productName: productName || "Untitled product",
        hsSubheading,
        ruleId: categoryId || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setWatching(true);
      setWatchMessage(t.watchOn);
    } else {
      setWatchMessage(data.error || t.watchFail);
    }
  }

  async function handleAckAlert() {
    const key = getStoredLicenseKey();
    if (!key || !ruleAlert) return;
    await fetch("/api/rule-watch/ack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: key, id: ruleAlert.id }),
    });
    setRuleAlert(null);
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

  const selectedRuleRef = THRESHOLD_PICKER_OPTIONS.find((r) => r.id === categoryId) ?? null;
  const blocked = !licensed && remaining <= 0;

  // P1: duty-savings estimate, recomputed from the same result
  const savings = useMemo<DutySavingsResult | null>(() => {
    if (!result) return null;
    const annual = Number(annualImportValue) || 0;
    if (annual <= 0) return null;
    return calculateDutySavings({
      annualImportValue: annual,
      mfnDutyRatePercent: Number(mfnRateInput) || 0,
      surchargeRatePercent: Number(surchargeRateInput) || 0,
      entriesPerYear: Number(entriesPerYearInput) || 1,
      importingParty,
      exportCountry: productionCountry,
      qualifies: result.qualifies,
    });
  }, [result, annualImportValue, mfnRateInput, surchargeRateInput, entriesPerYearInput, importingParty, productionCountry]);

  // P7: trade remedies that survive USMCA (232/301/AD-CVD), free feature
  const remedyFlags = useMemo(() => {
    if (!result) return [];
    return flagTradeRemedies({ hsCode: hsSubheading, countryOfOrigin: productionCountry });
  }, [result, hsSubheading, productionCountry]);

  const componentRemedyFlags = useMemo(() => {
    if (!result) return [];
    return flagLineItems(lineItems);
  }, [result, lineItems]);

  return (
    <div className="space-y-8">
      {/* P3: batch qualifier banner */}
      <div className="rounded-card border border-seal/20 bg-seal/[0.04] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-paper">{t.moreThanOne}</p>
          <p className="mt-1 text-[13px] text-paper/55">{t.batchBlurb}</p>
        </div>
        <a href={locale === "es" ? "/es/batch" : "/batch"} className="whitespace-nowrap rounded-full border border-seal/40 px-5 py-2 text-sm font-medium text-seal hover:bg-seal/10 transition-colors">{t.batchCta} →</a>
      </div>

      {ruleAlert && (
        <div className="rounded-card border border-fail/40 bg-fail/[0.06] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-fail">{t.ruleChangeTitle}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-paper/65">{ruleAlert.message}</p>
              <p className="mt-1 text-[12px] text-paper/40">{t.ruleChangeNote}</p>
            </div>
            <button onClick={handleAckAlert} className="whitespace-nowrap text-[13px] text-paper/50 hover:text-paper transition-colors">{t.dismiss}</button>
          </div>
        </div>
      )}

      {/* Trial / license status bar */}
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {checkingLicense ? (
          <p className="text-sm text-paper/50">{t.checkingLicense}</p>
        ) : licensed ? (
          <p className="text-sm text-pass">{t.licenseActive}</p>
        ) : (
          <p className="text-sm text-paper/70">{t.freeRemaining(remaining)}</p>
        )}
        {!licensed && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                placeholder={t.haveKey}
                className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
              />
              <button
                onClick={handleRedeem}
                className="rounded-lg border border-white/20 px-3 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
              >
              {t.unlock}
              </button>
            </div>
            <a href={locale === "es" ? "/es/pricing" : "/pricing"} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors whitespace-nowrap">
              {t.getLicense} →
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
              placeholder={t.nameToSave}
              className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
            <button
              onClick={handleSaveBOM}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
            >
              {t.save}
            </button>
          </div>
          {savedBOMs.length > 0 && (
            <button
              onClick={() => setShowSaved((v) => !v)}
              className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors"
            >
              {showSaved ? t.hide : t.savedProducts(savedBOMs.length)}
            </button>
          )}
        </div>
        <p className="mt-2 text-[12px] text-paper/40">{t.savedLocalNote}</p>

        {showSaved && (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            {savedBOMs.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                <div>
                  <p className="text-sm text-paper">{b.name}</p>
                  <p className="text-[12px] text-paper/40">{new Date(b.savedAt).toLocaleDateString()} • {b.lineItems.length + " " + t.lineItems}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleLoadBOM(b)} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">{t.load}</button>
                  <button onClick={() => handleDeleteBOM(b.id)} className="text-[13px] text-paper/40 hover:text-fail transition-colors">{t.delete}</button>
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
            <label className="text-[13px] font-medium text-paper/60">{t.finishedClassification}</label>
            <span className="text-[11px] uppercase tracking-wide text-paper/35">{t.ruleRouting}</span>
          </div>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[12px] text-paper/45">{t.hsHeading}</label>
              <input value={hsHeading} onChange={(e) => setHsHeading(e.target.value)} placeholder={t.phHeading} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
            </div>
            <div>
              <label className="text-[12px] text-paper/45">{t.hsSubheading}</label>
              <input value={hsSubheading} onChange={(e) => setHsSubheading(e.target.value)} placeholder={t.phSubheading} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
            </div>
          </div>
          <button type="button" onClick={() => setShowAdvancedClassification((v) => !v)} className="mt-3 text-[12px] font-medium text-seal hover:text-seal/80 transition-colors">
            {showAdvancedClassification ? t.hideAdvanced : t.showAdvanced}
          </button>
          {showAdvancedClassification && (
            <div className="mt-3 grid gap-5 sm:grid-cols-2 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div>
                <label className="text-[12px] text-paper/45">{t.usHts}</label>
                <input value={tariffItem} onChange={(e) => setTariffItem(e.target.value)} placeholder={t.phTariffItem} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
              </div>
              <div>
                <label className="text-[12px] text-paper/45">{t.annexItem}</label>
                <input value={annexTariffItem} onChange={(e) => setAnnexTariffItem(e.target.value)} placeholder={t.phAnnexItem} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
              </div>
            </div>
          )}
          {tariffItem.trim() && (
            <div className="mt-3 rounded-lg border border-seal/25 bg-seal/[0.06] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-seal/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-seal">{t.tariffRuleDetected}</span>
                <span className="text-[12px] text-paper/45">{t.manualRuleNote}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-paper/55">{t.tariffRuleBlurb}</p>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium text-paper/60">{t.productName}</label>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={t.phProduct} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">{t.transactionValue}</label>
            <input type="number" min={0} value={transactionValue || ""} onChange={(e) => setTransactionValue(Number(e.target.value))} placeholder="0.00" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">{t.productionCountry}</label>
            <input value={productionCountry} onChange={(e) => setProductionCountry(e.target.value)} placeholder={t.phCountry} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-paper/60">{t.importingParty}</label>
            <select value={importingParty} onChange={(e) => setImportingParty(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60">
              <option>United States</option><option>Canada</option><option>Mexico</option>
            </select>
          </div>
        </div>

        {/* Rule basis */}
        <div>
          <label className="text-[13px] font-medium text-paper/60">{t.ruleBasis}</label>
          <select value={ruleBasis} onChange={(e) => handleRuleBasisChange(e.target.value as RuleBasis)} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60">
            <option value="custom">{t.optCustom}</option>
            <option value="tariff-shift">{t.optTariffShift}</option>
            <option value="rvc">{t.optRvc}</option>
            <option value="tariff-shift-or-rvc">{t.optShiftOrRvc}</option>
            <option value="special">{t.optSpecial}</option>
          </select>
        </div>

        {(ruleBasis === "rvc" || ruleBasis === "tariff-shift-or-rvc" || (ruleBasis === "special" && selectedRuleRef)) && (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <label className="text-[13px] font-medium text-paper/60">{t.rvcMethod}</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-paper/70"><input type="radio" name="rvc-method" checked={rvcMethod === "transaction-value"} onChange={() => handleRvcMethodChange("transaction-value")} className="cursor-pointer" /> {t.transactionValueMethod}</label>
              <label className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-paper/70"><input type="radio" name="rvc-method" checked={rvcMethod === "net-cost"} onChange={() => handleRvcMethodChange("net-cost")} className="cursor-pointer" /> {t.netCostMethod}</label>
            </div>
            <div className="mt-4">
            {method === "net-cost" && (
              <div>
                <label className="text-[12px] text-paper/45">{t.netCostLabel}</label>
                <input type="number" min={0} value={netCost} onChange={(e) => setNetCost(e.target.value)} placeholder={t.phNetCost} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
                <p className="mt-2 text-[11px] leading-relaxed text-paper/40">{t.netCostNote}</p>
              </div>
            )}
              <label className="text-[12px] text-paper/45">{t.thresholdLabel}</label>
              <input type="number" min={0} max={100} value={threshold} onChange={(e) => { setThreshold(Number(e.target.value)); setCategoryId(""); }} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60" />
            </div>
          </div>
        )}

        {ruleBasis === "tariff-shift" && <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-[13px] leading-relaxed text-paper/55">{t.tariffShiftNote}</div>}

        <div>
          <label className="text-[13px] font-medium text-paper/60">{t.ruleCategory}</label>
          <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-paper outline-none focus:border-seal/60">
            <option value="">{t.optCustomManual}</option>
            {cappedRuleGroups.map((g) => (
              <optgroup key={g.sector} label={g.sector}>
                {g.options.map((r) => (
                  <option key={r.id} value={r.id}>{r.hsRange} — {r.thresholdPercent}% ({r.method === "net-cost" ? t.netCostShort : t.transactionValueShort})</option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-2 text-[12px] text-paper/40">
            {t.thresholdsAcross(totalPickerOptions, ruleGroupCount)}
            {totalVisibleOptions > cappedVisibleOptions && {t.showingFirst(cappedVisibleOptions)}}
            {totalVisibleOptions === 0 && !selectedRuleRef && isTextileChapter && t.textileNote}
            {totalVisibleOptions === 0 && !selectedRuleRef && !isTextileChapter && hsSubheading.trim() !== "" && t.noRuleMatched}
          </p>
          {(() => { const ref = selectedRuleRef; if (!ref) return null; const badge = ref.auditStatus === "human_verified" ? { cls: "bg-pass/15 text-pass", text: t.humanVerified } : ref.auditStatus === "primary_sourced_unaudited" ? { cls: "bg-seal/15 text-seal", text: t.primarySourced } : { cls: "bg-fail/15 text-fail", text: t.unverified }; return (
            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${badge.cls}`}>{badge.text}</span>
                <span className="text-[12px] text-paper/45">{ref.sector} · HS {ref.hsRange}</span>
              </div>
              <p className="text-[13px] font-medium text-paper/80">{ref.label}</p>
              <p className="text-[12px] text-paper/55">{t.thresholdWord}: {ref.thresholdPercent}% {ref.method === "net-cost" ? t.netCostShort : t.transactionValueShort}{ref.ruleEffectiveFrom ? ` · ${t.effective} ${ref.ruleEffectiveFrom}` : ""}{ref.ruleEffectiveTo ? ` ${t.until} ${ref.ruleEffectiveTo}` : ""}</p>
              {ref.tariffShiftRule && <p className="text-[12px] leading-relaxed text-paper/55"><span className="font-medium text-paper/70">{t.tariffShiftRuleLabel}</span>{ref.tariffShiftRule}</p>}
              {ref.condition && <p className="text-[12px] leading-relaxed text-paper/55"><span className="font-medium text-paper/70">{t.rvcConditionLabel}</span>{ref.condition}</p>}
              {ref.notes && <p className="text-[13px] leading-relaxed text-paper/60">{ref.notes}</p>}
              {ref.sources.length > 0 && <ul className="space-y-1">{ref.sources.map((s: { url: string; title: string }) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-seal hover:text-seal/80 transition-colors">{s.title}</a></li>)}</ul>}
            </div>
          ); })()}
        </div>

        {/* BOM */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <label className="text-[13px] font-medium text-paper/60">{t.bomLabel}</label>
              <p className="mt-1 text-[12px] text-paper/35">{t.bomHint}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={downloadBomTemplate} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">{t.downloadTemplate}</button>
              <button onClick={() => fileInputRef.current?.click()} className="text-[13px] font-medium text-paper/60 hover:text-paper transition-colors">{t.importCsv}</button>
              <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleCsvFile} className="hidden" />
              <button onClick={addItem} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">+ {t.addLineItem}</button>
            </div>
          </div>
          {csvErrors.length > 0 && <div className="mb-3 space-y-1">{csvErrors.map((e, i) => <p key={i} className="text-[12px] text-fail">{T(e)}</p>)}</div>}
          <div className="space-y-2">
            {lineItems.map((item) => {
              const status = item.originStatus || (item.originating ? "originating" : "non-originating");
              return <div key={item.id} className="rounded-lg border border-white/8 bg-white/[0.015] p-3">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <input value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} placeholder={t.phComponent} className="col-span-12 sm:col-span-3 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
                  <input value={item.hsCode} onChange={(e) => updateItem(item.id, { hsCode: e.target.value })} placeholder={t.phComponentHs} className="col-span-6 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
                  <input value={item.tariffItem || ""} onChange={(e) => updateItem(item.id, { tariffItem: e.target.value })} placeholder={t.phComponentTariff} className="col-span-6 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
                  <input value={item.countryOfOrigin} onChange={(e) => updateItem(item.id, { countryOfOrigin: e.target.value.toUpperCase() })} placeholder={t.phComponentCountry} maxLength={2} className="col-span-4 sm:col-span-1 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper uppercase outline-none focus:border-seal/60" />
                  <input type="number" value={item.value || ""} onChange={(e) => updateItem(item.id, { value: Number(e.target.value) })} placeholder={t.phValue} className="col-span-5 sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
                  <button onClick={() => removeItem(item.id)} aria-label={t.removeLineItemA11y} className="col-span-2 sm:col-span-1 text-paper/40 hover:text-fail transition-colors text-sm">✕</button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <select value={status} onChange={(e) => { const next = e.target.value as NonNullable<BOMLineItem["originStatus"]>; updateItem(item.id, { originStatus: next, originating: next === "originating" }); }} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-paper outline-none focus:border-seal/60">
                    <option value="originating">{t.optOriginating}</option><option value="non-originating">{t.optNonOriginating}</option><option value="undetermined">{t.optUndetermined}</option>
                  </select>
                  <span className="text-[11px] text-paper/35">{t.originCountryNote}</span>
                  {item.tariffItem && <span className="rounded-full bg-seal/10 px-2 py-0.5 text-[10px] font-medium text-seal">{t.tariffItemRecorded}</span>}
                </div>
              </div>;
            })}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-start gap-3"><span className="mt-0.5 text-seal">◈</span><div><p className="text-[13px] font-medium text-paper/75">{t.deminimisTitle}</p><p className="mt-1 text-[12px] leading-relaxed text-paper/55">{t.deminimisBlurb}</p></div></div>
        </div>

        <button onClick={handleCalculate} disabled={blocked} className="w-full rounded-full bg-seal text-ink text-sm font-semibold h-12 hover:bg-seal/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{t.calculateCta}</button>
        {blocked && <div className="text-center space-y-3"><p className="text-[13px] text-paper/60">{t.usedFreeChecks}</p><a href={locale === "es" ? "/es/pricing" : "/pricing"} className="inline-flex items-center justify-center gap-2 text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">{t.unlockUnlimited} <span>→</span></a></div>}
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-card border border-white/12 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-paper/50">{t.resultWord}</span>
              <p className="mt-2 font-display text-4xl font-semibold text-paper">{result.rvcPercent}%</p>
              <p className="text-[13px] text-paper/50">{t.vsThreshold(result.thresholdPercent)}</p>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                result.qualifies ? "bg-pass/15 text-pass" : "bg-fail/15 text-fail"
              }`}
            >
              {result.qualifies ? t.qualifies : t.doesNotQualify}
            </span>
          </div>

          {result.warnings.length > 0 && (
            <div className="mt-6 space-y-2">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-paper/60 border-l-2 border-seal/40 pl-3">
                  {T(w)}
                </p>
              ))}
            </div>
          )}

          {deMinimis && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-paper/50">
                  {t.deminimisCheck}
                </span>
                <span className={`text-sm font-semibold ${deMinimis.withinDeMinimis ? "text-pass" : "text-fail"}`}>
                  {deMinimis.nonOriginatingPercent}% {deMinimis.withinDeMinimis ? "— " + t.withinLimit : "— " + t.exceedsLimit}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-paper/55">
                {t.deminimisCheckNote}
              </p>
            </div>
          )}


          {/* P1: dollar-savings view */}
          <div className="mt-6 rounded-lg border border-seal/25 bg-seal/[0.05] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-seal">{t.worthTitle}</span>
              {savings && (
                <span className="text-sm font-semibold text-seal">
                  {"$" + savings.totalAnnualAvoided.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " " + t.savedPerYear}
                </span>
              )}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-paper/55">
              {t.savingsBlurb}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div>
                <label className="text-[12px] text-paper/45">{t.annualValue}</label>
                <input type="number" min={0} value={annualImportValue} onChange={(e) => setAnnualImportValue(e.target.value)} placeholder="e.g. 250000" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
              </div>
              <div>
                <label className="text-[12px] text-paper/45">{t.mfnRate}</label>
                <input type="number" min={0} step="0.1" value={mfnRateInput} onChange={(e) => setMfnRateInput(e.target.value)} placeholder="e.g. 4.2" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
              </div>
              <div>
                <label className="text-[12px] text-paper/45">{t.surchargeRate}</label>
                <input type="number" min={0} step="0.1" value={surchargeRateInput} onChange={(e) => setSurchargeRateInput(e.target.value)} placeholder="0" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
              </div>
              <div>
                <label className="text-[12px] text-paper/45">{t.entriesPerYear}</label>
                <input type="number" min={1} value={entriesPerYearInput} onChange={(e) => setEntriesPerYearInput(e.target.value)} placeholder="12" className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
              </div>
            </div>
            {savings && (
              <div className="mt-4 grid gap-3 sm:grid-cols-4 text-[13px]">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                  <p className="text-paper/45">{t.mfnAvoided}</p>
                  <p className="mt-1 font-semibold text-paper">{"$" + savings.annualDutyAvoided.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                  <p className="text-paper/45">{t.surchargeAvoided}</p>
                  <p className="mt-1 font-semibold text-paper">{"$" + savings.annualSurchargeAvoided.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                  <p className="text-paper/45">{t.mpfAvoided}</p>
                  <p className="mt-1 font-semibold text-paper">{"$" + savings.annualMpfAvoided.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="rounded-lg border border-seal/30 bg-seal/10 px-3 py-2">
                  <p className="text-paper/45">{t.totalPerYear}</p>
                  <p className="mt-1 font-semibold text-seal">{"$" + savings.totalAnnualAvoided.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            )}
            {savings && savings.warnings.map((w, i) => (
              <p key={i} className="mt-3 border-l-2 border-fail/40 pl-3 text-[12px] leading-relaxed text-paper/60">{T(w)}</p>
            ))}
            {savings && remedyFlags.some((f) => f.kind === "232-steel" || f.kind === "232-aluminum") && (
              <p className="mt-3 border-l-2 border-fail/60 pl-3 text-[12px] font-medium leading-relaxed text-fail/90">
                {t.remedySavingsNote}
              </p>
            )}
            {savings && (
              <details className="mt-3 text-[12px] text-paper/50">
                <summary className="cursor-pointer text-paper/60">{t.howNumbersWork}</summary>
                <ul className="mt-2 list-disc space-y-1.5 pl-4">
                  {savings.notes.map((n, i) => (
                    <li key={i} className="leading-relaxed">{T(n)}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          {/* P7: trade remedies that survive USMCA */}
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-paper/50">{t.remediesTitle}</span>
              {remedyFlags.length === 0 && componentRemedyFlags.length === 0 && (
                <span className="text-[12px] font-medium text-pass">{t.noRemedyFlags}</span>
              )}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-paper/55">
              {t.remediesBlurb}
            </p>
            {remedyFlags.map((f, i) => (
              <div
                key={i}
                className={"mt-3 rounded-lg border px-3 py-2 " + (f.severity === "critical" ? "border-fail/40 bg-fail/[0.05]" : f.severity === "warning" ? "border-seal/40 bg-seal/[0.05]" : "border-white/10 bg-white/[0.02]")}
              >
                <p className={"text-[13px] font-semibold " + (f.severity === "critical" ? "text-fail" : f.severity === "warning" ? "text-seal" : "text-paper/75")}>{T(f.label)}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-paper/60">{T(f.text)}</p>
              </div>
            ))}
            {componentRemedyFlags.length > 0 && (
              <div className="mt-3 text-[12px] leading-relaxed text-paper/50">
                <p className="font-medium text-paper/60">{t.flaggedInputs}</p>
                {componentRemedyFlags.map((c) => (
                  <p key={c.id} className="mt-1">{c.description + " - " + T(c.flag.short) + " " + t.remedyComponentNote}</p>
                ))}
              </div>
            )}
            {remedyFlags.length === 0 && componentRemedyFlags.length === 0 && (
              <p className="mt-3 text-[12px] leading-relaxed text-paper/45">
                {t.noRemedyDetected}
              </p>
            )}
          </div>

          {/* P2: origin engineering */}
          {engineering && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-paper/50">{t.engineeringTitle}</span>
                {engineering.mode === "fix-it" ? (
                  <span className="text-sm font-semibold text-fail">
                    {"$" + (engineering.dollarGap ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " " + t.shortOfQualifying}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-pass">
                    {"$" + (engineering.headroomValue ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " " + t.ofHeadroom}
                  </span>
                )}
              </div>
              {engineering.mode === "fix-it" ? (
                <div className="mt-2">
                  <p className="text-[12px] leading-relaxed text-paper/55">
                    {t.needMoreContent((engineering.dollarGap ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 }))}
                  </p>
                  {engineering.cheapestQualifyingSwaps.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {engineering.cheapestQualifyingSwaps.slice(0, 5).map((c) => (
                        <li key={c.id} className="rounded-lg border border-pass/25 bg-pass/[0.05] px-3 py-2 text-[13px]">
                          <span className="font-medium text-paper">{c.description}</span>
                          <span className="text-paper/55">{t.swapForSource(c.value.toLocaleString("en-US"))}</span>
                          <span className="font-semibold text-pass">{c.newRvcPercent + "%"}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-[13px] text-paper/55">{t.noSingleSwap}</p>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-[12px] leading-relaxed text-paper/55">
                    {t.qualifyingWithMargin(result.marginPercent.toFixed(1), (engineering.headroomValue ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 }))}
                  </p>
                  {engineering.swapCandidates.length > 0 && (
                    <p className="mt-2 text-[13px] text-paper/60">
                      {engineering.swapCandidates[0].description + " (" + engineering.swapCandidates[0].rvcGainPercent.toFixed(1) + " " + t.pointsIfSwapped + ")"}
                    </p>
                  )}
                </div>
              )}
              <details className="mt-3 text-[12px] text-paper/50">
                <summary className="cursor-pointer text-paper/60">{t.methodCaveats}</summary>
                <ul className="mt-2 list-disc space-y-1.5 pl-4">
                  {engineering.notes.map((n, i) => (
                    <li key={i} className="leading-relaxed">{T(n)}</li>
                  ))}
                </ul>
              </details>
            </div>
          )}

          {!licensed && result.qualifies && (
            <p className="mt-6 text-[13px] leading-relaxed text-paper/60 bg-seal/[0.06] border border-seal/20 rounded-lg px-4 py-3">
              {t.qualifiesUpsell}{" "}
              <a href={locale === "es" ? "/es/pricing" : "/pricing"} className="text-seal font-medium hover:text-seal/80 transition-colors">
                {t.seePricing} →
              </a>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleDownloadWorksheet}
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
            >
              {t.downloadWorksheet}
            </button>
            {licensed && (
              <button
                onClick={handleDownloadBrokerPackage}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
              >
                {t.downloadBrokerPackage}
              </button>
            )}
            {licensed && (
              <button
                onClick={handleSaveToVault}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
              >
                {t.saveToVault}
              </button>
            )}
            {licensed && (
              <button
                onClick={handleWatchProduct}
                disabled={watching}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {watching ? t.watchingRules : t.watchRules}
              </button>
            )}
            {!showCert ? (
              licensed ? (
                <button
                  onClick={() => setShowCert(true)}
                  className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-paper/80 hover:border-seal/60 hover:text-paper transition-colors"
                >
                  {t.prepareCert}
                </button>
              ) : (
                <a
                  href={locale === "es" ? "/es/pricing" : "/pricing"}
                  className="rounded-full bg-seal text-ink px-6 py-2.5 text-sm font-semibold hover:bg-seal/90 transition-colors"
                >
                  {t.unlockCert} →
                </a>
              )
            ) : null}
          </div>

          {watchMessage && (
            <p className="mt-3 text-[13px] text-seal">{watchMessage}</p>
          )}
          {vaultMessage && (
            <p className="mt-3 text-[13px] text-seal">{vaultMessage}</p>
          )}

          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-[13px] leading-relaxed text-paper/55">
            <span className="font-medium text-paper/75">{t.brokerBoxTitle}</span>{" "}
            {t.brokerBoxBody}{" "}
            <a href={locale === "es" ? "/es/contact" : "/contact"} className="font-medium text-seal hover:text-seal/80 transition-colors">{t.brokerReferral}</a>{" "}
            {t.brokerBoxTail}
          </div>

          {showCert && (
            <div className="mt-4">
              <CertificateForm certInfo={certInfo} setCertInfo={setCertInfo} onDownload={handleDownloadCertificate} locale={locale} />
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
  locale = "en",
}: {
  certInfo: CertifierInfo;
  setCertInfo: (c: CertifierInfo) => void;
  onDownload: () => void;
  locale?: "en" | "es";
}) {
  const t = CALC_COPY[locale];
  function set<K extends keyof CertifierInfo>(key: K, value: CertifierInfo[K]) {
    setCertInfo({ ...certInfo, [key]: value });
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <p className="text-[13px] text-paper/50">
        {t.certIntro}
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
        <input placeholder={t.phCertifierName} value={certInfo.certifierName} onChange={(e) => set("certifierName", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phCertifierAddress} value={certInfo.certifierAddress} onChange={(e) => set("certifierAddress", e.target.value)} className="sm:col-span-2 rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phCertifierEmail} value={certInfo.certifierEmail} onChange={(e) => set("certifierEmail", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phCertifierPhone} value={certInfo.certifierPhone} onChange={(e) => set("certifierPhone", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phProducerName} value={certInfo.producerName} onChange={(e) => set("producerName", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phProducerAddress} value={certInfo.producerAddress} onChange={(e) => set("producerAddress", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phImporterName} value={certInfo.importerName} onChange={(e) => set("importerName", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phImporterAddress} value={certInfo.importerAddress} onChange={(e) => set("importerAddress", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phBlanketStart} value={certInfo.blanketPeriodStart} onChange={(e) => set("blanketPeriodStart", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
        <input placeholder={t.phBlanketEnd} value={certInfo.blanketPeriodEnd} onChange={(e) => set("blanketPeriodEnd", e.target.value)} className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60" />
      </div>
      <button
        onClick={onDownload}
        className="rounded-full bg-seal text-ink text-sm font-semibold px-6 h-11 hover:bg-seal/90 transition-colors"
      >
        {t.downloadCert}
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
