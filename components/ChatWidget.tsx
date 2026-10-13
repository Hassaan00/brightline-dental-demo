"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Mic, MicOff, CalendarCheck2, Check, AudioLines, Keyboard, Volume2, Square } from "lucide-react";
import { usePathname } from "next/navigation";

type BookingCard = { ref: string; serviceName: string; dentistName: string; date: string; time: string; name: string };
type Msg = { role: "user" | "assistant"; content: string; booking?: BookingCard };
type Lang = "en" | "es" | "de" | "fr";
const LANGS: Record<Lang, { label: string; bcp: string; hello: string; listen: string }> = {
  en: { label: "EN", bcp: "en-US", hello: "Hi, I'm Ava. How can I help you today?", listen: "Listening…" },
  es: { label: "ES", bcp: "es-US", hello: "Hola, soy Ava. ¿En qué puedo ayudarle?", listen: "Escuchando…" },
  de: { label: "DE", bcp: "de-DE", hello: "Hallo, ich bin Ava. Wie kann ich helfen?", listen: "Ich höre zu…" },
  fr: { label: "FR", bcp: "fr-FR", hello: "Bonjour, je suis Ava. Comment puis-je vous aider ?", listen: "Je vous écoute…" },
};
const quick = ["Book a cleaning this week", "How much is whitening?", "Do you take Delta Dental?", "I have a toothache", "¿Hablan español?"];

function pickVoice(bcp: string) {
  const vs = window.speechSynthesis?.getVoices() || []; const base = bcp.slice(0, 2);
  const same = vs.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(base));
  const pref = [/Samantha|Ava|Allison|Jenny|Aria|Google US English|Natural|Neural|Premium|Enhanced/i, /female|Google|Microsoft/i];
  for (const p of pref) { const v = same.find((x) => p.test(x.name)); if (v) return v; }
  return same[0];
}
const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function Wave({ active, level }: { active: boolean; level: number }) {
  return (
    <div className="flex h-16 items-center justify-center gap-1.5" aria-hidden="true">
      {Array.from({ length: 13 }).map((_, i) => {
        const c = 1 - Math.abs(i - 6) / 7;
        return <motion.span key={i} className="w-1.5 rounded-full bg-gradient-to-t from-brand-500 to-brand-300"
          animate={{ height: active ? [8, 8 + (20 + level * 40) * c * (0.6 + ((i * 37) % 10) / 20), 8] : 8 }}
          transition={{ duration: 0.5 + (i % 4) * 0.12, repeat: active ? Infinity : 0, ease: "easeInOut" }} />;
      })}
    </div>
  );
}

