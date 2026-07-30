import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Legal</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Terms of use
            </h1>

            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-paper/70">
              <p>
                By using OrigynLX you agree to these terms. If you don't agree, don't use the
                service.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">The service</h2>
              <p>
                OrigynLX provides a Regional Value Content calculator and a draft Certificate of
                Origin generator for informational use, as described in our{" "}
                <a href="/legal/disclaimer" className="underline hover:text-paper transition-colors">Disclaimer</a>.
                Calculations run in your browser; we don't receive or store your bill-of-materials
                data unless you explicitly send it to us (for example, via the contact form).
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Accounts and licenses</h2>
              <p>
                There are no user accounts. A license key, issued after payment, unlocks unlimited
                calculations and certificate downloads for one product line for 12 months from
                purchase. License keys are non-transferable outside your own organization and
                should be kept confidential.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Payment</h2>
              <p>
                Payments are processed by Pesepay, a third-party payment provider. We don't store
                your card details. Refund requests can be sent through the contact page and are
                handled case by case.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">No warranty</h2>
              <p>
                The service is provided "as is." We don't warrant that results are accurate,
                complete, or fit for any regulatory purpose. See the Disclaimer for the full
                position on liability and the certifying party's responsibility.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Changes</h2>
              <p>
                We may update these terms or the service itself as USMCA's rules evolve. Material
                changes will be reflected on this page.
              </p>

              <p className="pt-4 text-[13px] text-paper/40">
                This is a general terms template and hasn't been reviewed by a lawyer for your
                specific jurisdiction — have counsel review before this goes live for real
                customers.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
