import { NextRequest, NextResponse } from "next/server";
import { scanVaultBlanketReminders } from "@/lib/vault";

/**
 * Triggered daily by Vercel Cron (see vercel.json). Protected by CRON_SECRET
 * - Vercel sends it automatically as a Bearer token for configured jobs.
 *
 * Emails the license holder when a stored certification blanket period
 * ends within 30 days, once per record.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== "Bearer " + process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await scanVaultBlanketReminders();
  return NextResponse.json(result);
}
