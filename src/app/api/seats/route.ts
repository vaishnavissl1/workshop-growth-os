import { NextResponse } from "next/server";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Live seats left in Session 1, straight from the seats_left() RPC. */
export async function GET() {
  const { data } = (await db()?.rpc("seats_left")) ?? { data: null };
  return NextResponse.json({ left: typeof data === "number" ? data : cfg.seatCap, cap: cfg.seatCap });
}
