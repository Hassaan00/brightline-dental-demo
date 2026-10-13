"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, CalendarCheck2, Check } from "lucide-react";
const script = [
  { r: "u", t: "Hi! Can I get a cleaning this week? After 5 works best." },
  { r: "a", t: "Of course! Dr. Brooks has Thursday at 5:30 PM or Friday at 3:00 PM. Which works?" },
  { r: "u", t: "Thursday 5:30 please. I have Delta Dental." },
  { r: "a", t: "Great, Delta Dental is in-network, so your cleaning is likely covered 100%. Booking now…" },
];
export default function HeroChat() {
  const [n, setN] = useState(0);
  useEffect(() => { const id = setInterval(() => setN((x) => (x >= script.length + 2 ? 0 : x + 1)), 1700); return () => clearInterval(id); }, []);
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-200/60 via-sky-100/40 to-transparent blur-2xl" />
      <div className="glass overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900"><Sparkles size={16} className="text-brand-300" /></div>
          <div className="flex-1"><p className="text-sm font-semibold">Ava · AI Receptionist</p><p className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online now · 11:42 PM</p></div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">After hours</span>
        </div>
        <div className="flex h-[400px] flex-col justify-end gap-2.5 overflow-hidden bg-gradient-to-b from-white/40 to-slate-50/80 p-4">
          <AnimatePresence initial={false}>
            {script.slice(0, Math.min(n, script.length)).map((m, i) => (
              <motion.div key={i + "-" + (n === 0)} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${m.r === "u" ? "justify-end" : ""}`}>
                <p className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${m.r === "u" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>{m.t}</p>
              </motion.div>
            ))}
            {n > script.length && (
              <motion.div key="card" layout initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-brand-200 bg-brand-50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><CalendarCheck2 size={17} /></div>
                  <div className="flex-1"><p className="text-[13px] font-semibold text-slate-900">Exam & Cleaning confirmed</p><p className="text-xs text-slate-600">Thu, 5:30 PM · Dr. James Brooks</p></div>
                  <Check size={18} className="text-brand-600" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="glass absolute -left-16 top-[45%] hidden rounded-2xl px-4 py-3 lg:block">
        <p className="text-[11px] text-slate-500">Booked by AI this week</p><p className="font-display text-2xl">142</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="glass absolute -bottom-8 -right-10 hidden rounded-2xl px-4 py-3 lg:block">
        <p className="text-[11px] text-slate-500">Avg. time to book</p><p className="font-display text-2xl">28s</p>
      </motion.div>
    </div>
  );
}
