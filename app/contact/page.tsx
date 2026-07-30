import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Contact</span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
                Talk to us.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-paper/60 sm:text-lg">
                Questions about a specific product, a license, or whether OrigynLX fits your
                sourcing setup — send a message and we'll reply within a business day.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