export default function ChatWidget() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [lang, setLang] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "Hi, I'm Ava 👋 Brightline's AI receptionist. I can answer questions, check live availability and book you in seconds, 24/7. Type or tap the mic to talk." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [vstate, setVstate] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [interim, setInterim] = useState("");
  const [level, setLevel] = useState(0.3);
  const [support, setSupport] = useState<"native" | "record" | "none">("native");
  const end = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null); const mediaRef = useRef<MediaRecorder | null>(null);
  const msgsRef = useRef(msgs); msgsRef.current = msgs;
  const modeRef = useRef(mode); modeRef.current = mode;

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupport(SR ? "native" : typeof MediaRecorder !== "undefined" && navigator.mediaDevices ? "record" : "none");
    window.speechSynthesis?.getVoices();
    const o = () => setOpen(true); const v = () => { setOpen(true); setMode("voice"); };
    window.addEventListener("open-chat", o); window.addEventListener("open-voice", v);
    return () => { window.removeEventListener("open-chat", o); window.removeEventListener("open-voice", v); };
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, interim]);
  useEffect(() => { if (!open || mode === "text") stopAll(); }, [open, mode]); // eslint-disable-line

  function stopAll() { try { recRef.current?.abort(); } catch {} try { mediaRef.current?.state === "recording" && mediaRef.current.stop(); } catch {} window.speechSynthesis?.cancel(); setVstate("idle"); setInterim(""); }

  const speak = useCallback((text: string, done?: () => void) => {
    const ss = window.speechSynthesis; if (!ss) { done?.(); return; }
    ss.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/BL[-‑]/g, "B L ").replace(/[*_#]/g, ""));
    u.lang = LANGS[lang].bcp; const v = pickVoice(LANGS[lang].bcp); if (v) u.voice = v; u.rate = 1.02; u.pitch = 1.05;
    setVstate("speaking"); u.onend = () => { setVstate("idle"); done?.(); }; u.onerror = () => { setVstate("idle"); done?.(); };
    ss.speak(u);
  }, [lang]);

  async function send(text: string, channel: "chat" | "voice" = "chat") {
    if (!text.trim() || typing) return;
    const next = [...msgsRef.current, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput(""); setTyping(true); if (channel === "voice") setVstate("thinking");
    let reply = "Sorry, I lost connection. Please call (512) 555-0142.";
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel, messages: next.map(({ role, content }) => ({ role, content })) }) });
      const j = await r.json(); reply = j.reply;
      setMsgs([...next, { role: "assistant", content: j.reply, booking: j.booking }]);
    } catch { setMsgs([...next, { role: "assistant", content: reply }]); }
    setTyping(false);
    if (channel === "voice" && modeRef.current === "voice") speak(reply); else if (channel === "voice") setVstate("idle");
  }

  function listen() {
    window.speechSynthesis?.cancel();
    if (support === "native") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR(); recRef.current = rec; rec.lang = LANGS[lang].bcp; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      let finalText = "";
      rec.onstart = () => setVstate("listening");
      rec.onresult = (e: any) => { let t = ""; for (let i = 0; i < e.results.length; i++) { t += e.results[i][0].transcript; if (e.results[i].isFinal) finalText = t; } setInterim(t); setLevel(0.3 + Math.random() * 0.7); };
      rec.onerror = (e: any) => { setVstate("idle"); setInterim(e.error === "not-allowed" ? "Microphone permission was blocked. Allow it in your browser, or type instead." : e.error === "no-speech" ? "I didn't catch that. Tap the mic and try again." : ""); };
      rec.onend = () => { const t = (finalText || "").trim(); setInterim(""); if (t) send(t, "voice"); else setVstate((s) => (s === "listening" ? "idle" : s)); };
      try { rec.start(); } catch { setVstate("idle"); }
      return;
    }
    if (support === "record") {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mr = new MediaRecorder(stream); mediaRef.current = mr; const chunks: Blob[] = [];
        mr.ondataavailable = (e) => chunks.push(e.data);
        mr.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop()); setVstate("thinking"); setInterim("Transcribing…");
          const fd = new FormData(); fd.append("file", new Blob(chunks, { type: mr.mimeType || "audio/webm" }), "audio.webm"); fd.append("lang", lang);
          try { const r = await fetch("/api/stt", { method: "POST", body: fd }); const j = await r.json(); setInterim(""); if (j.text?.trim()) send(j.text, "voice"); else { setVstate("idle"); setInterim("I didn't catch that. Try again."); } }
          catch { setVstate("idle"); setInterim("Transcription failed. Please type instead."); }
        };
        mr.start(); setVstate("listening");
      }).catch(() => { setVstate("idle"); setInterim("Microphone permission was blocked. Allow it in your browser, or type instead."); });
    }
  }
  function stopListening() { try { recRef.current?.stop(); } catch {} if (mediaRef.current?.state === "recording") mediaRef.current.stop(); }

  if (path?.startsWith("/admin")) return null;
  const vLabel = { idle: support === "record" ? "Tap to record, tap again to send" : "Tap the mic and speak", listening: LANGS[lang].listen, thinking: "Ava is thinking…", speaking: "Ava is speaking" }[vstate];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.25 }}
            role="dialog" aria-label="AI receptionist"
            className="fixed bottom-24 right-3 z-[70] flex h-[min(640px,calc(100dvh-8rem))] w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-6">
            <header className="flex items-center gap-3 bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4 text-white">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-500/20 ring-1 ring-brand-400/40"><Sparkles size={18} className="text-brand-300" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" /></div>
              <div className="flex-1"><p className="text-sm font-semibold">Ava</p><p className="whitespace-nowrap text-xs text-slate-400">AI receptionist · 24/7</p></div>
              <div className="flex rounded-full bg-white/10 p-0.5 text-xs" role="tablist" aria-label="Mode">
                <button role="tab" aria-selected={mode === "text"} onClick={() => setMode("text")} className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${mode === "text" ? "bg-white text-slate-900" : "text-slate-300"}`}><Keyboard size={12} />Chat</button>
                <button role="tab" aria-selected={mode === "voice"} onClick={() => setMode("voice")} className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${mode === "voice" ? "bg-white text-slate-900" : "text-slate-300"}`}><AudioLines size={12} />Talk</button>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 hover:bg-white/10"><X size={18} /></button>
            </header>

            {mode === "voice" ? (
              <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="relative flex justify-center gap-1 pt-4">
                  {(Object.keys(LANGS) as Lang[]).map((l) => <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-full px-3 py-1 text-xs ${lang === l ? "bg-brand-500 text-white" : "bg-white/10 text-slate-300 hover:bg-white/15"}`}>{LANGS[l].label}</button>)}
                </div>
                {support === "none" ? (
                  <div className="relative m-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100" role="status">
                    <p className="font-semibold">Voice isn&apos;t supported in this browser</p>
                    <p className="mt-1 text-amber-100/80">Please use Chrome, Edge or Safari for voice, or switch to Chat. Ava books the same way by text.</p>
                    <button onClick={() => setMode("text")} className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-slate-900">Switch to chat</button>
                  </div>
                ) : (
                  <div className="relative flex flex-1 flex-col items-center justify-center px-6">
                    <div className="relative">
                      {vstate === "listening" && [0, 1].map((k) => <motion.span key={k} className="absolute inset-0 rounded-full border border-brand-400/50" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.8, repeat: Infinity, delay: k * 0.9 }} />)}
                      <button onClick={vstate === "listening" ? stopListening : vstate === "speaking" ? () => { window.speechSynthesis.cancel(); setVstate("idle"); } : listen} disabled={vstate === "thinking"}
                        aria-label={vstate === "listening" ? "Stop listening" : vstate === "speaking" ? "Stop speaking" : "Start talking"}
                        className={`relative grid h-24 w-24 place-items-center rounded-full shadow-glow transition ${vstate === "listening" ? "bg-rose-500" : "bg-gradient-to-br from-brand-400 to-brand-600"} disabled:opacity-60`}>
                        {vstate === "listening" ? (support === "record" ? <Square size={28} fill="currentColor" /> : <MicOff size={30} />) : vstate === "speaking" ? <Volume2 size={30} /> : <Mic size={32} />}
                      </button>
                    </div>
                    <div className="mt-6"><Wave active={vstate === "listening" || vstate === "speaking"} level={vstate === "speaking" ? 0.6 : level} /></div>
                    <p className="text-sm font-medium" aria-live="polite">{vLabel}</p>
                    <p className="mt-3 min-h-[3rem] max-w-xs text-center text-sm text-slate-300">{interim || (vstate === "idle" && msgs.length < 2 ? `Try: “${lang === "es" ? "Quiero una limpieza el jueves por la tarde" : lang === "de" ? "Ich möchte am Donnerstag eine Reinigung" : lang === "fr" ? "Je voudrais un détartrage jeudi" : "Book me a cleaning on Thursday afternoon"}”` : "")}</p>
                  </div>
                )}
                <div className="relative max-h-48 space-y-2 overflow-y-auto border-t border-white/10 bg-black/20 p-3">
                  {msgs.slice(-4).map((m, i) => m.booking ? <BookingCardView key={i} b={m.booking} dark /> : (
                    <p key={i} className={`text-xs leading-relaxed ${m.role === "user" ? "text-right text-slate-400" : "text-slate-200"}`}><span className="font-semibold">{m.role === "user" ? "You" : "Ava"}:</span> {m.content}</p>))}
                  <div ref={end} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4" aria-live="polite">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>{m.content}</p>
                      {m.booking && <BookingCardView b={m.booking} />}
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
                  <button type="button" onClick={() => setMode("voice")} aria-label="Talk to Ava by voice" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"><Mic size={17} /></button>
                  <input id="chat-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything, in any language…" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white" />
                  <button aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50" disabled={typing}><Send size={16} /></button>
                </form>
              </>
            )}
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

function BookingCardView({ b, dark = false }: { b: BookingCard; dark?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`w-full max-w-[85%] overflow-hidden rounded-2xl border ${dark ? "border-brand-400/30 bg-brand-500/10" : "border-brand-200 bg-white shadow-soft"}`}>
      <div className={`flex items-center gap-3 px-4 py-3 ${dark ? "" : "bg-gradient-to-r from-brand-50 to-white"}`}>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><CalendarCheck2 size={17} /></div>
        <div className="flex-1"><p className={`text-[13px] font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Appointment confirmed</p><p className={`text-[11px] ${dark ? "text-slate-300" : "text-slate-500"}`}>Ref <span className="font-mono font-semibold tracking-wide">{b.ref}</span></p></div>
        <Check size={18} className="text-brand-500" />
      </div>
      <dl className={`grid grid-cols-2 gap-x-3 gap-y-1.5 border-t px-4 py-3 text-[12px] ${dark ? "border-white/10 text-slate-200" : "border-slate-100 text-slate-700"}`}>
        <dt className="opacity-60">Service</dt><dd className="text-right font-medium">{b.serviceName}</dd>
        <dt className="opacity-60">Dentist</dt><dd className="text-right font-medium">{b.dentistName.replace(/,.*/, "")}</dd>
        <dt className="opacity-60">When</dt><dd className="text-right font-medium">{fmtDate(b.date)} · {b.time}</dd>
        <dt className="opacity-60">Patient</dt><dd className="text-right font-medium">{b.name}</dd>
      </dl>
    </motion.div>
  );
}
