"use client";

import { useEffect, useState } from "react";
import { generateCertificatePDF, type CertifierInfo } from "@/lib/certificate-pdf";
import { generateAuditWorksheetPDF } from "@/lib/audit-worksheet-pdf";
import { getStoredLicenseKey, storeLicenseKey, tryRestoreLicense } from "@/lib/trial";
import type { BOMLineItem, RVCResult, DeMinimisResult } from "@/lib/rvc-calculator";

interface VaultMeta {
  id: string;
  productName: string;
  hsSubheading: string;
  createdAt: string;
  blanketPeriodEnd: string;
  rvcPercent: number;
  qualifies: boolean;
}

interface RuleWatchView {
  id: string;
  sku: string;
  productName: string;
  hsSubheading: string;
  ruleLabel: string;
  thresholdPercent: number | null;
  createdAt: string;
  pendingAlert?: { detectedAt: string; message: string };
}

interface VaultRecordView {
  id: string;
  productName: string;
  lineItems: BOMLineItem[];
  result: RVCResult;
  deMinimis: DeMinimisResult;
  certInfo: CertifierInfo;
}

function daysUntil(dateStr: string): number | null {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000));
}

export default function VaultClient() {
  const [licensed, setLicensed] = useState(false);
  const [checkingLicense, setCheckingLicense] = useState(true);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [records, setRecords] = useState<VaultMeta[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [watches, setWatches] = useState<RuleWatchView[] | null>(null);

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

  useEffect(() => {
    if (!licensed) return;
    const key = getStoredLicenseKey();
    if (!key) return;
    fetch("/api/vault/list?licenseKey=" + encodeURIComponent(key))
      .then((r) => r.json())
      .then((d) => setRecords(Array.isArray(d.records) ? d.records : []))
      .catch(() => setRecords([]));
    fetch("/api/rule-watch/list?licenseKey=" + encodeURIComponent(key))
      .then((r) => r.json())
      .then((d) => setWatches(Array.isArray(d.watches) ? d.watches : []))
      .catch(() => setWatches([]));
  }, [licensed]);

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

  async function fetchRecord(id: string): Promise<VaultRecordView | null> {
    const key = getStoredLicenseKey();
    if (!key) return null;
    const res = await fetch(
      "/api/vault/get?licenseKey=" + encodeURIComponent(key) + "&id=" + encodeURIComponent(id)
    );
    const data = (await res.json()) as { record?: VaultRecordView };
    return data.record || null;
  }

  async function handleCertificate(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const record = await fetchRecord(id);
      if (!record) {
        setMessage("Could not load that record.");
        setBusyId(null);
        return;
      }
      const bytes = await generateCertificatePDF(record.productName, record.lineItems, record.result, record.certInfo);
      downloadPdf(bytes, slug(record.productName) + "-certificate.pdf");
    } catch {
      setMessage("Could not regenerate the certificate.");
    }
    setBusyId(null);
  }

  async function handleWorksheet(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const record = await fetchRecord(id);
      if (!record) {
        setMessage("Could not load that record.");
        setBusyId(null);
        return;
      }
      const bytes = await generateAuditWorksheetPDF(record.productName, record.lineItems, record.result, record.deMinimis);
      downloadPdf(bytes, slug(record.productName) + "-worksheet.pdf");
    } catch {
      setMessage("Could not regenerate the worksheet.");
    }
    setBusyId(null);
  }

  async function handleDelete(id: string) {
    const key = getStoredLicenseKey();
    if (!key) return;
    setBusyId(id);
    setMessage(null);
    const res = await fetch("/api/vault/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: key, id }),
    });
    if (res.ok) {
      setRecords((rs) => (rs ? rs.filter((r) => r.id !== id) : rs));
      setMessage("Record deleted. You remain responsible for retaining certification records for five years under USMCA Article 5-C.");
    } else {
      setMessage("Could not delete that record.");
    }
    setBusyId(null);
  }

  async function refreshWatches() {
    const key = getStoredLicenseKey();
    if (!key) return;
    const res = await fetch("/api/rule-watch/list?licenseKey=" + encodeURIComponent(key));
    const data = await res.json();
    setWatches(Array.isArray(data.watches) ? data.watches : []);
  }

  async function handleAckWatch(id: string) {
    const key = getStoredLicenseKey();
    if (!key) return;
    await fetch("/api/rule-watch/ack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: key, id }),
    });
    await refreshWatches();
  }

  async function handleRemoveWatch(id: string) {
    const key = getStoredLicenseKey();
    if (!key) return;
    await fetch("/api/rule-watch/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseKey: key, id }),
    });
    setWatches((ws) => (ws ? ws.filter((w) => w.id !== id) : ws));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-paper/70">
          {checkingLicense ? "Checking license..." : licensed ? "License active - record vault unlocked." : "The record vault is a licensed feature."}
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

      {licensed && (
        <>
          <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-paper">Your qualification records</p>
                <p className="mt-1 text-[12px] text-paper/45">Snapshots saved from the calculator: BOM, computed result, certification data. Certificates and worksheets regenerate on demand, exactly as they were.</p>
              </div>
              <a href="/calculator" className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">Save a new record →</a>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-paper/40">
              Five-year retention: USMCA Article 5-C requires certifying parties and importers to keep the records behind a certification for at least five years - the exact window CBP reaches into when it sends a verification request. Blanket-period expiry reminders go out 30 days ahead.
            </p>
          </div>

          {message && <p className="text-[13px] text-seal">{message}</p>}

          {records === null ? (
            <p className="text-sm text-paper/50">Loading records...</p>
          ) : records.length === 0 ? (
            <div className="rounded-card border border-white/12 bg-white/[0.03] p-6 text-sm text-paper/60">
              No records yet. Calculate a product and use Save to record vault on the results screen.
            </div>
          ) : (
            <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-paper/45">
                      <th className="py-2 pr-4 font-medium">Product</th>
                      <th className="py-2 pr-4 font-medium">HS</th>
                      <th className="py-2 pr-4 font-medium">RVC</th>
                      <th className="py-2 pr-4 font-medium">Blanket period end</th>
                      <th className="py-2 pr-4 font-medium">Saved</th>
                      <th className="py-2 pr-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => {
                      const left = daysUntil(r.blanketPeriodEnd);
                      return (
                        <tr key={r.id} className="border-b border-white/5 align-top">
                          <td className="py-2.5 pr-4 text-paper">{r.productName}</td>
                          <td className="py-2.5 pr-4 text-paper/70">{r.hsSubheading || "-"}</td>
                          <td className="py-2.5 pr-4">
                            <span className={r.qualifies ? "font-semibold text-pass" : "font-semibold text-fail"}>
                              {r.rvcPercent + "%"}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-paper/70">
                            {r.blanketPeriodEnd || "-"}
                            {left !== null && left >= 0 && left <= 30 && (
                              <span className="ml-2 rounded-full bg-seal/15 px-2 py-0.5 text-[11px] font-medium text-seal">{"Ends in " + left + " days"}</span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 text-paper/50">{new Date(r.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 pr-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <button onClick={() => handleCertificate(r.id)} disabled={busyId === r.id} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors disabled:opacity-50">Certificate</button>
                              <button onClick={() => handleWorksheet(r.id)} disabled={busyId === r.id} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors disabled:opacity-50">Worksheet</button>
                              <button onClick={() => handleDelete(r.id)} disabled={busyId === r.id} className="text-[13px] text-paper/40 hover:text-fail transition-colors disabled:opacity-50">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-paper">Rule-change watch</p>
                <p className="mt-1 text-[12px] text-paper/45">Products you are monitoring. When a registry revision touches a rule your SKU relies on, the alert appears here and on the calculator until dismissed.</p>
              </div>
              <a href="/calculator" className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">Watch a new product →</a>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-paper/40">OrigynLX monitors its sourced, revision-tagged rule registry - not the Federal Register directly. Treat alerts as a prompt to re-verify, not legal notice.</p>
            {watches === null ? (
              <p className="mt-4 text-sm text-paper/50">Loading watch list...</p>
            ) : watches.length === 0 ? (
              <p className="mt-4 text-sm text-paper/60">Nothing on watch yet. Use Watch for rule changes on the calculator results screen.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {watches.map((w) => (
                  <div key={w.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
                    <div>
                      <p className="text-sm text-paper">{w.sku} <span className="text-paper/40">· HS {w.hsSubheading}</span></p>
                      <p className="text-[12px] text-paper/45">{w.ruleLabel}{w.thresholdPercent != null ? " (" + w.thresholdPercent + "%)" : ""} · watched since {new Date(w.createdAt).toLocaleDateString()}</p>
                      {w.pendingAlert && (
                        <p className="mt-1 text-[12px] leading-relaxed text-fail/90">{w.pendingAlert.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {w.pendingAlert ? (
                        <span className="rounded-full bg-fail/15 px-2.5 py-0.5 text-[11px] font-semibold text-fail">Rule changed - review</span>
                      ) : (
                        <span className="rounded-full bg-pass/10 px-2.5 py-0.5 text-[11px] font-medium text-pass/80">Watching</span>
                      )}
                      {w.pendingAlert && (
                        <button onClick={() => handleAckWatch(w.id)} className="text-[13px] font-medium text-seal hover:text-seal/80 transition-colors">Dismiss</button>
                      )}
                      <button onClick={() => handleRemoveWatch(w.id)} className="text-[13px] text-paper/40 hover:text-fail transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
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
