import { NextResponse } from "next/server";
import { COOKIE, tokenFor, type Role } from "@/lib/auth";
import { userFromRequest } from "@/lib/user";

/**
 * Reviewer / admin sign-in with a Supabase account: swaps a verified Supabase session for the same httpOnly
 * cookie the password login issues. The role comes from `app_metadata`, which only the server (service role)
 * can write, so a student can't give themselves access.
 */
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: "Please log in." }, { status: 401 });

  const role = user.app_metadata?.role;
  if (role !== "admin" && role !== "reviewer") {
    return NextResponse.json({ ok: false, message: "This account doesn't have admin access." }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(COOKIE, tokenFor(role as Role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
