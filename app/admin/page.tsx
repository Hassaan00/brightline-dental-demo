import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Moon, TrendingDown, DollarSign, LayoutDashboard, CalendarDays, MessageSquareText, Users, Settings, ArrowUpRight, Sparkles, Bell } from "lucide-react";
import Logo from "@/components/Logo";
export const metadata: Metadata = { title: "Clinic dashboard", robots: { index: false } };
const kpis = [
  { l: "Bookings handled by AI", v: "412", d: "+38% vs last month", i: Bot },
  { l: "After-hours leads captured", v: "167", d: "41% of all leads", i: Moon },
  { l: "No-show rate", v: "4.1%", d: "down from 14.8%", i: TrendingDown },
  { l: "Revenue recovered", v: "$48,920", d: "this month", i: DollarSign },
];
const ai = [22, 28, 25, 34, 31, 40, 38, 46, 44, 52, 57, 63];
const staff = [30, 29, 31, 28, 30, 27, 29, 26, 28, 27, 25, 26];
const months = ["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"];
const convos = [
  { n: "Emily Carter", m: "Booked Whitening · Thu 5:30 PM", t: "11:42 PM", lang: "EN", tag: "Booked" },
  { n: "Javier Morales", m: "¿Aceptan Cigna? → Yes, booked cleaning", t: "10:15 PM", lang: "ES", tag: "Booked" },
  { n: "Lena Fischer", m: "Invisalign consult, financing question", t: "9:03 PM", lang: "DE", tag: "Lead" },
  { n: "Mark Thompson", m: "Toothache → Same-day emergency 8:00 AM", t: "6:48 AM", lang: "EN", tag: "Urgent" },
  { n: "Claire Dubois", m: "Rescheduled implant follow-up", t: "Yesterday", lang: "FR", tag: "Rescheduled" },
];
const tagc: Record<string, string> = { Booked: "bg-emerald-50 text-emerald-700", Lead: "bg-sky-50 text-sky-700", Urgent: "bg-rose-50 text-rose-700", Rescheduled: "bg-amber-50 text-amber-700" };
function line(d: number[], w = 560, h = 180) { const mx = 70; return d.map((v, i) => `${(i / (d.length - 1)) * w},${h - (v / mx) * h}`).join(" "); }
export default function Admin() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
        <Logo />
        <nav className="mt-10 space-y-1 text-sm" aria-label="Dashboard">
          {[[LayoutDashboard, "Overview", true], [MessageSquareText, "Conversations"], [CalendarDays, "Schedule"], [Users, "Patients"], [Bot, "AI receptionist"], [Settings, "Settings"]].map(([I, l, a]: any) => <a key={l} href="#" className={`flex items-center gap-3 rounded-xl px-3 py-2 ${a ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}><I size={16} />{l}</a>)}
        </nav>
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 p-4 text-xs text-slate-600"><Sparkles size={16} className="mb-2 text-brand-600" />Ava handled <b>92%</b> of conversations without staff this week.</div>
      </aside>
      <main id="main" className="flex-1 p-5 sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm text-slate-500">Brightline Dental Studio · October 2026</p><h1 className="font-display text-3xl tracking-tight">Good morning, Dr. Chen</h1></div>
          <div className="flex items-center gap-2"><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">Demo data</span><button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white"><Bell size={16} /></button><Link href="/" className="btn-primary !py-2">View site <ArrowUpRight size={14} /></Link></div>
        </header>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
          {kpis.map((k) => <div key={k.l} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between text-sm text-slate-500">{k.l}<span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50 text-brand-700"><k.i size={16} /></span></div><p className="mt-4 font-display text-4xl tracking-tight">{k.v}</p><p className="mt-1 text-xs font-medium text-emerald-600">{k.d}</p></div>)}
        </section>
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">Bookings per week</h2><div className="flex gap-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-brand-500" />AI receptionist</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-slate-300" />Front desk</span></div></div>
            <svg viewBox="0 0 560 200" className="mt-6 h-auto w-full" role="img" aria-label="AI bookings rose from 22 to 63 per week while front desk bookings stayed flat">
              <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1AA391" stopOpacity=".25" /><stop offset="1" stopColor="#1AA391" stopOpacity="0" /></linearGradient></defs>
              {[0, 45, 90, 135, 180].map((y) => <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="#F1F5F9" />)}
              <polygon points={`0,180 ${line(ai)} 560,180`} fill="url(#g)" />
              <polyline points={line(staff)} fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5 5" />
              <polyline points={line(ai)} fill="none" stroke="#1AA391" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {months.map((m, i) => <text key={i} x={(i / 11) * 552 + 4} y="198" fontSize="10" fill="#94A3B8" textAnchor="middle">{m}</text>)}
            </svg>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="font-semibold">When leads arrive</h2><p className="text-xs text-slate-500">41% come in while the office is closed</p>
            <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label="Leads by hour, with peaks in evenings after closing">
              {[3, 2, 1, 1, 2, 5, 9, 12, 10, 8, 9, 11, 10, 8, 9, 11, 13, 15, 18, 21, 19, 14, 9, 5].map((v, i) => <div key={i} className={`flex-1 rounded-t-md ${i < 7 || i > 18 ? "bg-brand-500" : "bg-slate-200"}`} style={{ height: `${(v / 21) * 100}%` }} />)}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span></div>
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-brand-50 p-3 text-xs text-brand-800"><Moon size={14} />After-hours (teal) = revenue you used to miss.</div>
          </div>
        </section>
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between"><h2 className="font-semibold">Recent AI conversations</h2><span className="text-xs text-slate-500">Live</span></div>
            <ul className="mt-4 divide-y divide-slate-100">
              {convos.map((c) => <li key={c.n} className="flex items-center gap-3 py-3.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{c.n.split(" ").map((x) => x[0]).join("")}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{c.n} <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{c.lang}</span></p><p className="truncate text-xs text-slate-500">{c.m}</p></div><span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline ${tagc[c.tag]}`}>{c.tag}</span><span className="w-16 text-right text-xs text-slate-400">{c.t}</span></li>)}
            </ul>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-soft">
            <h2 className="font-semibold">Automation ROI</h2><p className="text-xs text-slate-400">Last 30 days</p>
            <div className="mt-6 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-36 w-36" role="img" aria-label="92 percent of conversations resolved by AI"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="12" /><circle cx="60" cy="60" r="50" fill="none" stroke="#3FBFAB" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${0.92 * 314} 314`} transform="rotate(-90 60 60)" /><text x="60" y="58" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">92%</text><text x="60" y="76" textAnchor="middle" fill="#94A3B8" fontSize="8">resolved by AI</text></svg>
            </div>
            <dl className="mt-6 space-y-3 text-sm">{[["Staff hours saved", "86 h"], ["Missed calls followed up", "203"], ["Reminder confirmations", "96%"], ["Avg. response time", "4 sec"]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-white/10 pb-3"><dt className="text-slate-400">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
          </div>
        </section>
      </main>
    </div>
  );
}
