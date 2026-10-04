import { db } from "@/lib/supabase";

/** Public-safe inviter details for a ref code: first name, college and chosen project only. */
export async function getInviter(code: string) {
  const supabase = db();
  if (!supabase || !/^[A-Z0-9]{4,12}$/.test(code)) return null;
  const { data } = await supabase
    .from("registrations")
    .select("name, college, project_idea")
    .eq("ref_code", code)
    .maybeSingle();
  if (!data) return null;
  return {
    firstName: String(data.name).split(" ")[0],
    college: data.college as string,
    project: data.project_idea as string | null,
  };
}
