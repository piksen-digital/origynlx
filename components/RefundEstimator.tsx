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

const CATEGORIES: Record<"en" | "es", CategoryInfo[]> = {
  en: [
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
  ],
  es: [
    {
      id: "fentanyl",
      label: "Derechos IEEPA relacionados con fentanilo (China, México, Canadá)",
      window: "pagados entre el 4 de febrero de 2025 y el 24 de febrero de 2026",
      deadline: "4 de febrero de 2027 (para entradas liquidadas definitivamente)",
    },
    {
      id: "reciprocal",
      label: "Derechos IEEPA recíprocos",
      window: "pagados entre el 5 de abril de 2025 y el 24 de febrero de 2026",
      deadline: "5 de abril de 2027 (para entradas liquidadas definitivamente)",
    },
    {
      id: "other",
      label: "Otras capas IEEPA (Venezuela, Brasil, Rusia)",
      window: "pagados entre 2025 y el 24 de febrero de 2026",
      deadline: "confirma la fecha de liquidación por entrada",
    },
  ],
};

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

const COPY = {
  en: {
    whatHappened: "What happened, in one paragraph",
    whatHappenedBody:
      "On February 20, 2026 the Supreme Court struck down the IEEPA tariff layers in Learning Resources v. Trump. Roughly $165 billion was collected under them. CBP opened refunds through its CAPE system in phases (April 20, June 29 and October 6, 2026), and by the June phase about $104 billion in entries had been accepted for processing. Sector-based duties (Section 232 steel and aluminum, Section 301) were not affected and remain in force. Facts checked as of November 2026.",
    estimateTitle: "Estimate your refund exposure",
    estimateHint:
      "Enter what you paid per IEEPA layer - exact duty amounts if you have them, or the value and rate you paid on.",
    switchToValueRate: "Switch to value + rate",
    switchToExact: "Switch to exact amount",
    eligibleWindow: "Eligible window: ",
    dutyPaidLabel: "IEEPA duty paid (USD)",
    baseValueLabel: "Duty-paid value (USD)",
    rateLabel: "IEEPA rate paid (%)",
    liquidatedLabel: "Entry finally liquidated",
    phAmount: "e.g. 48000",
    phValue: "e.g. 1200000",
    phRate: "e.g. 10",
    exposureTitle: "Estimated refundable exposure",
    deadlineWord: "Deadline: ",
    note: "Unliquidated entries are being processed automatically through CAPE. Finally liquidated entries need a protest - the category deadlines above apply. CBP requires ACH enrollment for refunds to be paid; if you are not enrolled in ACH, do that before your refund is approved.",
    notCoveredTitle: "What this estimate does not cover",
    notCovered: [
      "Section 232 steel and aluminum duties (50%) are unaffected by the ruling and are not refundable through this process.",
      "Section 301 duties and AD/CVD orders also stand - do not include them above.",
      "Section 338 tariffs (50% on certain Canadian goods, since August 2026) are a separate regime and not part of IEEPA refunds.",
      "Interest treatment on refunds is still unsettled - treat any interest as excluded from this estimate.",
      "This is an estimate for planning, not legal advice and not a filing. Entry-level amounts, liquidation dates and protests are where the real work is.",
    ],
    helpTitle: "Want help sizing or assembling a refund claim?",
    helpBody:
      "OrigynLX can help you organize entry-level duty data for a recovery review - or refer you to a licensed broker who files protests.",
    talkCta: "Talk to us →",
  },
  es: {
    whatHappened: "Qué pasó, en un párrafo",
    whatHappenedBody:
      "El 20 de febrero de 2026 la Corte Suprema derogó las capas arancelarias IEEPA en Learning Resources v. Trump. Bajo ellas se recaudaron aproximadamente 165 mil millones de dólares. CBP abrió los reembolsos a través de su sistema CAPE por fases (20 de abril, 29 de junio y 6 de octubre de 2026), y para la fase de junio ya se habían aceptado para procesamiento unos 104 mil millones de dólares en entradas. Los aranceles sectoriales (Sección 232 de acero y aluminio, Sección 301) no se vieron afectados y siguen vigentes. Datos verificados a noviembre de 2026.",
    estimateTitle: "Estima tu exposición reembolsable",
    estimateHint:
      "Ingresa lo que pagaste por cada capa IEEPA: montos exactos de derechos si los tienes, o el valor y la tasa sobre los que pagaste.",
    switchToValueRate: "Cambiar a valor + tasa",
    switchToExact: "Cambiar a monto exacto",
    eligibleWindow: "Ventana elegible: ",
    dutyPaidLabel: "Derechos IEEPA pagados (USD)",
    baseValueLabel: "Valor base pagado (USD)",
    rateLabel: "Tasa IEEPA pagada (%)",
    liquidatedLabel: "Entrada liquidada definitivamente",
    phAmount: "p. ej. 48000",
    phValue: "p. ej. 1200000",
    phRate: "p. ej. 10",
    exposureTitle: "Exposición reembolsable estimada",
    deadlineWord: "Fecha límite: ",
    note: "Las entradas no liquidadas se procesan automáticamente a través de CAPE. Las entradas liquidadas definitivamente requieren una protesta; aplican las fechas límite por categoría indicadas arriba. CBP exige inscripción en ACH para pagar los reembolsos; si no estás inscrito en ACH, hazlo antes de que aprueben tu reembolso.",
    notCoveredTitle: "Lo que esta estimación no cubre",
    notCovered: [
      "Los aranceles de la Sección 232 de acero y aluminio (50%) no se vieron afectados por la sentencia y no son reembolsables mediante este proceso.",
      "Los aranceles de la Sección 301 y las órdenes de AD/CVD también siguen vigentes: no los incluyas arriba.",
      "Los aranceles de la Sección 338 (50% sobre ciertos bienes canadienses, desde agosto de 2026) son un régimen aparte y no forman parte de los reembolsos IEEPA.",
      "El tratamiento de intereses sobre los reembolsos sigue sin resolverse; considera cualquier interés como excluido de esta estimación.",
      "Esto es una estimación para planeación, no asesoría legal ni una presentación formal. Los montos por entrada, las fechas de liquidación y las protestas son donde está el trabajo real.",
    ],
    helpTitle: "¿Quieres ayuda para dimensionar o armar un reclamo de reembolso?",
    helpBody:
      "OrigynLX puede ayudarte a organizar los datos de derechos por entrada para una revisión de recuperación, o referirte con un agente aduanal licenciado que presenta protestas.",
    talkCta: "Escríbenos →",
  },
};

