"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
type Msg = { role: "user" | "assistant"; content: string };
const quick = ["Book a cleaning", "How much is whitening?", "Do you take Delta Dental?", "I have a toothache", "¿Hablan español?"];
export default function ChatWidget() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "Hi, I'm Ava 👋 Brightline's AI receptionist. I can answer questions, check insurance and book you in seconds, 24/7. How can I help?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => { const f = () => setOpen(true); window.addEventListener("open-chat", f); return () => window.removeEventListener("open-chat", f); }, []);
  if (path?.startsWith("/admin")) return null;
  async function send(text: string) {
    if (!text.trim() || typing) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput(""); setTyping(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const j = await r.json(); setMsgs([...next, { role: "assistant", content: j.reply }]);
    } catch { setMsgs([...next, { role: "assistant", content: "Sorry, I lost connection. Please call (512) 555-0142." }]); }
    setTyping(false);
  }
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.25 }}
            role="dialog" aria-label="AI receptionist chat"
            className="fixed bottom-24 right-3 z-[70] flex h-[min(600px,calc(100dvh-8rem))] w-[calc(100vw-1.5rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-6">
            <header className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4 text-white">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-500/20 ring-1 ring-brand-400/40"><Sparkles size={18} className="text-brand-300" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" /></div>
              <div className="flex-1"><p className="text-sm font-semibold">Ava · AI Receptionist</p><p className="text-xs text-slate-400">Replies instantly · EN · ES · DE · FR</p></div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 hover:bg-white/10"><X size={18} /></button>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>{m.content}</p>
                </div>
              ))}
              {typing && <div className="flex w-16 items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3" aria-label="Ava is typing">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d * 0.15}s` }} />)}</div>}
              <div ref={end} />
            </div>
            <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2.5">
              {quick.map((q) => <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-brand-300 hover:text-brand-700">{q}</button>)}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-slate-100 p-3">
              <label htmlFor="chat-in" className="sr-only">Message</label>
              <input id="chat-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything, in any language…" className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white" />
              <button aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50" disabled={typing}><Send size={16} /></button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close AI receptionist" : "Chat with AI receptionist"}
        className="fixed bottom-5 right-4 z-[70] flex items-center gap-2 rounded-full bg-slate-900 py-3 pl-4 pr-5 text-sm font-medium text-white shadow-glow transition hover:scale-[1.03] sm:right-6">
        {open ? <X size={18} /> : <MessageCircle size={18} />}<span className="hidden sm:inline">{open ? "Close" : "Ask Ava · 24/7"}</span>
        {!open && <span className="absolute -top-0.5 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />}
      </button>
    </>
  );
}
