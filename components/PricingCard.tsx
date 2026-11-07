"use client";

import { useEffect, useState } from "react";
import PayPalButtons from "./PayPalButtons";
import { storeLicenseKey } from "@/lib/trial";

interface PaypalConfig {
  enabled: boolean;
  clientId: string | null;
  priceUsd: number;
  mode: string;
}

const COPY = {
  en: {
    label: "Annual license",
    perYear: "/ year",
    blurb:
      "One flat fee, twelve months: unlimited checks, unlimited certificates, batch qualification across your catalog, and broker-ready review packages.",
    features: [
      "Unlimited RVC calculations",
      "Unlimited draft certificates of origin",
      "Batch CSV qualification across your catalog",
      "Broker-ready review package (PDF)",
      "Transaction-value and net-cost methods",
      "License valid across your devices",
    ],
    emailLabel: "Email for your license key",
    emailPlaceholder: "you@company.com",
    emailHint: "Enter your email to continue.",
    emailError: "Enter an email so we can send your license key.",
    loadingConfig: "Loading checkout...",
    paypalNote: "Payments are processed securely by PayPal. OrigynLX never sees or stores your card details.",
    sandboxNote: "PayPal is in sandbox mode - test payments only.",
    successTitle: "License activated",
    successBody: "Your license key (also sent by email):",
    successCta: "Open the calculator",
    invoiceTitle: "Prefer an invoice?",
    invoiceBody:
      "Contact us for direct deposit or a PayPal invoice and we will set up your license manually.",
    invoiceCta: "Contact us",
  },
  es: {
    label: "Licencia anual",
    perYear: "/ año",
    blurb:
      "Un pago único, doce meses: verificaciones ilimitadas, certificados ilimitados, calificación por lotes de todo tu catálogo y paquetes de revisión para agente aduanal.",
    features: [
      "Cálculos de RVC ilimitados",
      "Certificados de origen (borrador) ilimitados",
      "Calificación por lotes CSV de tu catálogo",
      "Paquete de revisión para agente aduanal (PDF)",
      "Métodos de valor de transacción y costo neto",
      "Licencia válida en todos tus dispositivos",
    ],
    emailLabel: "Correo para tu clave de licencia",
    emailPlaceholder: "tu@empresa.com",
    emailHint: "Ingresa tu correo para continuar.",
    emailError: "Ingresa un correo para enviarte tu clave de licencia.",
    loadingConfig: "Cargando el pago...",
    paypalNote: "Los pagos son procesados de forma segura por PayPal. OrigynLX nunca ve ni almacena los datos de tu tarjeta.",
    sandboxNote: "PayPal está en modo de pruebas - solo pagos de prueba.",
    successTitle: "Licencia activada",
    successBody: "Tu clave de licencia (también enviada por correo):",
    successCta: "Abrir la calculadora",
    invoiceTitle: "¿Prefieres una factura?",
    invoiceBody:
      "Escríbenos para depósito directo o factura PayPal y configuramos tu licencia manualmente.",
    invoiceCta: "Contáctanos",
  },
};

export default function PricingCard({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  const [config, setConfig] = useState<PaypalConfig | null>(null);
  const [email, setEmail] = useState("");
  const [payError, setPayError] = useState<string | null>(null);
  const [purchasedKey, setPurchasedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/paypal/config")
      .then((r) => r.json())
      .then((d: PaypalConfig) => setConfig(d))
      .catch(() => setConfig({ enabled: false, clientId: null, priceUsd: 149, mode: "live" }));
  }, []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const price = config?.priceUsd ?? 149;

  if (purchasedKey) {
    return (
      <div className="rounded-card border border-pass/30 bg-pass/[0.06] p-8 sm:p-10">
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-pass">{t.successTitle}</span>
        <p className="mt-4 text-[15px] leading-relaxed text-paper/70">{t.successBody}</p>
        <p className="mt-3 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 font-mono text-lg text-paper">
          {purchasedKey}
        </p>
        <a
          href="/calculator"
          className="mt-5 inline-flex rounded-full bg-seal px-6 py-2.5 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors"
        >
          {t.successCta}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-white/12 bg-white/[0.03] p-8 sm:p-10">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">{t.label}</span>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold text-paper">{"$" + price}</span>
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
        {!emailValid && <p className="mt-2 text-[13px] text-paper/50">{t.emailHint}</p>}
        {payError && <p className="mt-2 text-[13px] text-fail">{payError}</p>}

        {config === null && <p className="mt-4 text-[13px] text-paper/50">{t.loadingConfig}</p>}

        {config !== null && !config.enabled && (
          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[14px] font-medium text-paper/75">{t.invoiceTitle}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-paper/55">{t.invoiceBody}</p>
            <a
              href="/contact"
              className="mt-3 inline-flex rounded-full border border-seal/40 px-5 py-2 text-sm font-medium text-seal hover:bg-seal/10 transition-colors"
            >
              {t.invoiceCta}
            </a>
          </div>
        )}

        {config !== null && config.enabled && config.clientId && (
          <div className="mt-4">
            {emailValid && (
              <div>
                {config.mode !== "live" && (
                  <p className="mb-2 text-[12px] text-paper/40">{t.sandboxNote}</p>
                )}
                <PayPalButtons
                  clientId={config.clientId}
                  email={email.trim()}
                  emailValid={emailValid}
                  mode={config.mode}
                  onSuccess={(key: string) => {
                    storeLicenseKey(key);
                    setPurchasedKey(key);
                  }}
                  onError={(message: string) => setPayError(message)}
                />
              </div>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-paper/40">{t.paypalNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
