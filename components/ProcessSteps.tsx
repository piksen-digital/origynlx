const COPY = {
  en: {
    eyebrow: "How it works",
    h2: "From BOM to broker-ready in four steps.",
    blurb:
      "The same math a broker runs by hand, at catalog scale, with sourced rules and honest flags instead of black-box answers.",
    steps: [
      {
        n: "01",
        title: "Build your bill of materials",
        body: "Type components by hand or import the CSV template: HS codes, values, origin status, everything the rule needs. Fill it in Excel or Google Sheets, upload it, done.",
      },
      {
        n: "02",
        title: "The engine picks your rule",
        body: "OrigynLX looks up the product-specific rule of origin for your HS code and shows which method and threshold apply: transaction value, net cost, or de minimis, with the standard 60% test as fallback and every threshold sourced.",
      },
      {
        n: "03",
        title: "Get a verdict with receipts",
        body: "A clear pass or fail against the threshold, with the margin to spare, Section 232 steel and aluminum flags, and a needs-review marker whenever the data does not support a clean answer. No silent guesses.",
      },
      {
        n: "04",
        title: "Export and file",
        body: "Draft Certificate of Origin, audit worksheet, and broker package PDFs for one product, or a color-coded Excel matrix for your entire catalog. Review, sign, and ship.",
      },
    ],
  },
  es: {
    eyebrow: "Cómo funciona",
    h2: "De la lista de materiales a listo para el agente aduanal en cuatro pasos.",
    blurb:
      "La misma matemática que un agente aduanal hace a mano, a escala de catálogo, con reglas con fuente y alertas honestas en lugar de respuestas de caja negra.",
    steps: [
      {
        n: "01",
        title: "Construye tu lista de materiales",
        body: "Captura los componentes a mano o importa la plantilla CSV: códigos HS, valores, estado de origen, todo lo que la regla necesita. Llénala en Excel o Google Sheets, súbela, listo.",
      },
      {
        n: "02",
        title: "El motor elige tu regla",
        body: "OrigynLX busca la regla de origen específica por producto para tu código HS y muestra qué método y umbral aplican: valor de transacción, costo neto o minimis, con la prueba estándar del 60% como respaldo y cada umbral con fuente.",
      },
      {
        n: "03",
        title: "Obtén un veredicto con recibos",
        body: "Un aprobado o reprobado claro frente al umbral, con el margen de sobra, alertas de acero y aluminio de la Sección 232, y una marca de requiere revisión cada vez que los datos no sostienen una respuesta limpia. Sin adivinanzas silenciosas.",
      },
      {
        n: "04",
        title: "Exporta y presenta",
        body: "Certificado de Origen en borrador, hoja de trabajo de auditoría y paquetes PDF para el agente aduanal de un solo producto, o una matriz de Excel codificada por colores para todo tu catálogo. Revisa, firma y embarca.",
      },
    ],
  },
};

export default function ProcessSteps({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  return (
    <section id="how-it-works" className="relative border-t border-white/12 bg-ink py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
        <div className="mb-14 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">{t.eyebrow}</span>
            <h2 className="mt-6 text-balance font-display text-[10vw] font-semibold leading-[0.95] tracking-tight text-paper sm:text-5xl md:text-6xl">
              {t.h2}
            </h2>
          </div>
          <div className="mt-6 lg:col-span-5 lg:mt-2 lg:self-end">
            <p className="max-w-md text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              {t.blurb}
            </p>
          </div>
        </div>

        <div className="border-t border-white/12">
          {t.steps.map((s) => (
            <div key={s.n} className="grid gap-4 border-b border-white/12 py-10 sm:py-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-2">
                <span className="font-display text-4xl italic leading-none text-paper/35 sm:text-5xl">{s.n}</span>
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-display text-xl leading-tight text-paper sm:text-2xl">{s.title}</h3>
              </div>
              <div className="lg:col-span-6">
                <p className="text-[15px] leading-relaxed text-paper/60 sm:text-base">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
