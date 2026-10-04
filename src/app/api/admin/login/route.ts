import { NextResponse } from "next/server";
import { COOKIE, roleForPassword, tokenFor } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const role = roleForPassword(typeof body.password === "string" ? body.password : "");
  if (!role) return NextResponse.json({ ok: false, message: "Wrong password." }, { status: 401 });
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(COOKIE, tokenFor(role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
