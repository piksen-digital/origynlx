import Link from "next/link";
import Logo from "./Logo";

const COPY = {
  en: {
    blurb:
      "OrigynLX provides an estimate of USMCA origin qualification for internal use. It is a pre-screening and document-preparation tool, not legal advice and not a certification service. The importer, exporter, or producer remains responsible for verifying and signing the final Certificate of Origin.",
    product: "Product",
    calculator: "Calculator",
    pricing: "Pricing",
    contact: "Contact",
    legal: "Legal",
    disclaimer: "Disclaimer",
    terms: "Terms",
    rights: "All rights reserved.",
    infoOnly: "For informational use only. Not legal advice.",
    hrefs: { calculator: "/calculator", pricing: "/pricing", contact: "/contact", disclaimer: "/legal/disclaimer", terms: "/legal/terms" },
  },
  es: {
    blurb:
      "OrigynLX ofrece una estimación de calificación de origen bajo el T-MEC para uso interno. Es una herramienta de preselección y preparación de documentos, no asesoría legal ni un servicio de certificación. El importador, exportador o productor sigue siendo responsable de verificar y firmar el Certificado de Origen final.",
    product: "Producto",
    calculator: "Calculadora",
    pricing: "Precios",
    contact: "Contacto",
    legal: "Legal",
    disclaimer: "Aviso legal",
    terms: "Términos",
    rights: "Todos los derechos reservados.",
    infoOnly: "Solo para uso informativo. No es asesoría legal.",
    hrefs: { calculator: "/calculator", pricing: "/pricing", contact: "/contact", disclaimer: "/legal/disclaimer", terms: "/legal/terms" },
  },
};

export default function Footer({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  return (
    <footer className="relative border-t border-white/12 bg-ink py-16 lg:py-20">
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-paper/50">{t.blurb}</p>
          </div>

          <div className="lg:col-span-3">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/45">{t.product}</span>
            <ul className="mt-4 space-y-2.5">
              <li><Link href={t.hrefs.calculator} className="text-sm text-paper/70 hover:text-paper transition-colors">{t.calculator}</Link></li>
              <li><Link href={t.hrefs.pricing} className="text-sm text-paper/70 hover:text-paper transition-colors">{t.pricing}</Link></li>
              <li><Link href={t.hrefs.contact} className="text-sm text-paper/70 hover:text-paper transition-colors">{t.contact}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/45">{t.legal}</span>
            <ul className="mt-4 space-y-2.5">
              <li><Link href={t.hrefs.disclaimer} className="text-sm text-paper/70 hover:text-paper transition-colors">{t.disclaimer}</Link></li>
              <li><Link href={t.hrefs.terms} className="text-sm text-paper/70 hover:text-paper transition-colors">{t.terms}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-[13px] text-paper/40">© {new Date().getFullYear()} OrigynLX. {t.rights}</p>
          <p className="text-[13px] text-paper/40">{t.infoOnly}</p>
        </div>
      </div>
    </footer>
  );
}
