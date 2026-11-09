"use client";

import { useEffect, useState } from "react";
import PayPalButtons from "./PayPalButtons";
import { storeLicenseKey } from "@/lib/trial";

interface PaypalConfig {
  enabled: boolean;
  clientId: string | null;
  priceUsd: number;
  monthlyPriceUsd: number;
  mode: string;
}

const COPY = {
  en: {
    toggleMonthly: "Monthly",
    toggleAnnual: "Annual",
    saveBadge: "Save 35%",
    monthlyLabel: "Monthly pass",
    monthlyPer: "/ 30 days",
    monthlyBlurb:
      "Thirty days of full access: unlimited checks, unlimited certificates, batch qualification, and broker-ready review packages. Does not auto-renew; buy another month whenever you need one.",
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
    resumeTitle: "Already paid?",
    resumeBody:
      "Enter the email you used at checkout and we will send a one-time resume link. No password, no account.",
    resumeCta: "Send resume link",
    resumeBusy: "Sending...",
    resumeFail: "Could not send a resume link.",
    resumeFailConn: "Could not send a resume link. Check your connection.",
    resumeSent:
      "If an active license exists for that email, a resume link is on its way. It expires in 30 minutes.",
  },
  es: {
    toggleMonthly: "Mensual",
    toggleAnnual: "Anual",
    saveBadge: "Ahorra 35%",
    monthlyLabel: "Pase mensual",
    monthlyPer: "/ 30 días",
    monthlyBlurb:
      "Treinta días de acceso completo: verificaciones ilimitadas, certificados ilimitados, calificación por lotes y paquetes de revisión para agente aduanal. No se renueva automáticamente; compra otro mes cuando lo necesites.",
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
    resumeTitle: "¿Ya pagaste?",
    resumeBody:
      "Ingresa el correo que usaste al pagar y te enviaremos un enlace único para retomar tu licencia. Sin contraseña, sin cuenta.",
    resumeCta: "Enviar enlace",
    resumeBusy: "Enviando...",
    resumeFail: "No se pudo enviar el enlace.",
    resumeFailConn: "No se pudo enviar el enlace. Revisa tu conexión.",
    resumeSent:
      "Si existe una licencia activa para ese correo, el enlace va en camino. Expira en 30 minutos.",
  },
};

export default function PricingCard({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  const [config, setConfig] = useState<PaypalConfig | null>(null);
  const [plan, setPlan] = useState<"annual" | "monthly">("annual");
  const [email, setEmail] = useState("");
  const [payError, setPayError] = useState<string | null>(null);
  const [purchasedKey, setPurchasedKey] = useState<string | null>(null);
  const [resumeEmail, setResumeEmail] = useState("");
  const [resumeSent, setResumeSent] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeBusy, setResumeBusy] = useState(false);

  useEffect(() => {
    fetch("/api/paypal/config")
      .then((r) => r.json())
      .then((d: PaypalConfig) => setConfig(d))
      .catch(() =>
      setConfig({ enabled: false, clientId: null, priceUsd: 149, monthlyPriceUsd: 19, mode: "live" })
    );
  }, []);

  async function handleResume() {
    setResumeError(null);
    setResumeSent(false);
    setResumeBusy(true);
    try {
      const res = await fetch("/api/license/resume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: resumeEmail.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResumeSent(true);
      } else {
        setResumeError(data.error || t.resumeFail);
      }
    } catch {
      setResumeError(t.resumeFailConn);
    } finally {
      setResumeBusy(false);
    }
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const price = plan === "monthly" ? (config?.monthlyPriceUsd ?? 19) : (config?.priceUsd ?? 149);

  if (purchasedKey) {
    return (
      <div className="rounded-card border border-pass/30 bg-pass/[0.06] p-8 sm:p-10">
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-pass">{t.successTitle}</span>
        <p className="mt-4 text-[15px] leading-relaxed text-paper/70">{t.successBody}</p>
        <p className="mt-3 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 font-mono text-lg text-paper">
          {purchasedKey}
        </p>
        <a
          href={locale === "es" ? "/es/calculator" : "/calculator"}
          className="mt-5 inline-flex rounded-full bg-seal px-6 py-2.5 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors"
        >
          {t.successCta}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-white/12 bg-white/[0.03] p-8 sm:p-10">
      <div className="inline-flex rounded-full border border-white/15 bg-white/[0.02] p-1">
        <button
          onClick={() => setPlan("monthly")}
          className={
            plan === "monthly"
              ? "rounded-full bg-seal px-4 py-1.5 text-[13px] font-semibold text-ink transition-colors"
              : "rounded-full px-4 py-1.5 text-[13px] font-medium text-paper/60 hover:text-paper transition-colors"
          }
        >
          {t.toggleMonthly}
        </button>
        <button
          onClick={() => setPlan("annual")}
          className={
            plan === "annual"
              ? "rounded-full bg-seal px-4 py-1.5 text-[13px] font-semibold text-ink transition-colors"
              : "rounded-full px-4 py-1.5 text-[13px] font-medium text-paper/60 hover:text-paper transition-colors"
          }
        >
          {t.toggleAnnual}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-5xl font-semibold text-paper">{"$" + price}</span>
        <span className="text-paper/50">{plan === "monthly" ? t.monthlyPer : t.perYear}</span>
        {plan === "annual" && (
          <span className="rounded-full border border-seal/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-seal">
            {t.saveBadge}
          </span>
        )}
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-paper/60">
        {plan === "monthly" ? t.monthlyBlurb : t.blurb}
      </p>

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
              href={locale === "es" ? "/es/contact" : "/contact"}
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
                  plan={plan}
                  locale={locale}
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

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <p className="text-[14px] font-medium text-paper/75">{t.resumeTitle}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-paper/55">{t.resumeBody}</p>
        {resumeSent ? (
          <p className="mt-3 text-[13px] text-seal">{t.resumeSent}</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={resumeEmail}
              onChange={(e) => setResumeEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
            />
            <button
              onClick={handleResume}
              disabled={resumeBusy || !resumeEmail.trim()}
              className="whitespace-nowrap rounded-full border border-seal/40 px-5 py-2 text-sm font-medium text-seal hover:bg-seal/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resumeBusy ? t.resumeBusy : t.resumeCta}
            </button>
          </div>
        )}
        {resumeError && <p className="mt-2 text-[13px] text-fail">{resumeError}</p>}
      </div>
    </div>
  );
}
