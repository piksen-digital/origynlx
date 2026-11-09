import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProcessSteps from "@/components/ProcessSteps";
import PositioningSection from "@/components/PositioningSection";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Verificador de origen T-MEC y calculadora de RVC | OrigynLX",
  description:
    "Verifica si tu producto califica para el tratamiento preferencial del T-MEC con una calculadora de RVC gratis: reglas de origen específicas por código HS, métodos de valor de transacción y costo neto, minimis, revisión de catálogos por lotes y certificados de origen en borrador. 25 verificaciones gratis al mes, sin registro.",
  keywords: [
    "verificador de origen T-MEC",
    "reglas de origen T-MEC",
    "calculadora RVC",
    "calculadora de contenido de valor regional",
    "cómo calificar un producto para el T-MEC",
    "certificado de origen T-MEC",
    "cómo llenar certificado de origen T-MEC",
    "tratamiento preferencial T-MEC",
    "USMCA reglas de origen",
  ],
  alternates: { canonical: "/es", languages: { "en": "/", "es": "/es", "x-default": "/" } },
  openGraph: {
    title: "Verificador de origen T-MEC y calculadora de RVC | OrigynLX",
    description:
      "Evalúa tu lista de materiales contra la regla de origen exacta del T-MEC para tu código HS. Certificados en borrador, hojas de auditoría, revisión por lotes. 25 verificaciones gratis al mes, sin registro.",
  },
};

const STAKES: { title: string; body: string }[] = [
  {
    title: "Derechos IEEPA por fentanilo",
    body: "Desde el 7 de marzo de 2025, los derechos IEEPA relacionados con fentanilo sobre importaciones canadienses y mexicanas aplican solo a bienes que no califican como originarios del T-MEC. Una determinación de origen defendible exime a tus bienes.",
  },
  {
    title: "Exposición a la Sección 232",
    body: "Los tornillos de acero bajo el SA 7318 y los bienes de aluminio bajo el SA 7616 cargan exposición aparte a medidas de remedio comercial. OrigynLX marca estos códigos dentro de tu lista de materiales automáticamente, antes de que tu agente aduanal los encuentre en la entrada.",
  },
  {
    title: "Riesgo de sanciones",
    body: "Reclamar la preferencia sin matemática defendible arriesga sanciones y demandas retroactivas de derechos bajo 19 U.S.C. 1592, a veces años después de la entrada. Una pista de auditoría siempre le gana a una suposición.",
  },
  {
    title: "La economía del agente aduanal",
    body: "Un agente aduanal hace este cálculo a mano, por producto, por lista de materiales, y cobra por ello. OrigynLX es una tarifa plana: 19 USD por treinta días o 149 USD por un año, ambos con verificaciones y certificados ilimitados.",
  },
];

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Motor de reglas con fuente",
    body: "Reglas de origen específicas por producto buscadas por código HS, con la prueba estándar del 60% como respaldo, manejo de minimis, y ambos métodos de valor de transacción y costo neto. Cada umbral cita su fuente.",
  },
  {
    title: "Importación CSV de lista de materiales",
    body: "Descarga la plantilla, llénala en Excel o Google Sheets, súbela, y la calculadora construye la lista de materiales por ti. O captura los componentes a mano.",
  },
  {
    title: "Aprueba o falla, con margen",
    body: "Ve tu RVC frente al umbral y exactamente cuánta holgura ganaría o costaría un cambio de abastecimiento. Haz tu ingeniería de origen antes de comprometerte con un proveedor.",
  },
  {
    title: "Cálculo de ahorro de arancel",
    body: "Cuantifica cuánto vale la reclamación de preferencia por producto frente a las tasas NMF estándar, para que el argumento de calificar llegue con un signo de dólar adjunto.",
  },
  {
    title: "Certificado de Origen en borrador",
    body: "Los nueve elementos de datos requeridos por CBP, prellenados desde tu lista de materiales y formateados para tu revisión y firma.",
  },
  {
    title: "Hoja de trabajo de auditoría",
    body: "La pista de cálculo completa en un PDF: regla elegida, umbral aplicado, valores de componentes y la matemática detrás del resultado.",
  },
  {
    title: "Paquete para agente aduanal",
    body: "Un conjunto de PDFs listo para revisión de tu agente aduanal: resumen del resultado, hoja de trabajo y certificado en borrador en un solo paquete.",
  },
  {
    title: "Calificación por lotes",
    body: "Sube un CSV de catálogo y obtén una matriz codificada por colores de califica, no califica o requiere revisión para cada SKU. La vista previa es gratis; los usuarios con licencia exportan Excel o CSV con formato.",
  },
  {
    title: "Alertas de remedios comerciales",
    body: "Exposición a acero y aluminio de la Sección 232 marcada por línea de componente, para que las sorpresas de remedios nunca lleguen a la frontera.",
  },
  {
    title: "Bóveda de determinaciones",
    body: "Guarda cada determinación con seguimiento del período general y recordatorios de renovación, para que los certificados nunca caduquen en silencio.",
  },
  {
    title: "Vigilancia de reglas",
    body: "Monitoreo de cambios en reglas, métodos y umbrales del T-MEC con alertas, para que tu próximo embarque nunca dependa de un reglamento desactualizado.",
  },
  {
    title: "Licencia sin cuenta",
    body: "Tu clave de licencia es tu cuenta. El navegador la recuerda, una cookie segura la restaura sin que lo notes, y un enlace único por correo la mueve a un dispositivo nuevo.",
  },
];

