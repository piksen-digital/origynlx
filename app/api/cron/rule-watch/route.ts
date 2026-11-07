import { NextRequest, NextResponse } from "next/server";
import { scanRuleChanges } from "@/lib/rule-watch";

/**
 * Triggered daily by Vercel Cron (see vercel.json). Protected by CRON_SECRET
 * - Vercel sends it automatically as a Bearer token for configured jobs.
 *
 * Re-checks every rule watch against the sourced, revision-tagged rule
 * registry and raises an alert (plus email) when the governing rule
 * changed, expired or disappeared.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== "Bearer " + process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await scanRuleChanges();
  return NextResponse.json(result);
}
