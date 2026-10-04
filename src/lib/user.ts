import { db } from "@/lib/supabase";

/** Resolves the signed-in user from an `Authorization: Bearer <access token>` header, verified by Supabase Auth. */
export async function userFromRequest(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const supabase = db();
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error || !data.user ? null : data.user;
}
