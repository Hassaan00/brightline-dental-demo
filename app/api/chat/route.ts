import { NextResponse } from "next/server";
import { clinic, services, dentists, insurers } from "@/lib/clinic";
import { fallback, detectLang } from "@/lib/fallback";
const busy = { en: "Sorry, I’m helping a lot of patients right now. Could you send that again in a few seconds?", es: "Disculpe, estoy atendiendo a muchos pacientes. ¿Puede repetirlo en unos segundos?", de: "Entschuldigung, gerade ist viel los. Können Sie das in ein paar Sekunden noch einmal senden?", fr: "Désolée, je suis très sollicitée. Pouvez-vous renvoyer cela dans quelques secondes ?" };
import { availability, createBooking, SlotTaken, TIMES, type Booking } from "@/lib/store";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function calendar() {
  const now = new Date(); const fmt = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const wd = (d: Date) => d.toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "long", month: "short", day: "numeric" });
  const out: string[] = [];
  for (let i = 0; i < 28; i++) { const d = new Date(now.getTime() + i * 864e5); const dow = d.toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "short" }); out.push(`${fmt(d)} ${dow}${dow === "Sun" ? " closed" : ""}${i === 0 ? " (today)" : i === 1 ? " (tomorrow)" : ""}`); }
  return out.join(", ");
}

const system = () => `You are Ava, the warm, efficient AI receptionist for ${clinic.name}, a modern dental clinic in Austin, Texas.
CLINIC FACTS (never invent anything else):
- Address: ${clinic.address}. Free parking behind the building. Phone ${clinic.phone}. Email ${clinic.email}.
- Hours: ${clinic.hours}. Online/AI booking 24/7.
- Services (id: name, self-pay USD): ${services.map((s) => `${s.id}: ${s.name} ${s.from ? "from " : ""}$${s.price}, ${s.duration}min`).join("; ")}.
- Dentists (id: name, focus): ${dentists.map((d) => `${d.id}: ${d.name}, ${d.role}`).join("; ")}.
- Bookable appointment times each open day: ${TIMES.join(", ")}.
- Insurance in-network: ${insurers.join(", ")}. No insurance: Brightline Membership $29/month (2 cleanings, exams, X-rays, 15% off). 0% financing via CareCredit and Sunbit. Same-day emergency visit $129.
CALENDAR (America/Chicago), use these exact YYYY-MM-DD dates (any future date up to 60 days ahead can be checked):
${calendar()}
BOOKING PROCEDURE:
1. Find out the service (recommend one if they describe a goal or symptom) and preferred day/time. Dentist is optional: pick the best fit (Invisalign→patel, implant/emergency→ramirez, whitening/veneers→chen, cleaning/kids→brooks) unless they choose.
2. ALWAYS call check_availability before offering or accepting a time. Never claim a slot is free without checking. If the requested time is taken, offer the 2-3 nearest free times.
3. Collect full name and a phone number or email.
4. Summarise (service, dentist, day, date, time, name, contact) and ask them to confirm.
5. Only after the user clearly confirms (yes / sí / ja / oui / confirm...), call create_booking. If it fails because the slot was taken, apologise and offer alternatives.
6. After a successful booking, give the reference number and say a confirmation is on its way.
STYLE: Reply in the user's language (English, Spanish, German or French). 1-3 short sentences, plain text, no markdown, no tables, no lists. Your replies may be read aloud, so keep them natural and speakable. Never diagnose; for severe swelling, fever or trauma tell them to call 911.`;

const tools = [
  { type: "function", function: { name: "check_availability", description: "Get free appointment times for a date, per dentist. Call before offering or accepting any time.",
    parameters: { type: "object", properties: { date: { type: "string", description: "YYYY-MM-DD" }, dentist: { type: "string", enum: dentists.map((d) => d.id), description: "optional dentist id" } }, required: ["date"] } } },
  { type: "function", function: { name: "create_booking", description: "Create the appointment. Only call after the user explicitly confirmed the summary.",
    parameters: { type: "object", properties: { service: { type: "string", enum: services.map((s) => s.id) }, dentist: { type: "string", enum: dentists.map((d) => d.id) }, date: { type: "string", description: "YYYY-MM-DD" }, time: { type: "string", enum: TIMES }, name: { type: "string" }, phone: { type: "string" }, email: { type: "string" }, notes: { type: "string" } }, required: ["service", "dentist", "date", "time", "name"] } } },
];

