import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Role = "admin" | "reviewer";
export const COOKIE = "wgos_admin";

function secret() {
  return `${process.env.ADMIN_PASSWORD ?? ""}|${process.env.REVIEWER_PASSWORD ?? ""}|${process.env.RATE_LIMIT_SALT ?? ""}`;
}

function sign(role: Role) {
  return createHmac("sha256", secret()).update(role).digest("hex");
}

export function tokenFor(role: Role) {
  return `${role}.${sign(role)}`;
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Checks a submitted password against the server-side env values. Never sent to the client. */
export function roleForPassword(pw: string): Role | null {
  const admin = process.env.ADMIN_PASSWORD;
  const reviewer = process.env.REVIEWER_PASSWORD;
  if (admin && same(pw, admin)) return "admin";
  if (reviewer && same(pw, reviewer)) return "reviewer";
  return null;
}

export function roleFromToken(token?: string): Role | null {
  if (!token) return null;
  const [role, sig] = token.split(".");
  if ((role === "admin" || role === "reviewer") && sig && same(sig, sign(role))) return role;
  return null;
}

export async function currentRole(): Promise<Role | null> {
  return roleFromToken((await cookies()).get(COOKIE)?.value);
}
