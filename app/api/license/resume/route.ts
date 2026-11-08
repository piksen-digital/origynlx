import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createResumeLinkToken, findActiveLicenseByEmail } from "@/lib/license";

/**
 * Cross-device resume: enter the email used at checkout, receive a
 * one-time link. Always returns the same response whether or not a
 * license exists, so the endpoint cannot be used to probe which
 * emails have purchased.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter the email you used at checkout." }, { status: 400 });
    }

    const generic = {
      ok: true,
      message: "If an active license exists for that email, a resume link is on its way. It expires in 30 minutes.",
    };

    const license = await findActiveLicenseByEmail(email);
    if (!license) {
      return NextResponse.json(generic);
    }

    const token = await createResumeLinkToken(license.merchantReference, email);
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const site = process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app";
        await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
          to: email,
          subject: "Resume your OrigynLX license",
          text:
            "Click to resume your license on this device (expires in 30 minutes):\n\n" +
            site +
            "/api/license/restore?token=" +
            token +
            "\n\nIf you did not request this, you can ignore this email.",
        });
      } catch (err) {
        console.error("license/resume: email failed:", err);
      }
    } else {
      console.warn("license/resume: RESEND_API_KEY not set, link not emailed. Token for manual testing: " + token);
    }
    return NextResponse.json(generic);
  } catch (err) {
    console.error("license/resume error:", err);
    return NextResponse.json({ error: "Could not send a resume link. Please try again." }, { status: 500 });
  }
}