class Busy extends Error {}
async function groq(key: string, messages: any[], retried = false, model = "openai/gpt-oss-20b"): Promise<any> {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 800, temperature: 0.3, reasoning_effort: "low", messages, tools, tool_choice: "auto" }), signal: AbortSignal.timeout(20000),
  });
  if (r.status === 429) { const t = await r.clone().text().catch(() => ""); if (/per day|TPD|RPD/i.test(t)) { if (model !== "openai/gpt-oss-120b") return groq(key, messages, false, "openai/gpt-oss-120b"); throw new Error("groq daily quota reached"); } }
  if (r.status === 429) { const ra = Math.min(8, parseFloat(r.headers.get("retry-after") || "3") || 3); if (!retried) { await new Promise((ok) => setTimeout(ok, ra * 1000)); return groq(key, messages, true, model); } throw new Busy(); }
  if (!r.ok) throw new Error("groq " + r.status + " " + (await r.text()).slice(0, 200));
  return (await r.json()).choices?.[0]?.message;
}

export async function POST(req: Request) {
  let messages: { role: "user" | "assistant"; content: string }[] = []; let channel: "chat" | "voice" = "chat";
  try { const b = await req.json(); channel = b.channel === "voice" ? "voice" : "chat";
    messages = (b.messages || []).slice(-16).map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 1500) })); } catch {}
  const last = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const key = process.env.GROQ_API_KEY;
  let booking: (Booking & { serviceName: string; dentistName: string }) | undefined;
  if (key) {
    try {
      const confirmed = /\b(yes|yeah|yep|sure|ok|okay|confirm\w*|correct|perfect|great|book it|go ahead|please do|s[ií]|claro|vale|perfecto|confirm[oa]|ja|genau|passt|best[äa]tig\w*|oui|d'accord|parfait)\b/i.test(last);
      const convo: any[] = [{ role: "system", content: system() }, ...messages];
      for (let i = 0; i < 5; i++) {
        const msg = await groq(key, convo);
        if (!msg) break;
        if (msg.tool_calls?.length) {
          convo.push({ role: "assistant", content: msg.content || "", tool_calls: msg.tool_calls });
          for (const tc of msg.tool_calls) {
            let result: any; let args: any = {};
            try { args = JSON.parse(tc.function.arguments || "{}"); } catch {}
            try {
              if (tc.function.name === "check_availability") result = await availability(args.date, args.dentist);
              else if (tc.function.name === "create_booking") {
                if (!confirmed) result = { ok: false, error: "needs_confirmation", message: "Not booked yet. Summarise the details and ask the user to confirm first." };
                else if (booking) result = { ok: true, ref: booking.ref, note: "already booked in this turn" };
                else {
                  const b = await createBooking({ ...args, source: channel });
                  booking = { ...b, serviceName: services.find((s) => s.id === b.service)!.name, dentistName: dentists.find((d) => d.id === b.dentist)!.name };
                  result = { ok: true, ref: b.ref, booking: b };
                }
              } else result = { error: "unknown tool" };
            } catch (e: any) { result = e instanceof SlotTaken ? { ok: false, error: "slot_taken", message: "That slot was just booked by someone else. Check availability again and offer alternatives." } : { ok: false, error: e?.message || "failed" }; }
            convo.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
          }
          continue;
        }
        const reply = (msg.content || "").trim();
        if (reply) return NextResponse.json({ reply, source: "groq", booking });
        break;
      }
      if (booking) return NextResponse.json({ reply: `You're booked! Your reference is ${booking.ref}.`, source: "groq", booking });
    } catch (e) { console.error("chat error", e); if (booking) return NextResponse.json({ reply: `You're booked! Your reference is ${booking.ref}.`, source: "groq", booking }); if (e instanceof Busy) return NextResponse.json({ reply: busy[detectLang(last)], source: "busy" }); }
  }
  return NextResponse.json({ reply: fallback(last), source: "fallback" });
}
