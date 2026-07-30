import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.includes("@") || !message?.trim()) {
      return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
      console.error("Resend is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL missing).");
      return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `New OrigynLX contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("contact route error:", err);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 500 });
  }
}
