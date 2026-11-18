import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | OrigynLX",
  description:
    "How OrigynLX handles your data: in-browser calculations, no accounts, Google Analytics 4 with IP anonymization, PayPal payments, and what we never share or sell.",
  alternates: {
    canonical: "/privacy",
    languages: { "en": "/privacy", "es": "/es/privacidad", "x-default": "/privacy" },
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Legal</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Privacy policy
            </h1>
            <p className="mt-6 text-[13px] text-paper/40">Last updated November 18, 2026.</p>

            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-paper/70">
              <p>
                OrigynLX is a USMCA qualification tool with no user accounts. This page explains
                what data moves through the service, where it goes, and what we keep. Questions and
                deletion requests:{" "}
                <a href="mailto:george@origynlx.space" className="underline hover:text-paper transition-colors">george@origynlx.space</a>.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">The short version</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Your bill of materials for a single product check never leaves your browser; the math runs on your device.</li>
                <li>We sell licenses, not data. We don't run ads, and we don't sell or share your information with advertisers.</li>
                <li>We use Google Analytics 4 (with IP anonymization on) to see aggregate traffic.</li>
                <li>Payments are handled entirely by PayPal; we never see your card details.</li>
              </ul>

              <h2 className="pt-4 font-display text-xl text-paper">What we collect and why</h2>
              <p>
                <strong className="text-paper">Calculations (single product).</strong> The RVC
                calculator, certificate generator, audit worksheet, and broker package all run in
                your browser using client-side processing. The BOM you type or paste stays on your
                device unless you choose to send it to us (for example, through the contact form or
                email).
              </p>
              <p>
                <strong className="text-paper">Batch uploads.</strong> The batch qualifier sends
                the CSV you upload to our server for the sole purpose of processing your run and
                returning your matrix. Batch files are processed for that run; they are not used to
                build product profiles or for anything else.
              </p>
              <p>
                <strong className="text-paper">Determination vault.</strong> If you save a
                determination, it is stored under your license key so only you can reopen it.
                Saving is always your choice.
              </p>
              <p>
                <strong className="text-paper">License keys.</strong> A purchased license key is
                stored in your browser (localStorage and a secure cookie) so the tool remembers
                your access. There are no passwords and no profiles.
              </p>
              <p>
                <strong className="text-paper">Purchases.</strong> Payments are processed by
                PayPal. We receive your email address and the payment confirmation needed to issue
                your license; PayPal handles your payment details under its own privacy policy.
              </p>
              <p>
                <strong className="text-paper">Contact form.</strong> Name, email, and message,
                delivered to us by email so we can reply.
              </p>
              <p>
                <strong className="text-paper">Analytics.</strong> We use Google Analytics 4 to
                understand aggregate traffic (pages, referrals, rough geography). IP anonymization
                is enabled. We don't enable advertising features or share data with ad platforms.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Cookies and local storage</h2>
              <p>
                We use the Google Analytics cookie (_ga) for aggregate analytics, and your license
                key in localStorage plus a secure cookie for session restore. Your BOM data is
                stored only in your browser while you work, and you can clear it anytime. You can
                block analytics cookies in your browser settings or with any cookie-blocking tool;
                the calculator works fine without them.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Service providers</h2>
              <p>
                Hosting and infrastructure run on Vercel. Analytics is Google Analytics 4 (Google
                LLC). Payments are PayPal. Transactional email is delivered through Resend. Vault
                storage and batch processing use Upstash. These providers process data on our
                behalf to run the service; no one else receives your data.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">What we never do</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Sell, rent, or share your personal information or your product data.</li>
                <li>Use your BOMs, HS codes, or business details to market to you or anyone else.</li>
                <li>Run third-party advertising or cross-site tracking pixels beyond the analytics described above.</li>
              </ul>

              <h2 className="pt-4 font-display text-xl text-paper">Retention and deletion</h2>
              <p>
                Contact emails are kept as long as needed to answer them. License records are kept
                while your license is active and for basic accounting afterward. To delete your
                contact emails, license record, or saved vault determinations, email{" "}
                <a href="mailto:george@origynlx.space" className="underline hover:text-paper transition-colors">george@origynlx.space</a>{" "}
                and we will take care of it.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Your rights</h2>
              <p>
                Where local law gives you rights to access, correct, export, or delete your
                personal data (for example under GDPR or state privacy laws), you can exercise
                them by emailing us at the address above. We will respond within a reasonable time.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">International transfers</h2>
              <p>
                The service is hosted on Vercel's global infrastructure and processed by the
                providers listed above, which may involve transfers between countries. We keep the
                set of providers as small as the service allows.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Changes</h2>
              <p>
                If this policy changes, the new version will be posted on this page with an
                updated date.
              </p>

              <p className="pt-4 text-[13px] text-paper/40">
                This is a general privacy policy and hasn't been reviewed by a lawyer for your
                specific jurisdiction; have counsel review before it matters to your compliance
                obligations.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
