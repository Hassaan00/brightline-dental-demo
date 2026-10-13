import type { Metadata } from "next";
import { Bell, CalendarCheck2, Gift, Star, Check, ChevronRight, Home, Calendar, User, Sparkles, Apple, Play } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
export const metadata: Metadata = { title: "The Brightline app", description: "Book, get reminders and earn rewards with the Brightline Dental mobile app." };

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[270px] shrink-0 rounded-[3rem] bg-slate-900 p-[10px] shadow-[0_40px_80px_-30px_rgba(15,23,42,.45)] ring-1 ring-slate-700 ${className}`}>
      <div className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-slate-900" />
      <div className="relative h-[560px] overflow-hidden rounded-[2.4rem] bg-slate-50">
        <div className="flex justify-between px-7 pt-4 text-[11px] font-semibold text-slate-900"><span>9:41</span><span>●●● ▮</span></div>
        {children}
      </div>
    </div>
  );
}
function TabBar({ a }: { a: number }) {
  return <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-slate-200 bg-white/90 pb-5 pt-2.5 backdrop-blur">{[Home, Calendar, Gift, User].map((I, i) => <I key={i} size={20} className={i === a ? "text-brand-600" : "text-slate-400"} />)}</div>;
}
export default function AppPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="relative overflow-hidden">
          <div className="grid-bg absolute inset-0 -z-10" />
          <div className="absolute left-1/2 top-40 -z-10 h-[30rem] w-[70rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-100 via-sky-100 to-violet-100 opacity-70 blur-3xl" />
          <div className="container-x pt-16 text-center sm:pt-24">
            <Reveal><span className="eyebrow"><Sparkles size={13} /> Brightline for iOS & Android</span></Reveal>
            <Reveal delay={0.05}><h1 className="mx-auto mt-6 max-w-3xl font-display text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl">Your smile, in your pocket.</h1></Reveal>
            <Reveal delay={0.1}><p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">One-tap booking, smart reminders and rewards for every visit. Patients love it, and it brings them back.</p></Reveal>
            <Reveal delay={0.15}><div className="mt-8 flex justify-center gap-3"><span className="btn-primary"><Apple size={16} /> App Store</span><span className="btn-ghost"><Play size={16} /> Google Play</span></div></Reveal>
          </div>
          <div className="container-x mt-16 flex flex-col items-center gap-10 pb-24 lg:flex-row lg:items-end lg:justify-center">
            <Reveal delay={0.1}>
              <Phone className="lg:-rotate-3">
                <div className="px-5 pt-5"><p className="text-xs text-slate-500">Good evening,</p><p className="font-display text-2xl">Jordan</p></div>
                <div className="mx-4 mt-4 rounded-3xl bg-slate-900 p-4 text-white"><p className="text-[11px] text-brand-300">NEXT VISIT</p><p className="mt-1 font-semibold">Exam & Cleaning</p><p className="text-xs text-slate-400">Thu, Oct 15 · 5:30 PM · Dr. Brooks</p><div className="mt-3 flex gap-2"><span className="flex-1 rounded-xl bg-white/10 py-2 text-center text-[11px]">Reschedule</span><span className="flex-1 rounded-xl bg-brand-500 py-2 text-center text-[11px] font-medium">Directions</span></div></div>
                <p className="mx-5 mt-5 text-xs font-semibold text-slate-900">Book again</p>
                <div className="mx-4 mt-2 space-y-2">{[["Whitening", "$399"], ["Invisalign consult", "Free"], ["Emergency visit", "$129"]].map(([a, b]) => <div key={a} className="flex items-center justify-between rounded-2xl bg-white p-3 text-xs shadow-sm"><span className="font-medium">{a}</span><span className="flex items-center gap-1 text-slate-500">{b}<ChevronRight size={14} /></span></div>)}</div>
                <TabBar a={0} />
              </Phone>
            </Reveal>
            <Reveal delay={0.2}>
              <Phone className="lg:mb-10">
                <div className="relative mx-3 mt-6 h-[300px]">
                  <p className="px-2 text-center text-[11px] text-slate-500">Thursday, October 14</p>
                  <p className="text-center font-display text-6xl text-slate-900">7:02</p>
                  {[{ i: Bell, t: "Tomorrow, 5:30 PM", d: "Cleaning with Dr. Brooks. Tap to confirm ✓" }, { i: CalendarCheck2, t: "Confirmed!", d: "See you Thursday. Free parking behind the building." }, { i: Gift, t: "+150 points", d: "You're 50 points from a free whitening touch-up." }].map((n, k) => (
                    <div key={k} className="mt-2.5 flex gap-3 rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-200"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white"><n.i size={15} /></span><div><p className="text-[11px] font-semibold">Brightline · {n.t}</p><p className="text-[11px] leading-snug text-slate-500">{n.d}</p></div></div>))}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-100 to-transparent" />
              </Phone>
            </Reveal>
            <Reveal delay={0.3}>
              <Phone className="lg:rotate-3">
                <div className="px-5 pt-5"><p className="font-display text-2xl">Rewards</p></div>
                <div className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white">
                  <p className="text-[11px] opacity-80">BRIGHTLINE GOLD</p><p className="mt-1 font-display text-4xl">1,450</p><p className="text-[11px] opacity-80">points</p>
                  <div className="mt-4 h-1.5 rounded-full bg-white/25"><div className="h-full w-[88%] rounded-full bg-white" /></div><p className="mt-2 text-[10px] opacity-80">50 pts to free whitening touch-up</p>
                </div>
                <div className="mx-4 mt-4 space-y-2">{[["Visit completed", "+150"], ["Referred a friend", "+500"], ["5-star review", "+100"]].map(([a, b]) => <div key={a} className="flex items-center justify-between rounded-2xl bg-white p-3 text-xs shadow-sm"><span className="flex items-center gap-2"><Check size={14} className="text-brand-600" />{a}</span><span className="font-semibold text-brand-700">{b}</span></div>)}</div>
                <TabBar a={2} />
              </Phone>
            </Reveal>
          </div>
        </section>
        <section className="border-t border-slate-200 bg-slate-50/60 py-20">
          <div className="container-x grid gap-5 md:grid-cols-3">
            {[{ i: CalendarCheck2, t: "Book in one tap", d: "Live availability, saved insurance and favourite dentist. Rebooking takes two seconds." },
              { i: Bell, t: "Reminders that work", d: "Push, SMS and WhatsApp reminders cut no-shows by up to 70% in our partner clinics." },
              { i: Star, t: "Loyalty that retains", d: "Points for visits, referrals and reviews keep patients coming back twice a year." }].map((x, k) => (
              <Reveal key={k} delay={k * 0.06}><div className="h-full rounded-3xl border border-slate-200 bg-white p-7"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700"><x.i size={20} /></div><h2 className="mt-5 text-lg font-semibold">{x.t}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{x.d}</p></div></Reveal>))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
