"use client";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("bl-consent") && !navigator.webdriver) setShow(true); }, []);
  if (!show) return null;
  const set = (v: string) => { localStorage.setItem("bl-consent", v); setShow(false); };
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-[60] sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-sm">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Cookie size={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
          <p className="text-sm leading-relaxed text-slate-600">We use essential cookies to run this site and, with your consent, analytics to improve it. GDPR &amp; CCPA compliant.</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => set("all")} className="btn-primary flex-1 !py-2">Accept all</button>
          <button onClick={() => set("essential")} className="btn-ghost flex-1 !py-2">Essential only</button>
        </div>
      </div>
    </div>
  );
}
