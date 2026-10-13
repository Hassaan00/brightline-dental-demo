import { NextResponse } from "next/server";
import { clinic, services, dentists, insurers } from "@/lib/clinic";
import { fallback } from "@/lib/fallback";
export const dynamic = "force-dynamic";

const SYSTEM = `You are Ava, the friendly AI receptionist for ${clinic.name}, a modern dental clinic in Austin, Texas.
Clinic facts (only use these, never invent):
- Address: ${clinic.address}. Free parking behind the building.
- Phone: ${clinic.phone}. Email: ${clinic.email}.
- Hours: ${clinic.hours}. Online/AI booking 24/7.
- Services & self-pay prices (USD): ${services.map((s) => `${s.name} ${s.from ? "from " : ""}$${s.price} (${s.desc})`).join("; ")}.
- Dentists: ${dentists.map((d) => `${d.name} – ${d.role}`).join("; ")}.
- Insurance in-network: ${insurers.join(", ")}. No insurance: Brightline Membership $29/month (2 cleanings, exams, X-rays, 15% off). 0% financing via CareCredit and Sunbit.
- Same-day emergency visits $129.
Behavior:
- Reply in the user's language (English, Spanish, German or French). Keep replies short: 1-4 sentences, plain text, no markdown tables.
- Recommend the right service when someone describes a goal or symptom, and suggest the matching dentist.
- To book, collect: service, preferred day/time, name and phone or email. Once you have them, confirm the request and mention they can pick an exact slot at /book.
- For severe swelling, fever or trauma tell them to call 911 or come in immediately. Never diagnose; you are not a dentist.`;

export async function POST(req: Request) {
  let messages: { role: "user" | "assistant"; content: string }[] = [];
  try { const b = await req.json(); messages = (b.messages || []).slice(-12).map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 1500) })); } catch {}
  const last = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const key = process.env.GROQ_API_KEY;
  if (key) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "openai/gpt-oss-20b", max_tokens: 800, temperature: 0.4, messages: [{ role: "system", content: SYSTEM }, ...messages] }),
        signal: AbortSignal.timeout(15000),
      });
      if (r.ok) { const j = await r.json(); const reply = j.choices?.[0]?.message?.content?.trim(); if (reply) return NextResponse.json({ reply, source: "groq" }); }
    } catch {}
  }
  return NextResponse.json({ reply: fallback(last), source: "fallback" });
}
