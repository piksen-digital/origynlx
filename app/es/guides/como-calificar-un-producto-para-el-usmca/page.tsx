import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cómo calificar un producto para el tratamiento preferencial del T-MEC (guía 2026) | OrigynLX",
  description:
    "Guía paso a paso de calificación del T-MEC: clasifica el código HS, encuentra la regla de origen específica del producto, calcula el Contenido de Valor Regional con un ejemplo resuelto, revisa la regla de minimis y certifica con los nueve elementos de datos requeridos.",
  alternates: {
    canonical: "/es/guides/como-calificar-un-producto-para-el-usmca",
    languages: {
      "en": "/guides/how-to-qualify-a-product-for-usmca",
      "es": "/es/guides/como-calificar-un-producto-para-el-usmca",
    },
  },
  openGraph: {
    title: "Cómo calificar un producto para el tratamiento preferencial del T-MEC (guía 2026) | OrigynLX",
    description:
      "Clasifica, encuentra la regla, haz el cálculo de RVC, revisa el minimis y certifica. Un recorrido práctico con un ejemplo resuelto.",
    type: "article",
  },
};

type Block = string | { list: string[] };

const SECTIONS: { id: string; heading: string; blocks: Block[] }[] = [
  {
    id: "que-significa-tratamiento-preferencial",
    heading: "Qué significa tratamiento preferencial",
    blocks: [
      "El T-MEC (USMCA en inglés, CUSMA en Canadá) permite que las mercancías que cumplen sus reglas de origen crucen la frontera entre México, Estados Unidos y Canadá sin arancel o con arancel reducido. Ese beneficio se llama tratamiento arancelario preferencial. Las tres versiones del tratado aplican las mismas reglas; solo cambia el idioma del texto legal.",
      "Para reclamarlo, el importador debe demostrar que el producto califica como originario. Eso no depende de dónde se ensambló la caja final: depende del código arancelario del producto y de su regla de origen específica, que puede exigir un cambio de clasificación, un porcentaje mínimo de contenido regional, o ambos.",
      "Desde marzo de 2025, con los aranceles IEEPA recíprocos y de fentanilo activados, la brecha entre pagar la tasa Nación Más Favorecida y la tasa preferencial del T-MEC puede ser enorme para muchos productos. Calificar bien pasó de ser un ahorro cómodo a ser una ventaja operativa seria.",
    ],
  },
  {
    id: "paso-1-codigo-hs",
    heading: "Paso 1: clasifica el producto con un código HS",
    blocks: [
      "Todo empieza con el código arancelario. En Estados Unidos, el HTS de 10 dígitos a la importación o el Schedule B a la exportación. La regla de origen que te aplica es la del código de tu producto, así que un error de clasificación invalida todo lo demás.",
      "Usa la herramienta CROSS de la CBP o el HTS en línea para confirmar el código. Si tu producto puede caer en varias partidas, usa la que resista un examen: la función comercial real, los materiales predominantes y la regla general de interpretación que la sustenta.",
    ],
  },
  {
    id: "paso-2-regla",
    heading: "Paso 2: encuentra la regla de origen específica",
    blocks: [
      "Abre el anexo de reglas de origen específicas del producto del tratado y busca el código a 4, 6 u 8 dígitos. Verás algo como un cambio de clasificación a nivel de capítulo, partida o subpartida, o una regla de contenido de valor regional.",
      "Las reglas de cambio de clasificación exigen que los materiales no originarios cambien de partida arancelaria al transformarse en el producto final. Las reglas de RVC exigen que un porcentaje del valor del producto provenga de la región.",
      "Muchas reglas combinan ambas: un cambio de partida y además un umbral de contenido regional. Cuando no hay regla específica, aplica la reserva de 60 por ciento con el método de valor de transacción o 50 por ciento con el método de costo neto.",
    ],
  },
  {
    id: "paso-3-rvc",
    heading: "Paso 3: calcula el Contenido de Valor Regional",
    blocks: [
      "Si tu regla exige RVC, elige el método. El método de valor de transacción parte del precio pagado por el producto y usa la fórmula:",
      { list: ["RVC = ((TV - VNM) / TV) x 100"] },
      "donde TV es el valor de transacción del producto y VNM es el valor de los materiales no originarios. El método de costo neto parte del costo total del producto, excluye los conceptos no permitidos, y aplica la misma estructura de fórmula.",
      "Ejemplo resuelto: un producto con valor de transacción de 1000 USD que incorpora 350 USD de materiales no originarios tiene un RVC de ((1000 - 350) / 1000) x 100 = 65 por ciento. Si la regla pide 60, califica con margen; si pide 70, no califica por la vía del RVC.",
      "El margen importa. Un RVC de 61 contra un umbral de 60 es frágil: una subida del precio de un insumo importado o un ajuste en el valor de transacción puede voltear el resultado. Los importadores serios apuntan a un colchón de varios puntos porcentuales.",
    ],
  },
  {
    id: "paso-4-minimis",
    heading: "Paso 4: revisa la regla de minimis antes de rendirte",
    blocks: [
      "El artículo 4.12 permite que un producto califique aunque algunos materiales no originarios incumplan el cambio de clasificación, siempre que el valor de esos materiales no exceda el 10 por ciento del valor del producto y se cumplan los demás requisitos de la regla.",
      "Es una salida real para productos con componentes menores importados: tornillería, empaques, electrónica pequeña. Requiere documentar el valor de cada material no originario que falla el cambio de partida, así que solo es práctico si esos materiales son pocos y están bien registrados en tu lista de materiales.",
      "Esta área tiene matices legales según el producto y la regla aplicable; si tu caso depende del minimis para calificar, vale la pena confirmarlo con un agente aduanal o un abogado antes de certificar.",
    ],
  },
  {
    id: "paso-5-certificar",
    heading: "Paso 5: certifica y conserva los documentos",
    blocks: [
      "Desde julio de 2020 no existe un formulario oficial de certificado de origen: basta una declaración con los nueve elementos de datos obligatorios (certificador, exportador, productor, importador, descripción y código HS del bien, criterio de origen, período de cobertura, firma y fecha). Puede ser en papel o electrónica.",
      "El importador necesita el certificado en su poder al momento de hacer la reclamación, y el certificador debe tener pruebas de respaldo: la lista de materiales, el cálculo de RVC o el análisis de cambio de clasificación, y los costos. El tratado pide conservar todo por cinco años después de la importación, y el código 19 U.S.C. 1592 permite sanciones si se reclama preferencia sin fundamento.",
      "Puedes certificar una importación puntual, un período (certificación de período general) o varias importaciones identificadas. Los períodos de hasta 12 meses son el estándar para flujos repetitivos.",
    ],
  },
  {
    id: "revision-2026",
    heading: "La revisión conjunta de 2026",
    blocks: [
      "El T-MEC se revisa cada seis años, y la revisión conjunta abrió en julio de 2026. Los tres países confirmaron el marco general, pero quedan abiertas consultas sobre contenido regional en sectores específicos y sobre cómo se aplican ciertas reglas.",
      "Para la mayoría de los importadores el impacto inmediato es nulo: las reglas vigentes siguen siendo las del texto de 2020. Pero si compras o fabricas en sectores señalados en la revisión, monitorea los cambios, porque una regla nueva puede cambiar la calificación de productos que hoy califican.",
    ],
  },
  {
    id: "errores-comunes",
    heading: "Cinco errores comunes",
    blocks: [
      { list: [
        "Clasificar el producto a partir del nombre comercial y no de su función y composición.",
        "Aplicar la regla de un código de 4 dígitos cuando la regla vigente es la de 6 u 8.",
        "Calcular el RVC con el método de costo neto usando datos de valor de transacción, o al revés.",
        "Certificar sin lista de materiales de respaldo y sin el cálculo que sustenta el criterio declarado.",
        "Olvidar el período de cobertura: un certificado sin vigencia clara no protege importaciones futuras.",
      ] },
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cuánto cuesta calificar un producto?",
    a: "Depende del caso. Una regla de cambio de clasificación limpia se resuelve en una tarde; un RVC de costo neto con muchos insumos puede tardar días en armarse bien. OrigynLX hace la parte mecánica, encontrar la regla, calcular el RVC, revisar el minimis y armar el borrador del certificado, para que solo la interpretación requiera criterio humano.",
  },
  {
    q: "¿Necesito un certificado oficial?",
    a: "No existe un formato oficial desde 2020. Cualquier documento con los nueve elementos de datos requeridos funciona como certificado de origen. OrigynLX genera un borrador con esos elementos listo para firmar.",
  },
  {
    q: "¿Puedo calificar un producto con insumos chinos?",
    a: "Sí, si la transformación en la región cumple la regla de origen del producto. El origen de los insumos no descalifica por sí solo: los insumos no originarios cuentan en el VNM o deben cambiar de clasificación al fabricarse el producto.",
  },
  {
    q: "¿Qué pasa si la regla cambia en la revisión de 2026?",
    a: "Los cambios entran en vigor hasta que los tres países ratifiquen las modificaciones. Las certificaciones se evalúan con las reglas vigentes al momento de la importación, así que lo importante es conocer la fecha de entrada en vigor y recalificar a tiempo.",
  },
  {
    q: "¿Qué es el tratamiento preferencial?",
    a: "Es la tasa arancelaria reducida o exenta que un producto originario recibe al cruzar la frontera entre México, Estados Unidos o Canadá, en lugar de la tasa Nación Más Favorecida que pagaría un producto de cualquier otro país.",
  },
];

export default function ComoCalificarGuideEsPage() {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app";
  const canonical = SITE + "/es/guides/como-calificar-un-producto-para-el-usmca";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cómo calificar un producto para el tratamiento preferencial del T-MEC (guía 2026)",
    description:
      "Guía paso a paso de calificación del T-MEC: código HS, regla de origen específica, cálculo de RVC con ejemplo resuelto, minimis y certificación.",
    inLanguage: "es",
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "OrigynLX" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <article className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Guía</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Cómo calificar un producto para el tratamiento preferencial del T-MEC
            </h1>
            <p className="mt-4 text-base leading-relaxed text-paper/60 sm:text-lg">
              La calificación de origen se reduce a cinco pasos: clasificar el código, encontrar la regla,
              hacer el cálculo, revisar el minimis y certificar con respaldo documental. Esta guía recorre los
              cinco con un ejemplo resuelto de Contenido de Valor Regional.
            </p>

            <nav className="mt-8 rounded-card border border-white/12 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">En esta guía</p>
              <ul className="mt-3 space-y-1.5">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <Link href={"#" + s.id} className="text-sm text-seal hover:text-seal/80">
                      {s.heading}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-12 space-y-12">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id}>
                  <h2 className="font-display text-2xl font-semibold text-paper">{s.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {s.blocks.map((b, i) => (
                      <div key={i}>
                        {typeof b === "string" ? (
                          <p className="text-[15px] leading-relaxed text-paper/70">{b}</p>
                        ) : (
                          <ul className="space-y-2">
                            {b.list.map((item, j) => (
                              <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-paper/70">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-seal" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-16 rounded-card border border-seal/30 bg-seal/5 p-8">
              <h2 className="font-display text-2xl font-semibold text-paper">
                Haz la calificación en minutos, no en tardes enteras.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                OrigynLX encuentra la regla de tu código, calcula el RVC, revisa el minimis y arma el borrador
                del certificado. Veinticinco verificaciones gratis al mes, sin registro.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/calculator"
                  className="rounded-full bg-seal px-5 py-2.5 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors"
                >
                  Hacer una verificación gratis
                </Link>
                <Link
                  href="/es/pricing"
                  className="rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-paper hover:border-white/25 transition-colors"
                >
                  Ver precios
                </Link>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="font-display text-2xl font-semibold text-paper">Preguntas frecuentes</h2>
              <div className="mt-6 space-y-3">
                {FAQS.map((f) => (
                  <details key={f.q} className="group rounded-card border border-white/12 px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span className="text-[15px] font-medium text-paper">{f.q}</span>
                      <span className="text-lg font-light text-seal transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-paper/60">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
      <Footer locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}