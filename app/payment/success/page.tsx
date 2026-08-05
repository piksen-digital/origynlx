"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { storeLicenseKey } from "@/lib/trial";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessInner />
    </Suspense>
  );
}

function PaymentSuccessInner() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const [status, setStatus] = useState<"pending" | "active" | "failed" | "unknown" | "timeout">("pending");
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!ref) {
      setStatus("unknown");
      return;
    }
    setStatus((s) => (s === "timeout" ? "pending" : s));
    let attempts = 0;
    const maxAttempts = 15; // ~90s at 6s each - each call now also hits Pesepay, so a bit more spacing
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/payment/verify?ref=${encodeURIComponent(ref)}`);
        const data = await res.json();
        if (data.status === "active" && data.licenseKey) {
          setStatus("active");
          setLicenseKey(data.licenseKey);
          storeLicenseKey(data.licenseKey);
          clearInterval(interval);
        } else if (data.status === "failed") {
          setStatus("failed");
          clearInterval(interval);
        }
      } catch {
        // keep polling
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus((s) => (s === "pending" ? "timeout" : s));
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [ref, retryKey]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-40 pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12 text-center">
          {status === "pending" && (
            <>
              <h1 className="font-display text-3xl font-semibold text-paper">Confirming your payment…</h1>
              <p className="mt-3 text-paper/60">This usually takes a few seconds.</p>
            </>
          )}
          {status === "active" && (
            <>
              <h1 className="font-display text-3xl font-semibold text-pass">Payment confirmed.</h1>
              <p className="mt-3 text-paper/60">Your license key:</p>
              <p className="mt-2 font-mono text-xl text-seal">{licenseKey}</p>
              <p className="mt-4 text-[13px] text-paper/40">
                Saved to this browser automatically. Keep it somewhere safe to unlock the calculator on another device.
              </p>
              <a href="/calculator" className="mt-8 inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors">
                Go to calculator
              </a>
            </>
          )}
          {status === "failed" && (
            <>
              <h1 className="font-display text-3xl font-semibold text-fail">Payment didn't go through.</h1>
              <p className="mt-3 text-paper/60">No charge was completed. You can try again from the pricing page.</p>
              <a href="/pricing" className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 text-paper text-sm font-medium px-8 h-12 hover:border-paper/40 transition-colors">
                Back to pricing
              </a>
            </>
          )}
          {status === "timeout" && (
            <>
              <h1 className="font-display text-3xl font-semibold text-paper">Still confirming — this is taking longer than usual.</h1>
              <p className="mt-3 text-paper/60 max-w-md mx-auto">
                If your card was charged, this will usually resolve on its own shortly. Keep this reference handy if you contact us:
              </p>
              <p className="mt-2 font-mono text-sm text-seal">{ref}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setRetryKey((k) => k + 1)}
                  className="inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors"
                >
                  Check again
                </button>
                <a href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 text-paper text-sm font-medium px-8 h-12 hover:border-paper/40 transition-colors">
                  Contact us
                </a>
              </div>
            </>
          )}
          {status === "unknown" && (
            <>
              <h1 className="font-display text-3xl font-semibold text-paper">We couldn't find that checkout.</h1>
              <p className="mt-3 text-paper/60">If you were just charged, contact us and we'll sort it out.</p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
