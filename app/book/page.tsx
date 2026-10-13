import { Suspense } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Booking from "@/components/Booking";
export const metadata: Metadata = { title: "Book an appointment", description: "Book your Brightline Dental visit in 30 seconds." };
export default function Page() {
  return (<><Nav /><main id="main" className="relative min-h-[calc(100vh-4rem)] bg-slate-50/60 py-12 sm:py-16"><div className="grid-bg absolute inset-0 -z-0" /><div className="container-x relative max-w-3xl"><Suspense><Booking /></Suspense></div></main></>);
}
