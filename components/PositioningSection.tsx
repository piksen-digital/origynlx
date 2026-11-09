const COPY = {
  en: {
    eyebrow: "What this is — and isn't",
    h2: "A pre-screener, not a certification service.",
    body: "OrigynLX does the arithmetic and formatting faster than doing it by hand — it does not practice customs law and it does not certify your goods. The Regional Value Content result and draft certificate are estimates for your internal use. The importer, exporter, or producer is the certifying party and remains legally responsible for the accuracy of any origin claim, and should review the final certificate — and consult a licensed customs broker for anything close to the threshold — before signing.",
    note1: "For informational use only. Not legal advice. See the ",
    link: "full disclaimer",
    note2: ".",
  },
  es: {
    eyebrow: "Qué es esto - y qué no es",
    h2: "Una preselección, no un servicio de certificación.",
    body: "OrigynLX hace la aritmética y el formato más rápido de lo que harías a mano; no ejerce el derecho aduanero ni certifica tus bienes. El resultado de Contenido de Valor Regional y el certificado en borrador son estimaciones para tu uso interno. El importador, exportador o productor es la parte certificadora y sigue siendo legalmente responsable de la exactitud de cualquier declaración de origen, y debe revisar el certificado final, y consultar a un agente aduanal con licencia en cualquier caso cercano al umbral, antes de firmar.",
    note1: "Solo para uso informativo. No es asesoría legal. Ver el ",
    link: "aviso legal completo",
    note2: ".",
  },
};

export default function PositioningSection({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  return (
    <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">{t.eyebrow}</span>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
              {t.h2}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-base leading-relaxed text-paper/70 sm:text-lg">
              {t.body}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-paper/45">
              {t.note1}{" "}
              <a href="/legal/disclaimer" className="underline hover:text-paper/70 transition-colors">
                {t.link}
              </a>
              {t.note2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
