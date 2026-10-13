import { NextResponse } from "next/server";
import { createBooking, SlotTaken } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  try { const bk = await createBooking({ ...b, source: "form" }); return NextResponse.json({ ok: true, ref: bk.ref, booking: bk }); }
  catch (e: any) {
    if (e instanceof SlotTaken) return NextResponse.json({ ok: false, error: "Sorry, that slot was just taken. Please pick another time." }, { status: 409 });
    return NextResponse.json({ ok: false, error: e?.message || "Could not book" }, { status: 400 });
  }
}
