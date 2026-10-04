import { WORKSHOP_CONFIG as cfg } from "@/config";
import { db } from "@/lib/supabase";

/** Live seats left in Session 1 from the seats_left() RPC; falls back to the cap if the database is unreachable. */
export async function seatsLeft() {
  const supabase = db();
  if (!supabase) return cfg.seatCap;
  const { data } = await supabase.rpc("seats_left");
  return typeof data === "number" ? data : cfg.seatCap;
}

export function sessionLabel(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function closesLabel() {
  return new Date(cfg.registrationCloses).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}
