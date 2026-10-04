import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { englishTemplate, fillMessage, type Lang } from "@/lib/kit";

const NAMES: Record<string, string> = { te: "Telugu", kn: "Kannada", hi: "Hindi" };

/**
 * Vernacular version of a kit message. Uses the Anthropic API when ANTHROPIC_API_KEY is set,
 * otherwise the AI-drafted static copy in lib/kit.ts. Either way it is flagged for native-speaker review.
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const lang = b.lang as Lang;
  const index = Number(b.index);
  const code = typeof b.amb === "string" ? b.amb.toUpperCase() : "";
  if (!(lang in NAMES) || ![0, 1, 2].includes(index) || typeof b.link !== "string") {
    return NextResponse.json({ ok: false, message: "Bad request." }, { status: 400 });
  }

  // Only real ambassadors can use this (protects the LLM key).
  const supabase = db();
  const { data: amb } = (await supabase?.from("ambassadors").select("code").eq("code", code).maybeSingle()) ?? { data: null };
  if (!amb) return NextResponse.json({ ok: false, message: "Unknown ambassador code." }, { status: 403 });

  const fill = { link: b.link, club: b.club, name: b.name };
  const fallback = fillMessage(lang, index, fill);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ ok: true, text: fallback, source: "ai-drafted", review: "native-speaker review needed" });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        messages: [
          {
            role: "user",
            content: `Translate this WhatsApp message into natural, casual ${NAMES[lang]} for engineering students. Keep emojis, line breaks, the link and any English product terms (GenAI, Gradio, Hugging Face, LLM, AI) unchanged. Return only the translation.\n\n${fillMessage("en", index, fill) || englishTemplate(index)}`,
          },
        ],
      }),
    });
    const d = await res.json();
    const text = d?.content?.[0]?.text;
    if (!res.ok || typeof text !== "string") throw new Error("llm");
    return NextResponse.json({ ok: true, text: text.trim(), source: "ai-translated", review: "native-speaker review needed" });
  } catch {
    return NextResponse.json({ ok: true, text: fallback, source: "ai-drafted", review: "native-speaker review needed" });
  }
}
