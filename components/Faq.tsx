"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/clinic";
export default function Faq() {
  const [o, setO] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
      {faqs.map((f, i) => (
        <div key={i}>
          <h3><button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-medium text-slate-900" aria-expanded={o === i} aria-controls={`faq-${i}`} onClick={() => setO(o === i ? null : i)}>
            {f.q}<Plus size={18} className={`shrink-0 text-slate-400 transition ${o === i ? "rotate-45" : ""}`} /></button></h3>
          <div id={`faq-${i}`} hidden={o !== i} className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</div>
        </div>
      ))}
    </div>
  );
}