export default function RefundEstimator({ locale = "en" }: { locale?: "en" | "es" }) {
  const T = COPY[locale];
  const categories = CATEGORIES[locale];
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
      return { category: categories[i], amount, liquidated: r.liquidated };
    });
  }, [rows]);

  const total = totals.reduce((n: number, t) => n + t.amount, 0);
  const hasInput = total > 0 || rows.some((r) => Number(r.dutyPaid) > 0 || Number(r.baseValue) > 0);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-medium text-paper">{T.whatHappened}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
          {T.whatHappenedBody}
        </p>
      </div>

      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-medium text-paper">{T.estimateTitle}</p>
        <p className="mt-1 text-[12px] text-paper/45">{T.estimateHint}</p>

        <div className="mt-5 space-y-5">
          {categories.map((c, i) => (
            <div key={c.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-medium text-paper/85">{c.label}</p>
                <button
                  onClick={() => updateRow(i, { amountMode: !rows[i].amountMode })}
                  className="text-[12px] font-medium text-seal hover:text-seal/80 transition-colors"
                >
                  {rows[i].amountMode ? T.switchToValueRate : T.switchToExact}
                </button>
              </div>
              <p className="mt-1 text-[12px] text-paper/40">{T.eligibleWindow}{c.window}.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {rows[i].amountMode ? (
                  <div className="sm:col-span-2">
                    <label className="text-[12px] text-paper/45">{T.dutyPaidLabel}</label>
                    <input
                      type="number"
                      min={0}
                      value={rows[i].dutyPaid}
                      onChange={(e) => updateRow(i, { dutyPaid: e.target.value })}
                      placeholder={T.phAmount}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-[12px] text-paper/45">{T.baseValueLabel}</label>
                      <input
                        type="number"
                        min={0}
                        value={rows[i].baseValue}
                        onChange={(e) => updateRow(i, { baseValue: e.target.value })}
                        placeholder={T.phValue}
                        className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-paper outline-none focus:border-seal/60"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-paper/45">{T.rateLabel}</label>
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={rows[i].ratePercent}
                        onChange={(e) => updateRow(i, { ratePercent: e.target.value })}
                        placeholder={T.phRate}
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
                    {T.liquidatedLabel}
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
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-seal">{T.exposureTitle}</p>
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
                  {T.deadlineWord + t.category.deadline}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-paper/55">
            {T.note}
          </p>
        </div>
      )}

      <div className="rounded-card border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-medium text-paper">{T.notCoveredTitle}</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-paper/60">
          {T.notCovered.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-seal/30 bg-seal/[0.06] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-paper">{T.helpTitle}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-paper/60">
            {T.helpBody}
          </p>
        </div>
        <a href={locale === "es" ? "/es/contact" : "/contact"} className="whitespace-nowrap rounded-full bg-seal px-5 py-2 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors">{T.talkCta}</a>
      </div>
    </div>
  );
}
