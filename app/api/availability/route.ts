import { NextResponse } from "next/server";
import { availability } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const u = new URL(req.url); const date = u.searchParams.get("date") || ""; const dentist = u.searchParams.get("dentist") || undefined;
  return NextResponse.json(await availability(date, dentist));
}
