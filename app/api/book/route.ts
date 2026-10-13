import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const store: any[] = [];
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.service || !b.dentist || !b.date || !b.time || !b.name || !(b.email || b.phone))
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  const ref = "BL-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  store.push({ ...b, ref, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, ref });
}
export async function GET() { return NextResponse.json({ count: store.length }); }
