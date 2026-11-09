"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { getStoredLicenseKey, hasFreeChecksLeft, tryRestoreLicense } from "@/lib/trial";

const COPY = {
  en: {
    links: [
      { href: "/calculator", label: "Calculator" },
      { href: "/pricing", label: "Pricing" },
      { href: "/batch", label: "Batch" },
      { href: "/vault", label: "Vault" },
      { href: "/refund", label: "Refunds" },
      { href: "/contact", label: "Contact" },
    ],
    ctaDefault: { label: "Start free trial", href: "/calculator" },
    ctaOpen: { label: "Open calculator", href: "/calculator" },
    ctaUpgrade: { label: "Upgrade", href: "/pricing" },
    langSwitch: { label: "ES" },
  },
  es: {
    links: [
      { href: "/es/calculator", label: "Calculadora" },
      { href: "/es/pricing", label: "Precios" },
      { href: "/es/batch", label: "Lote" },
      { href: "/es/vault", label: "Bóveda" },
      { href: "/es/refund", label: "Reembolsos" },
      { href: "/es/contact", label: "Contacto" },
    ],
    ctaDefault: { label: "Prueba gratis", href: "/es/calculator" },
    ctaOpen: { label: "Abrir calculadora", href: "/es/calculator" },
    ctaUpgrade: { label: "Mejorar plan", href: "/es/pricing" },
    langSwitch: { label: "EN" },
  },
};

const LOCALE_PATH_MAP: Record<string, string> = {
  "/": "/es",
  "/calculator": "/es/calculator",
  "/batch": "/es/batch",
  "/vault": "/es/vault",
  "/pricing": "/es/pricing",
  "/contact": "/es/contact",
  "/refund": "/es/refund",
  "/guides/how-to-qualify-a-product-for-usmca": "/es/guides/como-calificar-un-producto-para-el-usmca",
  "/legal/disclaimer": "/es/legal/disclaimer",
  "/legal/terms": "/es/legal/terms",
};

function langSwitchHref(locale: "en" | "es", pathname: string): string {
  if (locale === "en") return LOCALE_PATH_MAP[pathname] ?? "/es";
  const twin = Object.entries(LOCALE_PATH_MAP).find(([, esPath]) => esPath === pathname);
  return twin ? twin[0] : "/";
}

export default function Nav({ locale = "en" }: { locale?: "en" | "es" }) {
  const [open, setOpen] = useState(false);
  const t = COPY[locale];
  const pathname = usePathname() || "/";
  const langHref = langSwitchHref(locale, pathname);
  const [cta, setCta] = useState(t.ctaDefault);

  useEffect(() => {
    let cancelled = false;
    if (getStoredLicenseKey()) {
      setCta(t.ctaOpen);
      return;
    }
    tryRestoreLicense().then((restored: boolean) => {
      if (cancelled) return;
      if (restored) {
        setCta(t.ctaOpen);
      } else if (!hasFreeChecksLeft()) {
        setCta(t.ctaUpgrade);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <header className="fixed z-50 top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4">
      <nav className="mx-auto bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-lg max-w-[1400px]">
        <div className="flex items-center justify-between px-5 sm:px-6 lg:px-8 h-14 sm:h-16">
          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {t.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-paper/70 hover:text-paper transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={langHref}
              className="text-sm font-medium text-paper/50 hover:text-paper transition-colors"
            >
              {t.langSwitch.label}
            </Link>
            <Link
              href={cta.href}
              className="text-sm font-semibold text-ink transition-all duration-300 px-5 py-2 rounded-full bg-seal hover:bg-seal/90"
            >
              {cta.label}
            </Link>
          </div>

          <button
            className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`w-5 h-px bg-paper transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`w-5 h-px bg-paper transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`w-5 h-px bg-paper transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="lg:hidden flex flex-col gap-1 px-5 pb-5 pt-1">
            {t.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-paper/80 hover:text-paper transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={langHref}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-paper/60 hover:text-paper transition-colors"
            >
              {t.langSwitch.label === "ES" ? "Español" : "English"}
            </Link>
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 text-center text-sm font-semibold text-ink px-5 py-2.5 rounded-full bg-seal"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
