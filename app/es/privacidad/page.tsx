import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de privacidad | OrigynLX",
  description:
    "Cómo maneja OrigynLX tus datos: cálculos en tu navegador, sin cuentas, Google Analytics 4 con IP anonimizada, pagos con PayPal, y lo que nunca vendemos ni compartimos.",
  alternates: {
    canonical: "/es/privacidad",
    languages: { "en": "/privacy", "es": "/es/privacidad", "x-default": "/privacy" },
  },
};

export default function PrivacidadPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Legal</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Política de privacidad
            </h1>
            <p className="mt-6 text-[13px] text-paper/40">Última actualización: 18 de noviembre de 2026.</p>

            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-paper/70">
              <p>
                OrigynLX es una herramienta de calificación USMCA (T-MEC) sin cuentas de usuario.
                Esta página explica qué datos pasan por el servicio, hacia dónde van y qué
                conservamos. Preguntas y solicitudes de eliminación:{" "}
                <a href="mailto:george@origynlx.space" className="underline hover:text-paper transition-colors">george@origynlx.space</a>.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">La versión corta</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Tu lista de materiales en una verificación de producto individual nunca sale de tu navegador; el cálculo corre en tu dispositivo.</li>
                <li>Vendemos licencias, no datos. No mostramos anuncios y no vendemos ni compartimos tu información con publicistas.</li>
                <li>Usamos Google Analytics 4 (con IP anonimizada) para ver tráfico agregado.</li>
                <li>Los pagos los maneja PayPal por completo; nunca vemos los datos de tu tarjeta.</li>
              </ul>

              <h2 className="pt-4 font-display text-xl text-paper">Qué recopilamos y por qué</h2>
              <p>
                <strong className="text-paper">Cálculos (producto individual).</strong> La
                calculadora de RVC, el generador de certificados, la hoja de auditoría y el paquete
                para agente aduanal corren en tu navegador. Tu lista de materiales se queda en tu
                dispositivo salvo que decidas enviarla (por ejemplo, mediante el formulario de
                contacto o el correo).
              </p>
              <p>
                <strong className="text-paper">Cargas de lote.</strong> El calificador por lotes
                envía el CSV que subes a nuestro servidor únicamente para procesar esa corrida y
                devolverte tu matriz. Los archivos de lote se procesan para esa corrida; no se
                usan para construir perfiles de producto ni para nada más.
              </p>
              <p>
                <strong className="text-paper">Bóveda de determinaciones.</strong> Si guardas una
                determinación, se almacena bajo tu clave de licencia para que solo tú puedas
                reabrirla. Guardar siempre es tu decisión.
              </p>
              <p>
                <strong className="text-paper">Claves de licencia.</strong> La clave comprada se
                guarda en tu navegador (localStorage y una cookie segura) para que la herramienta
                recuerde tu acceso. No hay contraseñas ni perfiles.
              </p>
              <p>
                <strong className="text-paper">Compras.</strong> Los pagos son procesados por
                PayPal. Nosotros recibimos tu correo y la confirmación de pago necesaria para emitir
                tu licencia; PayPal maneja los datos de pago bajo su propia política de
                privacidad.
              </p>
              <p>
                <strong className="text-paper">Formulario de contacto.</strong> Nombre, correo y
                mensaje, entregados por correo electrónico para poder responderte.
              </p>
              <p>
                <strong className="text-paper">Analítica.</strong> Usamos Google Analytics 4 para
                entender el tráfico agregado (páginas, referencias, geografía aproximada). La
                anonimización de IP está activada. No activamos funciones de publicidad ni
                compartimos datos con plataformas publicitarias.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Cookies y almacenamiento local</h2>
              <p>
                Usamos la cookie de Google Analytics (_ga) para analítica agregada, y tu clave de
                licencia en localStorage además de una cookie segura para restaurar tu sesión. Los
                datos de tu lista de materiales se guardan solo en tu navegador mientras trabajas;
                puedes borrarlos cuando quieras. Puedes bloquear las cookies de analítica en los
                ajustes de tu navegador; la calculadora funciona sin ellas.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Proveedores de servicio</h2>
              <p>
                El hospedaje y la infraestructura corren en Vercel. La analítica es Google
                Analytics 4 (Google LLC). Los pagos son de PayPal. El correo transaccional se
                entrega mediante Resend. El almacenamiento de la bóveda y el procesamiento por
                lotes usan Upstash. Estos proveedores procesan datos en nuestro nombre para operar
                el servicio; nadie más recibe tus datos.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Lo que nunca hacemos</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Vender, rentar o compartir tu información personal o tus datos de producto.</li>
                <li>Usar tus listas de materiales, códigos HS o datos del negocio para publicitar ante ti o ante nadie más.</li>
                <li>Ejecutar publicidad de terceros o píxeles de rastreo entre sitios más allá de la analítica descrita.</li>
              </ul>

              <h2 className="pt-4 font-display text-xl text-paper">Conservación y eliminación</h2>
              <p>
                Los correos de contacto se conservan el tiempo necesario para responderlos. Los
                registros de licencia se conservan mientras tu licencia esté activa y, después,
                para contabilidad básica. Para eliminar tus correos, tu registro de licencia o tus
                determinaciones guardadas, escribe a{" "}
                <a href="mailto:george@origynlx.space" className="underline hover:text-paper transition-colors">george@origynlx.space</a>{" "}
                y nos encargamos.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Tus derechos</h2>
              <p>
                Donde la ley local te otorgue derechos de acceso, corrección, exportación o
                eliminación de tus datos personales, puedes ejercerlos escribiendo al correo
                anterior. Responderemos en un plazo razonable.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Transferencias internacionales</h2>
              <p>
                El servicio está hospedado en la infraestructura global de Vercel y procesado por
                los proveedores listados, lo que puede implicar transferencias entre países.
                Mantenemos el conjunto de proveedores tan pequeño como el servicio lo permite.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Cambios</h2>
              <p>
                Si esta política cambia, la nueva versión se publicará en esta página con fecha
                actualizada.
              </p>

              <p className="pt-4 text-[13px] text-paper/40">
                Esta es una política de privacidad general y no ha sido revisada por un abogado
                para tu jurisdicción específica; pide revisión legal antes de que sea relevante
                para tus obligaciones.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}
