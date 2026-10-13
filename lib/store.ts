import { put, list, get } from "@vercel/blob";
import { services, dentists } from "./clinic";

export const TIMES = ["8:00 AM", "9:30 AM", "11:00 AM", "1:30 PM", "3:00 PM", "4:30 PM", "5:30 PM", "6:15 PM"];
export type Booking = { ref: string; service: string; dentist: string; date: string; time: string; name: string; email?: string; phone?: string; notes?: string; source: "chat" | "voice" | "form"; createdAt: string };

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const mem: Booking[] = (globalThis as any).__blMem || ((globalThis as any).__blMem = []);
const PREFIX = "bookings/v1/";
export const storageName = hasBlob ? "vercel-blob" : "memory";

const slotKey = (dentist: string, date: string, time: string) => `${dentist}_${date}_${time.replace(/[^0-9APM]/gi, "")}`;

export function normDate(d: string) { return String(d || "").slice(0, 10); }
export function isOpenDay(date: string) { const d = new Date(date + "T12:00:00Z"); return !isNaN(+d) && d.getUTCDay() !== 0; }
export function normTime(t: string) {
  const s = String(t || "").trim().toUpperCase().replace(/\s+/g, " ");
  const exact = TIMES.find((x) => x.toUpperCase() === s); if (exact) return exact;
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/); if (!m) return null;
  let h = +m[1]; const min = m[2] || "00"; let ap = m[3];
  if (!ap) { if (h >= 13) { h -= 12; ap = "PM"; } else ap = h >= 8 && h < 12 ? "AM" : "PM"; }
  if (h === 0) h = 12;
  return TIMES.find((x) => x === `${h}:${min} ${ap}`) || null;
}

export async function listBookings(): Promise<Booking[]> {
  if (!hasBlob) return [...mem].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const out: Booking[] = []; let cursor: string | undefined;
  const blobs: string[] = [];
  do { const r = await list({ prefix: PREFIX, cursor, limit: 1000 }); blobs.push(...r.blobs.map((b) => b.pathname)); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
  await Promise.all(blobs.map(async (p) => {
    try { const r = await get(p, { access: "private" }); if (r && r.statusCode === 200) out.push(JSON.parse(await new Response(r.stream).text())); } catch {}
  }));
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function takenSlots(date: string): Promise<Set<string>> {
  date = normDate(date);
  if (!hasBlob) return new Set(mem.filter((b) => b.date === date).map((b) => slotKey(b.dentist, b.date, b.time)));
  const r = await list({ prefix: PREFIX + date + "/", limit: 1000 });
  return new Set(r.blobs.map((b) => b.pathname.split("/").pop()!.replace(/\.json$/, "")));
}

export async function availability(date: string, dentist?: string) {
  date = normDate(date);
  if (!isOpenDay(date)) return { date, open: false, slots: {} as Record<string, string[]> };
  const taken = await takenSlots(date);
  const today = new Date().toISOString().slice(0, 10);
  const slots: Record<string, string[]> = {};
  for (const d of dentists) if (!dentist || d.id === dentist) slots[d.id] = date < today ? [] : TIMES.filter((t) => !taken.has(slotKey(d.id, date, t)));
  return { date, open: true, slots };
}

export class SlotTaken extends Error {}
export async function createBooking(input: Partial<Booking>): Promise<Booking> {
  const service = services.find((s) => s.id === input.service || s.name.toLowerCase() === String(input.service).toLowerCase())?.id;
  const dentist = dentists.find((d) => d.id === input.dentist || d.name.toLowerCase().includes(String(input.dentist).toLowerCase()))?.id;
  const date = normDate(input.date!); const time = normTime(input.time!);
  if (!service || !dentist || !time || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !isOpenDay(date)) throw new Error("Invalid service, dentist, date or time");
  if (!input.name || !(input.email || input.phone)) throw new Error("Name and phone or email are required");
  const b: Booking = { ref: "BL-" + Math.random().toString(36).slice(2, 7).toUpperCase(), service, dentist, date, time, name: String(input.name).slice(0, 80),
    email: input.email ? String(input.email).slice(0, 120) : undefined, phone: input.phone ? String(input.phone).slice(0, 40) : undefined,
    notes: input.notes ? String(input.notes).slice(0, 500) : undefined, source: input.source || "form", createdAt: new Date().toISOString() };
  const key = slotKey(dentist, date, time);
  if (!hasBlob) { if (mem.some((x) => slotKey(x.dentist, x.date, x.time) === key)) throw new SlotTaken(); mem.push(b); return b; }
  try {
    await put(`${PREFIX}${date}/${key}.json`, JSON.stringify(b), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
  } catch (e: any) {
    if (/exist/i.test(String(e?.message))) throw new SlotTaken();
    throw e;
  }
  return b;
}
