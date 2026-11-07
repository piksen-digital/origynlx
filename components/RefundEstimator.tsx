"use client";

import { useMemo, useState } from "react";

/**
 * IEEPA refund estimator (P8) - a lead magnet, not a filing tool.
 *
 * After the Supreme Court struck down the IEEPA tariff layers in
 * Learning Resources v. Trump (Feb 20, 2026), CBP opened refunds through
 * its CAPE system in phases (Apr 20, Jun 29 and Oct 6, 2026). This page
 * estimates exposure only and routes complex cases to /contact.
 */

interface CategoryInfo {
  id: string;
  label: string;
  window: string;
  deadline: string;
}

const CATEGORIES: CategoryInfo[] = [
  {
    id: "fentanyl",
    label: "Fentanyl-related IEEPA duties (China, Mexico, Canada)",
    window: "paid February 4, 2025 - February 24, 2026",
    deadline: "February 4, 2027 (for finally liquidated entries)",
  },
  {
    id: "reciprocal",
    label: "Reciprocal IEEPA duties",
    window: "paid April 5, 2025 - February 24, 2026",
    deadline: "April 5, 2027 (for finally liquidated entries)",
  },
  {
    id: "other",
    label: "Other IEEPA layers (Venezuela, Brazil, Russia)",
    window: "paid 2025 - February 24, 2026",
    deadline: "confirm the liquidation date per entry",
  },
];

interface RowState {
  amountMode: boolean;
  dutyPaid: string;
  baseValue: string;
  ratePercent: string;
  liquidated: boolean;
}

const initialRow = (): RowState => ({
  amountMode: true,
  dutyPaid: "",
  baseValue: "",
  ratePercent: "",
  liquidated: false,
});

export default function RefundEstimator() {
  const [rows, setRows] = useState<RowState[]>([initialRow(), initialRow(), initialRow()]);

  function updateRow(i: number, patch: Partial<RowState>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  const totals = useMemo(() => {
    return rows.map((r, i) => {
      let amount = 0;
      if (r.amountMode) {
        amount = Number(r.dutyPaid) || 0;
      } else {
        amount = ((Number(r.baseValue) || 0) * (Number(r.ratePercent) || 0)) / 100;
      }
      return { category: CATEGORIES[i], amount, liquidated: r.liquidated };
    });
  }, [rows]);

  const total = totals.reduce((n: number, t) => n + t.amount, 0);
  const hasInput = total > 0 || rows.some((r) => Number(r.dutyPaid) > 0 || Number(r.baseValue) > 0);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-medium text-paper">What happened, in one paragraph</p>
        <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
          On February 20, 2026 the Supreme Court struck down the IEEPA tariff layers in Learning Resources v. Trump.
          Roughly $165 billion was collected under them. CBP opened refunds through its CAPE system in phases
          (April 20, June 29 and October 6, 2026), and by the June phase about $104 billion in entries had been
          accepted for processing. Sector-based duties (Section 232 steel and aluminum, Section 301) were not
          affected and remain in force. Facts checked as of November 2026.
        </p>
      </div>

      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-medium text-paper">Estimate your refund exposure</p>
        <p className="mt-1 text-[12px] text-paper/45">Enter what you paid per IEEPA layer - exact duty amounts if you have them, or the value and rate you paid on.</p>

        <div className="mt-5 space-y-5">
          {CATEGORIES.map((c, i) => (
            <div key={c.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-medium text-paper/85">{c.label}</p>
                <button
                  onClick={() => updateRow(i, { amountMode: !rows[i].amountMode })}
                  className="text-[12px] font-medium text-seal hover:text-seal/80 transition-colors"
                >
                  {rows[i].amountMode ? "Switch to value + rate" : "Switch to exact amount"}
                </button>
              </div>
              <p className="mt-1 text-[12px] text-paper/40">Eligible window: {c.window}.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {rows[i].amountMode ? (
                  <div className="sm:col-span-2">
                    <label className="text-[12px] text-paper/45">IEEPA duty paid (USD)</label>
                    <input
                      type="number"
                      min={0}
                      value={rows[i].dutyPaid}
                      onChange={(e) => updateRow(i, { dutyPaid: e.target.value })}
                      placeholder="e.g. 48000"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-[12px] text-paper/45">Duty-paid value (USD)</label>
                      <input
                        type="number"
                        min={0}
                        value={rows[i].baseValue}
                        onChange={(e) => updateRow(i, { baseValue: e.target.value })}
                        placeholder="e.g. 1200000"
                        className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-paper/45">IEEPA rate paid (%)</label>
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={rows[i].ratePercent}
                        onChange={(e) => updateRow(i, { ratePercent: e.target.value })}
                        placeholder="e.g. 10"
                        className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60"
                      />
                    </div>
                  </>
                )}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 pb-2 text-[13px] text-paper/65">
                    <input
                      type="checkbox"
                      checked={rows[i].liquidated}
                      onChange={(e) => updateRow(i, { liquidated: e.target.checked })}
                      className="cursor-pointer"
                    />
                    Entry finally liquidated
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasInput && (
        <div className="rounded-card border border-seal/25 bg-seal/[0.05] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-seal">Estimated refundable exposure</p>
            <p className="font-display text-3xl font-semibold text-seal">
              {"$" + total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {totals.filter((t) => t.amount > 0).map((t) => (
              <div key={t.category.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px]">
                <span className="text-paper/70">{t.category.label}</span>
                <span className="font-semibold text-paper">{"$" + t.amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <span className="w-full text-[12px] text-paper/40 sm:w-auto sm:pl-4">
                  {"Deadline: " + t.category.deadline}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-paper/55">
            Unliquidated entries are being processed automatically through CAPE. Finally liquidated entries need a
            protest - the category deadlines above apply. CBP requires ACH enrollment for refunds to be paid; if you
            are not enrolled in ACH, do that before your refund is approved.
          </p>
        </div>
      )}

      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-medium text-paper">What this estimate does not cover</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-paper/60">
          <li>Section 232 steel and aluminum duties (50%) are unaffected by the ruling and are not refundable through this process.</li>
          <li>Section 301 duties and AD/CVD orders also stand - do not include them above.</li>
          <li>Section 338 tariffs (50% on certain Canadian goods, since August 2026) are a separate regime and not part of IEEPA refunds.</li>
          <li>Interest treatment on refunds is still unsettled - treat any interest as excluded from this estimate.</li>
          <li>This is an estimate for planning, not legal advice and not a filing. Entry-level amounts, liquidation dates and protests are where the real work is.</li>
        </ul>
      </div>

      <div className="rounded-card border border-seal/30 bg-seal/[0.06] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-paper">Want help sizing or assembling a refund claim?</p>
          <p className="mt-1 text-[13px] leading-relaxed text-paper/60">
            OrigynLX can help you organize entry-level duty data for a recovery review - or refer you to a licensed broker who files protests.
          </p>
        </div>
        <a href="/contact" className="whitespace-nowrap rounded-full bg-seal px-5 py-2 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors">Talk to us →</a>
      </div>
    </div>
  );
}
