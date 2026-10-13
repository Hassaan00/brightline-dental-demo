"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, CalendarCheck2, Loader2 } from "lucide-react";
import { services, dentists } from "@/lib/clinic";
const steps = ["Service", "Dentist", "Date & time", "Your details"];
const times = ["8:00 AM", "9:30 AM", "11:00 AM", "1:30 PM", "3:00 PM", "4:30 PM", "5:30 PM", "6:15 PM"];
export default function Booking() {
  const sp = useSearchParams();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ service: sp.get("service") || "", dentist: "", date: "", time: "", name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false); const [ref, setRef] = useState(""); const [err, setErr] = useState("");
  const days = useMemo(() => { const out: Date[] = []; const d = new Date(); while (out.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)); } return out; }, []);
  const taken = (di: number, t: string) => (di * 7 + t.length * 3) % 5 === 0;
  const ok = [!!f.service, !!f.dentist, !!f.date && !!f.time, f.name.trim().length > 1 && /\S+@\S+\.\S+/.test(f.email)][step];
  const svc = services.find((s) => s.id === f.service); const doc = dentists.find((d) => d.id === f.dentist);
  async function submit() {
    setLoading(true); setErr("");
    try { const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); const j = await r.json(); if (j.ok) setRef(j.ref); else setErr(j.error); } catch { setErr("Network error, please try again."); }
    setLoading(false);
  }
  const card = (active: boolean) => `w-full rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 ${active ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500" : "border-slate-200 bg-white hover:border-slate-300"}`;
  if (ref) return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[2rem] p-8 text-center sm:p-12">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-glow"><Check size={30} /></div>
      <h1 className="mt-6 font-display text-3xl sm:text-4xl">You&apos;re booked, {f.name.split(" ")[0]}!</h1>
      <p className="mt-3 text-slate-600">A confirmation and calendar invite are on their way to {f.email}.</p>
      <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left text-sm">
        {[["Reference", ref], ["Service", svc?.name], ["Dentist", doc?.name], ["When", `${new Date(f.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · ${f.time}`], ["Where", "1100 S Congress Ave, Suite 210"]].map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="text-right font-medium text-slate-900">{v}</dd></div>)}
      </dl>
      <p className="mt-6 text-xs text-slate-500">We&apos;ll send a reminder 24 hours before. Reply C to confirm or R to reschedule.</p>
      <Link href="/" className="btn-ghost mt-8">Back to home</Link>
    </motion.div>
  );
  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Book in 30 seconds</h1>
      <p className="mt-3 text-slate-600">Real-time availability. Free cancellation up to 24 hours before.</p>
      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Booking progress">
        {steps.map((s, i) => <li key={s} className="text-xs"><div className={`h-1 rounded-full ${i <= step ? "bg-brand-600" : "bg-slate-200"}`} /><span className={`mt-2 hidden sm:block ${i === step ? "font-medium text-slate-900" : "text-slate-400"}`}>{s}</span></li>)}
      </ol>
      <div className="glass mt-6 rounded-[2rem] p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <h2 className="mb-5 text-lg font-semibold">{["Choose a service", "Choose your dentist", "Pick a date & time", "Your details"][step]}</h2>
            {step === 0 && <div className="grid gap-3 sm:grid-cols-2">{services.map((s) => <button key={s.id} onClick={() => setF({ ...f, service: s.id })} className={card(f.service === s.id)} aria-pressed={f.service === s.id}><div className="flex justify-between gap-2"><span className="font-medium">{s.name}</span><span className="text-sm font-semibold text-slate-900">{s.from ? "from " : ""}${s.price.toLocaleString()}</span></div><p className="mt-1 text-xs text-slate-500">{s.duration} min</p></button>)}</div>}
            {step === 1 && <div className="grid gap-3 sm:grid-cols-2">{dentists.map((d) => <button key={d.id} onClick={() => setF({ ...f, dentist: d.id })} className={card(f.dentist === d.id)} aria-pressed={f.dentist === d.id}><div className="flex items-center gap-3"><span className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${d.hue} text-sm font-semibold text-slate-700`}>{d.initials}</span><span><span className="block font-medium">{d.name}</span><span className="text-xs text-slate-500">{d.role}</span></span></div></button>)}</div>}
            {step === 2 && <div>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">{days.map((d, i) => { const v = d.toISOString(); const a = f.date === v; return <button key={v} onClick={() => setF({ ...f, date: v, time: "" })} aria-pressed={a} className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 ${a ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-300"}`}><span className="text-[11px] uppercase opacity-70">{d.toLocaleDateString("en-US", { weekday: "short" })}</span><span className="text-lg font-semibold">{d.getDate()}</span></button>; })}</div>
              {f.date ? <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">{times.map((t) => { const di = days.findIndex((d) => d.toISOString() === f.date); const x = taken(di, t); return <button key={t} disabled={x} onClick={() => setF({ ...f, time: t })} aria-pressed={f.time === t} className={`rounded-xl border py-2.5 text-sm ${x ? "cursor-not-allowed border-slate-100 text-slate-300 line-through" : f.time === t ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white hover:border-brand-300"}`}>{t}</button>; })}</div> : <p className="mt-5 text-sm text-slate-500">Select a day to see open times.</p>}
            </div>}
            {step === 3 && <div className="grid gap-4 sm:grid-cols-2">
              {([["name", "Full name", "text", "Jordan Lee"], ["email", "Email", "email", "jordan@email.com"], ["phone", "Mobile (for reminders)", "tel", "(512) 555-0199"]] as const).map(([k, l, t, p]) => <label key={k} className={`text-sm font-medium text-slate-700 ${k === "name" ? "sm:col-span-2" : ""}`}>{l}<input type={t} placeholder={p} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" /></label>)}
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">Anything we should know? <span className="font-normal text-slate-400">(optional)</span><textarea rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" /></label>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:col-span-2"><CalendarCheck2 size={16} className="mr-2 inline text-brand-600" />{svc?.name} with {doc?.name} · {f.date && new Date(f.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {f.time}</div>
              {err && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{err}</p>}
            </div>}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <button onClick={() => setStep(step - 1)} disabled={step === 0} className="inline-flex items-center gap-1.5 text-sm text-slate-600 disabled:invisible"><ArrowLeft size={15} /> Back</button>
          {step < 3 ? <button onClick={() => setStep(step + 1)} disabled={!ok} className="btn-primary disabled:opacity-40">Continue <ArrowRight size={15} /></button>
            : <button onClick={submit} disabled={!ok || loading} className="btn-primary disabled:opacity-40">{loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Confirm booking</button>}
        </div>
      </div>
    </div>
  );
}
