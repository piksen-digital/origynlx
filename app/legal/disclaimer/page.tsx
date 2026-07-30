import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function DisclaimerPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Legal</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Disclaimer
            </h1>

            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-paper/70">
              <p>
                OrigynLX is a pre-screening and document-preparation tool. It performs the
                Regional Value Content arithmetic defined under USMCA and formats a draft
                Certificate of Origin from the information you enter. It does not practice
                customs law, does not certify goods, and is not a substitute for a licensed
                customs broker or trade attorney.
              </p>
              <p>
                <strong className="text-paper">Results are estimates for internal use only.</strong>{" "}
                Origin qualification depends on the accuracy of the bill-of-materials data you
                provide, on rules that can change (USMCA is under an active renegotiation process
                that may run through 2036), and in many cases on additional tests — including
                tariff-shift analysis under Annex 4-B — that this tool does not perform. A result
                shown here is not a determination that your product qualifies for preferential
                treatment.
              </p>
              <p>
                <strong className="text-paper">You are the certifying party.</strong> The
                importer, exporter, or producer who signs a Certificate of Origin is personally
                attesting to the facts on it and bears legal and financial responsibility for
                that claim, including any retroactive duties or penalties. Review every field
                OrigynLX generates against your own records before signing anything, and consult
                a licensed customs broker for any result close to the qualifying threshold or for
                anything you're not confident about.
              </p>
              <p>
                OrigynLX and its operator disclaim liability for decisions made based on output
                from this tool. Use it to move faster on the arithmetic — not as a substitute for
                professional judgment on your specific facts.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
