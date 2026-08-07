import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { listActiveLicenses, markRenewalReminderSent, type LicenseRecord } from "@/lib/license";

const REMINDER_WINDOW_DAYS = 14;

/**
 * Triggered by Vercel Cron (see vercel.json). Protected by CRON_SECRET so
 * it can't be triggered by anyone who finds the URL - Vercel sends this
 * automatically as a Bearer token when a cron job is configured.
 *
 * Finds active licenses expiring within REMINDER_WINDOW_DAYS that haven't
 * already gotten a reminder, and emails each one once.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const licenses = await listActiveLicenses();
  const now = Date.now();
  const windowMs = REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const due = licenses.filter((l) => {
    if (!l.expiresAt || l.renewalReminderSentAt || !l.email) return false;
    const expiresAt = new Date(l.expiresAt).getTime();
    return expiresAt - now > 0 && expiresAt - now <= windowMs;
  });

  let sent = 0;
  const errors: string[] = [];

  if (due.length > 0 && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    for (const record of due) {
      try {
        await sendReminder(resend, record);
        await markRenewalReminderSent(record.merchantReference);
        sent += 1;
      } catch (err: any) {
        errors.push(`${record.merchantReference}: ${err.message}`);
        console.error("renewal-reminders: failed to send for", record.merchantReference, err);
      }
    }
  }

  return NextResponse.json({ checked: licenses.length, due: due.length, sent, errors });
}

async function sendReminder(resend: Resend, record: LicenseRecord) {
  const daysLeft = Math.ceil((new Date(record.expiresAt!).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "OrigynLX <onboarding@resend.dev>",
    to: record.email!,
    subject: `Your OrigynLX license expires in ${daysLeft} days`,
    text:
      `Your OrigynLX annual license (${record.licenseKey}) expires on ${new Date(record.expiresAt!).toLocaleDateString()}.\n\n` +
      `USMCA sourcing rules can shift year to year, so re-checking on renewal is worth doing anyway, not just a formality.\n\n` +
      `Renew at ${process.env.NEXT_PUBLIC_SITE_URL}/pricing to keep unlimited checks and certificate downloads.`,
  });
}
