# OrigynLX

USMCA Regional Value Content qualifier + draft Certificate of Origin generator.
Next.js 14 (App Router) + Tailwind, deployed on Vercel, pushed via GitHub.

## Architecture in one paragraph

The RVC calculator and certificate PDF generator run entirely in the browser
(`lib/rvc-calculator.ts`, `lib/certificate-pdf.ts`) — no server round trip, no
per-user database. The only backend surface is Pesepay payment handling
(`lib/pesepay.ts`, `app/api/payment/*`) and a flat license-key store in Vercel
KV (`lib/license.ts`). There are no user accounts.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with real values (see sections below). `.env.local` is
git-ignored — it will never be committed.

```bash
npm run dev
```

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial OrigynLX prototype"
git remote add origin <your-repo-url>
git push -u origin main
```

## 3. Deploy on Vercel

Import the GitHub repo in the Vercel dashboard. Before the first real deploy,
add every variable from `.env.example` under Project Settings → Environment
Variables (with real values, not the placeholders). Vercel auto-deploys on
every push to `main` and gives you preview URLs on every PR.

## 4. Configure Pesepay

From your Pesepay dashboard:

1. Copy the **sandbox** Integration Key and Encryption Key into
   `PESEPAY_INTEGRATION_KEY` / `PESEPAY_ENCRYPTION_KEY`, with `PESEPAY_ENV=sandbox`.
2. Confirm the exact initiate-transaction endpoint for sandbox vs production
   in your dashboard's API reference and put them in
   `PESEPAY_INITIATE_URL_SANDBOX` / `PESEPAY_INITIATE_URL_PRODUCTION` — these
   sometimes differ per account, so don't assume the values in `.env.example`.
3. Once you have a real Vercel domain, set `NEXT_PUBLIC_SITE_URL` to it. This
   is used to build the `resultUrl` (`/api/payment/webhook`) and `returnUrl`
   (`/payment/success`) sent to Pesepay at checkout time.
4. **Before accepting real payments**, run a full sandbox transaction and
   check server logs for the webhook payload. `app/api/payment/webhook/route.ts`
   guesses at a few likely field names (`transactionStatus`, `status`,
   `merchantReference`) — confirm these against what your sandbox actually
   sends and adjust if needed. This is the one piece of this codebase I
   couldn't verify against live Pesepay docs while building it.
5. Swap to production keys and `PESEPAY_ENV=production` only once step 4 is
   confirmed working end to end.

## 5. Configure Vercel KV

Vercel dashboard → Storage → Create Database → KV. Once created, Vercel can
auto-populate `KV_REST_API_URL` / `KV_REST_API_TOKEN` into your project's env
vars for you.

## 6. Configure Resend

Sign up at resend.com, verify a sending domain (or use their test domain
while developing), and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (where
contact-form messages land), and `CONTACT_FROM_EMAIL`.

## 7. Before charging real customers

- Confirm with Pesepay support that card payments from US/Canadian/Mexican
  customers settle cleanly to your account, and how payout to Wise works from
  there — this affects the whole revenue path and is worth confirming before
  driving paid traffic.
- Have a lawyer review `app/legal/terms/page.tsx` for your jurisdiction.
- Run one real end-to-end purchase in sandbox before flipping to production.
