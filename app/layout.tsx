import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const fontSerif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const fontDisplay = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app"),
  title: "OrigynLX — USMCA Rules-of-Origin Qualifier",
  description:
    "Check Regional Value Content against USMCA thresholds and generate a draft Certificate of Origin in minutes. A pre-screening and document-preparation tool, not a legal certification service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSerif.variable} ${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">
        {children}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {"window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '" + GA_MEASUREMENT_ID + "', { anonymize_ip: true });"}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
