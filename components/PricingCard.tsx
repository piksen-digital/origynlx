"use client";

import { useState } from "react";

const PRICE_USD = 149;

const COPY = {
  en: {
    label: "Annual license",
    perYear: "/ year",
    blurb:
      "One qualifying product line, unlimited checks, unlimited certificates, for 12 months. Re-run whenever your sourcing changes - the rules don't stay still, so neither should you.",
    features: [
      "Unlimited RVC calculations",
      "Unlimited draft certificates of origin",
      "Transaction-value and net-cost methods",
      "License valid across your devices",
    ],
    emailLabel: "Email for your license key",
    emailPlaceholder: "you@company.com",
    emailError: "Enter an email so we can send your license key.",
    genericError: "Could not start checkout.",
    wentWrong: "Something went wrong starting checkout.",
    buyDefault: (p: number) => `Buy license — $${p}`,
    buyLoading: "Starting checkout…",
    disclaimer: "Payment processed by Pesepay. You'll be redirected to their secure checkout.",
  },
  es: {
    label: "Licencia anual",
    perYear: "/ año",
    blurb:
      "Una línea de producto calificada, verificaciones ilimitadas, certificados ilimitados, por 12 meses. Vuelve a calcular cuando cambie tu abastecimiento - las reglas no se quedan quietas, así que tú tampoco deberías.",
    features: [
      "Cálculos de RVC ilimitados",
      "Certificados de origen (borrador) ilimitados",
      "Métodos de valor de transacción y costo neto",
      "Licencia válida en todos tus dispositivos",
    ],
    emailLabel: "Correo para tu clave de licencia",
    emailPlaceholder: "tu@empresa.com",
    emailError: "Ingresa un correo para enviarte tu clave de licencia.",
    genericError: "No se pudo iniciar el pago.",
    wentWrong: "Algo salió mal al iniciar el pago.",
    buyDefault: (p: number) => `Comprar licencia — $${p}`,
    buyLoading: "Iniciando pago…",
    disclaimer: "Pago procesado por Pesepay. Serás redirigido a su pago seguro.",
  },
};

export default function PricingCard({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleBuy() {
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError(t.emailError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data?.redirectUrl) {
        throw new Error(data?.error || t.genericError);
      }
      window.location.href = data.redirectUrl;
    } catch (e: any) {
      setError(e.message || t.wentWrong);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card border border-white/12 bg-white/[0.03] p-8 sm:p-10">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">{t.label}</span>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold text-paper">${PRICE_USD}</span>
        <span className="text-paper/50">{t.perYear}</span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-paper/60">{t.blurb}</p>

      <ul className="mt-6 space-y-2.5 text-[14px] text-paper/70">
        {t.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="mt-8">
        <label htmlFor="checkout-email" className="text-[13px] font-medium text-paper/60">
          {t.emailLabel}
        </label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
        />
        {error && <p className="mt-2 text-[13px] text-fail">{error}</p>}
        <button
          onClick={handleBuy}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-seal text-ink text-sm font-semibold h-12 hover:bg-seal/90 transition-colors disabled:opacity-60"
        >
          {loading ? t.buyLoading : t.buyDefault(PRICE_USD)}
        </button>
        <p className="mt-3 text-[12px] leading-relaxed text-paper/40">{t.disclaimer}</p>
      </div>
    </div>
  );
}