const WHO: { title: string; body: string }[] = [
  {
    title: "Exportadores y productores",
    body: "Haz el cálculo antes de certificar, no después de que aduanas pregunte. Repítelo cada vez que un proveedor o un precio cambie.",
  },
  {
    title: "Importadores",
    body: "Verifica que un certificado de proveedor sea aritméticamente defendible antes de reclamar la preferencia en tu entrada.",
  },
  {
    title: "Agentes aduanales y consultores",
    body: "Revisa catálogos completos de clientes en una sola corrida por lotes en lugar de una hoja de cálculo a la vez.",
  },
  {
    title: "Equipos de abastecimiento",
    body: "Ve qué cambio de proveedor saca a un producto de la calificación antes de firmar el contrato.",
  },
];

const UNLOCKS: string[] = [
  "Verificaciones de RVC ilimitadas en ambos métodos",
  "Certificados de Origen en borrador ilimitados",
  "Calificación por lotes con exportación a Excel con formato",
  "Hojas de trabajo de auditoría y paquetes para agente aduanal",
  "Bóveda de determinaciones con recordatorios de renovación",
  "Vigilancia de cambios de reglas y alertas de remedios comerciales",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Qué revisa OrigynLX exactamente?",
    a: "Ejecuta tu lista de materiales contra la regla de origen del T-MEC que gobierna tu código HS: normalmente una prueba de Contenido de Valor Regional bajo el método de valor de transacción o de costo neto, con manejo de minimis y umbrales específicos por producto. El acuerdo se conoce como USMCA en Estados Unidos, CUSMA en Canadá y T-MEC en México; las reglas son las mismas. Obtienes un resultado de califica, no califica o requiere revisión con la pista de cálculo completa.",
  },
  {
    q: "¿Cómo funciona el nivel gratis?",
    a: "Veinticinco verificaciones de producto cada mes calendario, gratis, sin registro y sin tarjeta, y el contador se reinicia el primero de cada mes. Una licencia desbloquea verificaciones ilimitadas, certificados ilimitados, calificación por lotes, exportación a Excel, la bóveda y la vigilancia de reglas: 19 USD por 30 días o 149 USD por doce meses.",
  },
  {
    q: "¿Cuál es la diferencia entre el pase mensual y la licencia anual?",
    a: "El acceso es idéntico: verificaciones ilimitadas, certificados ilimitados, calificación por lotes, la bóveda y la vigilancia de reglas. El pase mensual son 19 USD por 30 días y no se renueva automáticamente; compras otro mes cuando lo necesites. La licencia anual son 149 USD por doce meses, unos 12 USD al mes, la mejor opción si embarcas todo el año.",
  },
  {
    q: "¿Necesito crear una cuenta?",
    a: "No. Tu clave de licencia es tu cuenta. El navegador la recuerda, una cookie segura la restaura automáticamente si pierdes tu sesión, y un enlace único por correo la mueve a un dispositivo nuevo. Sin contraseñas, sin perfil, sin correos de restablecimiento.",
  },
  {
    q: "¿El resultado es una certificación legal?",
    a: "No. OrigynLX es una herramienta de preselección y preparación de documentos, no un servicio de certificación. El importador, exportador o productor es la parte certificadora y sigue siendo legalmente responsable de la declaración de origen. La herramienta te da los números, el formato y la pista de auditoría; el juicio y la firma quedan contigo y con tu agente aduanal.",
  },
  {
    q: "¿Qué reglas usa el motor y de dónde vienen?",
    a: "Las reglas provienen del texto del acuerdo T-MEC, incluidas las reglas de origen específicas por producto según el código HS. Cuando más de una regla podría gobernar un producto, o el método de tu CSV difiere de la regla aplicable, el resultado se marca para revisión en lugar de adivinarse en silencio.",
  },
  {
    q: "¿Puede procesar todo mi catálogo a la vez?",
    a: "Sí. La herramienta de lotes toma un CSV de catálogo y devuelve una matriz codificada por colores de califica, no califica o requiere revisión para cada SKU, con hasta 5,000 filas por exportación. La vista previa de la matriz es gratis; los usuarios con licencia exportan resultados en Excel o CSV con formato.",
  },
  {
    q: "¿Qué documentos obtengo?",
    a: "Un Certificado de Origen en borrador con los nueve elementos de datos requeridos por CBP, una hoja de trabajo de auditoría con la pista de cálculo completa y un paquete de revisión listo para tu agente aduanal, todo en PDF, además de resultados en Excel o CSV con formato de las corridas por lotes.",
  },
  {
    q: "¿Marca la exposición a acero y aluminio de la Sección 232?",
    a: "Sí. Los componentes clasificados bajo el SA 7318 (tornillos de acero) y el SA 7616 (bienes de aluminio) se marcan automáticamente, para que tu agente aduanal vea la exposición a remedios antes de la entrada, no después.",
  },
  {
    q: "¿Para qué se usan mis datos?",
    a: "La calculadora de producto único hace su matemática en tu navegador. Los archivos de lotes se suben solo para procesar tu corrida, y los registros de la bóveda se guardan bajo tu clave de licencia para que puedas reabrirlos. Tus datos nunca se venden ni se comparten.",
  },
  {
    q: "¿Qué pasa cuando cambian las reglas?",
    a: "La vigilancia de reglas monitorea cambios en reglas, métodos y umbrales del T-MEC y te alerta. La bóveda sigue el vencimiento del período general con recordatorios de renovación, para que un certificado por expirar nunca te tome por sorpresa.",
  },
  {
    q: "¿Por qué existe la marca de requiere revisión?",
    a: "Porque una respuesta incorrecta con confianza es lo peor que una herramienta de cumplimiento puede producir. Cuando faltan datos, son ambiguos o la regla aplicable no está clara, OrigynLX marca la fila para revisión humana en lugar de adivinar. Las alertas honestas son la función, no una limitación.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OrigynLX",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web browser",
  description:
    "Herramienta de calificación de reglas de origen del T-MEC: calculadora de Contenido de Valor Regional, revisión de catálogos por lotes, Certificados de Origen en borrador, hojas de trabajo de auditoría y paquetes para agente aduanal. Nivel gratis: 25 verificaciones al mes, sin registro.",
  offers: [
      { "@type": "Offer", name: "Pase mensual", price: "19", priceCurrency: "USD" },
      { "@type": "Offer", name: "Licencia anual", price: "149", priceCurrency: "USD" },
    ],
};

