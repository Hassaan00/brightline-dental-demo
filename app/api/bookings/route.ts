import { NextResponse } from "next/server";
import { listBookings, storageName } from "@/lib/store";
export const dynamic = "force-dynamic";
const mask = (s?: string) => (s ? s.replace(/^(.{2}).*(@.*)$/, "$1•••$2").replace(/^(\+?\(?\d{3}).*(\d{2})$/, "$1•••$2") : undefined);
export async function GET() {
  const all = await listBookings();
  return NextResponse.json({ storage: storageName, count: all.length, bookings: all.slice(0, 100).map((b) => ({ ...b, email: mask(b.email), phone: mask(b.phone) })) });
}
