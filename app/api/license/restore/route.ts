import { NextRequest, NextResponse } from "next/server";
import {
  createResumeCookieToken,
  getLicenseByResumeCookieToken,
  getLicenseByResumeLinkToken,
  RESUME_COOKIE_NAME,
  resumeCookieOptions,
} from "@/lib/license";

/**
 * No-signup license restore.
 *
 * - GET without params: silent same-device restore. Reads the opaque
 *   olx_rid cookie, and if it maps to an active license, returns the
 *   license key so the client can re-attach it (never a guess, the
 *   cookie value itself is meaningless without the Redis mapping).
 *
 * - GET ?token=<magic>: emailed resume link (one-time, 30 min TTL).
 *   Mints the long-lived cookie on whatever browser clicks it and
 *   bounces to the calculator; invalid links land on the pricing page.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token) {
    const license = await getLicenseByResumeLinkToken(token);
    if (!license) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
    const cookieToken = await createResumeCookieToken(license.merchantReference, license.email);
    const redirect = NextResponse.redirect(new URL("/calculator", req.url));
    redirect.cookies.set(RESUME_COOKIE_NAME, cookieToken, resumeCookieOptions());
    return redirect;
  }

  const cookieToken = req.cookies.get(RESUME_COOKIE_NAME)?.value || "";
  if (!cookieToken) {
    return NextResponse.json({ valid: false });
  }
  const license = await getLicenseByResumeCookieToken(cookieToken);
  if (!license || !license.licenseKey) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true, licenseKey: license.licenseKey });
}
