import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PaymentCancelPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-40 pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12 text-center">
          <h1 className="font-display text-3xl font-semibold text-paper">Checkout cancelled.</h1>
          <p className="mt-3 text-paper/60">No charge was made. You can pick up where you left off any time.</p>
          <a href="/pricing" className="mt-8 inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors">
            Back to pricing
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