export default function LandingEs() {
  return (
    <>
      <Nav locale="es" />
      <Hero locale="es" />

      <section id="why" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Por qué el origen decide tu costo puesto en destino</span>
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
              Una línea de tu lista de materiales es la diferencia entre 0% de arancel y pagar el doble.
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              Tu factura de aranceles ya no depende solo del arancel. Que tus bienes califiquen como
              originarios del T-MEC ahora decide si aplican los nuevos derechos IEEPA, los derechos de
              la Sección 232 y los aranceles NMF estándar, o si no aplica ninguno.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STAKES.map((s) => (
              <div key={s.title} className="rounded-card border border-white/12 bg-white/[0.03] p-6">
                <h3 className="font-display text-lg leading-tight text-paper">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/60">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[13px] leading-relaxed text-paper/45">
            ¿Ya pagaste derechos IEEPA sobre bienes que podrían haber calificado?{" "}
            <Link href="/es/refund" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
              Revisa el estimador de reembolsos
            </Link>{" "}
            para ver si un reembolso podría estar sobre la mesa.
          </p>
        </div>
      </section>

      <section id="features" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="mb-12 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-end">
            <div className="lg:col-span-7">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Qué hace OrigynLX</span>
              <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
                El flujo de calificación completo, en una sola herramienta.
              </h2>
            </div>
            <div className="mt-6 lg:col-span-5 lg:mt-0">
              <p className="max-w-md text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
                Desde la verificación de un solo producto hasta una matriz de catálogo de 5,000 filas,
                cada paso mantiene la misma promesa: reglas con fuente, matemática visible, alertas honestas.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="rounded-card border border-white/12 bg-white/[0.03] p-6">
                <div className="font-display text-sm italic text-seal/70">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-display text-lg leading-tight text-paper">{f.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/60">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper/55">
            <Link href="/es/calculator" className="hover:text-paper transition-colors">Calculadora de producto único</Link>
            <Link href="/es/batch" className="hover:text-paper transition-colors">Calificación por lotes</Link>
            <Link href="/es/vault" className="hover:text-paper transition-colors">Bóveda de determinaciones</Link>
            <Link href="/es/refund" className="hover:text-paper transition-colors">Estimador de reembolsos</Link>
          </div>
        </div>
      </section>

      <ProcessSteps locale="es" />

      <section id="who" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Para quién es</span>
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
              Hecho para quienes firman y embarcan.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((w) => (
              <div key={w.title} className="rounded-card border border-white/12 bg-white/[0.03] p-6">
                <h3 className="font-display text-lg leading-tight text-paper">{w.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/60">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PositioningSection locale="es" />

      <section id="faq" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Preguntas frecuentes</span>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                Preguntas del T-MEC, respondidas.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-paper/55">
                Respuestas directas sobre reglas, métodos, documentos, datos y precios. Para la guía
                completa, lee{" "}
                <Link href="/es/guides/como-calificar-un-producto-para-el-usmca" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
                  cómo calificar un producto para el tratamiento preferencial del T-MEC
                </Link>
                . ¿Falta algo?{" "}
                <Link href="/es/contact" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
                  Escríbenos
                </Link>
                .
              </p>
            </div>
            <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <div className="divide-y divide-white/12 border-t border-b border-white/12">
                {FAQS.map((f) => (
                  <details key={f.q} className="group py-5 sm:py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                      <span className="font-display text-[17px] leading-snug text-paper sm:text-lg">{f.q}</span>
                      <span className="shrink-0 font-display text-xl leading-none text-seal transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-paper/60">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Precios</span>
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
              Una tarifa plana. Doce meses de certeza.
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              Veinticinco verificaciones de producto son gratis cada mes, sin tarjeta y sin registro.
              Después, paga 19 USD por 30 días o 149 USD por un año; una licencia desbloquea el flujo
              completo para todo tu catálogo.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <PricingCard locale="es" />
            </div>
            <div className="rounded-card border border-white/12 bg-white/[0.03] p-8 lg:col-span-5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Una licencia desbloquea</span>
              <ul className="mt-5 space-y-3 text-[14px] text-paper/70">
                {UNLOCKS.map((u) => (
                  <li key={u} className="flex items-start gap-3">
                    <span className="mt-0.5 text-seal">✓</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] leading-relaxed text-paper/45">
                Tarifas planas, sin cargos por producto, sin mínimos de usuarios, sin renovación
                automática. Una licencia funciona en todos tus dispositivos: treinta días con el pase
                mensual, un año completo con la licencia anual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12 text-center">
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
            Sabe cuánto vale tu lista de materiales antes de tu próximo embarque.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
            Veinticinco verificaciones gratis cada mes. Sin tarjeta, sin cuenta, sin llamada de ventas.
            Sube una lista de materiales y ve un resultado de calificado o fallido en minutos.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/es/calculator" className="inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors">
              Haz 25 verificaciones gratis
            </Link>
            <Link href="/es/pricing" className="inline-flex items-center justify-center rounded-full border border-paper/20 text-paper text-sm font-medium px-8 h-12 hover:border-paper/40 hover:bg-white/[0.04] transition-colors">
              Ver precios
            </Link>
          </div>
        </div>
      </section>

      <Footer locale="es" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
