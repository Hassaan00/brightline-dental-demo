import Link from "next/link";
import { ArrowRight, ShieldCheck, Star, Clock, Sparkles, CalendarCheck2, MessageSquareText, BellRing, MapPin, Phone, Award, Languages, Check } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HeroChat from "@/components/HeroChat";
import Faq from "@/components/Faq";
import OpenChat from "@/components/OpenChat";
import { services, dentists, insurers, clinic } from "@/lib/clinic";

const reviews = [
  { n: "Sarah K.", s: "Booked at midnight", t: "I messaged at midnight with a cracked tooth and had a 9am slot confirmed in under a minute. The team was calm, kind and the price matched exactly what the site said." },
  { n: "Daniel R.", s: "Invisalign patient", t: "Dr. Patel showed me a 3D preview of my smile on the first visit. The app reminds me to switch aligners. Honestly the most modern clinic I've been to." },
  { n: "Lucía M.", s: "Habla español", t: "Pude hacer mi cita en español con la asistente. Todo fue clarísimo, sin sorpresas en el precio. ¡Mis hijos ya no le tienen miedo al dentista!" },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="grid-bg absolute inset-0 -z-10" />
          <div className="absolute left-1/2 top-[-10rem] -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-100 via-sky-50 to-transparent opacity-80 blur-3xl" />
          <div className="container-x grid items-center gap-14 pb-20 pt-12 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
            <div>
              <Reveal><span className="eyebrow"><Sparkles size={13} /> Now booking 24/7 with our AI receptionist</span></Reveal>
              <Reveal delay={0.05}><h1 className="mt-6 font-display text-[2.7rem] leading-[1.04] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.4rem]">Dentistry that feels <span className="italic text-brand-600">calm,</span> clear and modern.</h1></Reveal>
              <Reveal delay={0.1}><p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">Award-winning care on South Congress, Austin. Transparent prices, same-day emergencies, and a receptionist who answers in seconds, even at midnight.</p></Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/book" className="btn-primary !px-6 !py-3.5 text-[15px]">Book in 30 seconds <ArrowRight size={16} /></Link>
                  <OpenChat className="btn-ghost !px-6 !py-3.5 text-[15px]"><MessageSquareText size={16} /> Chat with Ava</OpenChat>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-slate-600 sm:flex sm:flex-wrap sm:items-center">
                  <li className="flex items-center gap-2"><span className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span><span className="whitespace-nowrap"><b className="text-slate-900">4.9</b> · 1,284</span></li>
                  <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-brand-600" /> HIPAA compliant</li>
                  <li className="flex items-center gap-2"><Award size={16} className="text-brand-600" /> ADA member</li>
                  <li className="flex items-center gap-2"><Languages size={16} className="text-brand-600" /> EN · ES · DE · FR</li>
                </ul>
              </Reveal>
            </div>
            <Reveal delay={0.15}><HeroChat /></Reveal>
          </div>
        </section>

        {/* LOGO STRIP */}
        <section className="border-y border-slate-200/70 bg-slate-50/50" aria-label="Featured in">
          <div className="container-x flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-7 text-sm font-semibold tracking-wide text-slate-400">
            <span>AUSTIN MONTHLY · TOP DENTIST 2026</span><span>INVISALIGN DIAMOND</span><span>GOOGLE 4.9 ★</span><span>CEREC SAME-DAY CROWNS</span>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="container-x scroll-mt-20 py-24">
          <Reveal><div className="max-w-2xl"><span className="eyebrow">Services & pricing</span><h2 className="h2 mt-4">Honest prices. Up front. No surprises.</h2><p className="mt-4 text-slate-600">Self-pay rates shown below. With insurance, you'll get an exact estimate before treatment starts.</p></div></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.04}>
                <article className="group h-full rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft">
                  <div className="flex items-start justify-between"><h3 className="text-[17px] font-semibold text-slate-900">{s.name}</h3><span className="text-xs text-slate-400">{s.duration} min</span></div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  <div className="mt-6 flex items-end justify-between">
                    <p className="font-display text-3xl text-slate-900">{s.from && <span className="mr-1 font-sans text-xs text-slate-400">from</span>}${s.price.toLocaleString()}</p>
                    <Link href={`/book?service=${s.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 opacity-80 transition group-hover:opacity-100" aria-label={`Book ${s.name}`}>Book <ArrowRight size={14} /></Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-slate-950 py-24 text-white">
          <div className="container-x">
            <Reveal><div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-brand-300">How it works</span><h2 className="mt-4 font-display text-3xl tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">From “ouch” to booked in under a minute.</h2></div></Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[{ i: MessageSquareText, t: "Message us, any time", d: "Website, text or WhatsApp, in your language. Ava answers instantly, day or night." },
                { i: CalendarCheck2, t: "Pick a real slot", d: "Live availability across all four dentists, with insurance checked before you arrive." },
                { i: BellRing, t: "Arrive prepared", d: "Smart reminders, digital forms and directions. You just show up and smile." }].map((x, k) => (
                <Reveal key={k} delay={k * 0.08}>
                  <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                    <span className="absolute right-6 top-6 font-display text-5xl text-white/10">0{k + 1}</span>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/30"><x.i size={20} /></div>
                    <h3 className="mt-6 text-lg font-semibold">{x.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{x.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* DENTISTS */}
        <section id="dentists" className="container-x scroll-mt-20 py-24">
          <Reveal><div className="max-w-2xl"><span className="eyebrow">Meet the dentists</span><h2 className="h2 mt-4">Specialists who explain, not upsell.</h2></div></Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {dentists.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.05}>
                <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <div className={`relative aspect-[4/5] bg-gradient-to-br ${d.hue}`}>
                    <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full" aria-hidden="true">
                      <circle cx="100" cy="98" r="42" fill="white" fillOpacity=".55" />
                      <path d="M28 250c4-58 36-88 72-88s68 30 72 88z" fill="white" fillOpacity=".55" />
                      <path d="M78 170l22 26 22-26" stroke="white" strokeOpacity=".9" strokeWidth="3" fill="none" />
                    </svg>
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 backdrop-blur">{d.years} yrs experience</span>
                  </div>
                  <div className="p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-900 sm:text-[15px]">{d.name}</h3><p className="mt-1 text-xs text-slate-500 sm:text-sm">{d.role}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* INSURANCE */}
        <section id="insurance" className="scroll-mt-20 bg-slate-50/70 py-24">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal><span className="eyebrow">Insurance accepted</span><h2 className="h2 mt-4">In-network with the plans Austin uses.</h2><p className="mt-4 max-w-lg text-slate-600">Not insured? The Brightline Membership is <b className="text-slate-900">$29/month</b> for two cleanings, exams, X-rays and 15% off everything. 0% financing available via CareCredit and Sunbit.</p>
              <OpenChat className="btn-ghost mt-8">Check my coverage with Ava <ArrowRight size={15} /></OpenChat></Reveal>
            <Reveal delay={0.1}><ul className="grid grid-cols-2 gap-3">{insurers.map((n) => <li key={n} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700"><Check size={15} className="text-brand-600" />{n}</li>)}</ul></Reveal>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container-x py-24">
          <Reveal><div className="text-center"><span className="eyebrow">Patient stories</span><h2 className="h2 mx-auto mt-4 max-w-2xl">Rated 4.9 by 1,284 Austin patients.</h2></div></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
                  <div className="flex text-amber-400" aria-label="5 out of 5 stars">{[...Array(5)].map((_, k) => <Star key={k} size={15} fill="currentColor" />)}</div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">“{r.t}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{r.n[0]}</span><span><span className="block text-sm font-semibold">{r.n}</span><span className="text-xs text-slate-500">{r.s}</span></span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container-x scroll-mt-20 grid gap-12 pb-24 lg:grid-cols-[1fr_1.4fr]">
          <Reveal><span className="eyebrow">FAQ</span><h2 className="h2 mt-4">Good questions.</h2><p className="mt-4 text-slate-600">Still curious? Ava answers anything in seconds, in four languages.</p></Reveal>
          <Reveal delay={0.08}><Faq /></Reveal>
        </section>

        {/* LOCATION */}
        <section className="container-x pb-24">
          <Reveal>
            <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white lg:grid-cols-[1fr_1.3fr]">
              <div className="p-8 sm:p-12">
                <span className="eyebrow">Visit us</span><h2 className="h2 mt-4">On South Congress, with free parking.</h2>
                <ul className="mt-8 space-y-4 text-sm text-slate-600">
                  <li className="flex gap-3"><MapPin size={18} className="shrink-0 text-brand-600" />{clinic.address}</li>
                  <li className="flex gap-3"><Clock size={18} className="shrink-0 text-brand-600" />{clinic.hours}</li>
                  <li className="flex gap-3"><Phone size={18} className="shrink-0 text-brand-600" />{clinic.phone}</li>
                </ul>
                <Link href="/book" className="btn-primary mt-8">Book your visit <ArrowRight size={15} /></Link>
              </div>
              <div className="relative min-h-[300px] bg-[#EEF2F1]" role="img" aria-label="Map showing Brightline Dental Studio on South Congress Avenue, Austin">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="600" height="400" fill="#EEF2F1" />
                  <path d="M0 300 C150 270 220 330 380 290 S560 250 600 270 L600 400 L0 400Z" fill="#CFE7F0" />
                  <g stroke="#fff" strokeWidth="14" fill="none"><path d="M300 0 L280 400" /><path d="M0 120 L600 150" /><path d="M0 220 L600 200" /></g>
                  <g stroke="#fff" strokeWidth="6" fill="none"><path d="M120 0 L100 400" /><path d="M460 0 L470 400" /><path d="M0 60 L600 70" /></g>
                  <g fill="#DDE7E3"><rect x="140" y="80" width="120" height="30" rx="6" /><rect x="320" y="85" width="120" height="50" rx="6" /><rect x="140" y="140" width="120" height="70" rx="6" /><rect x="490" y="90" width="90" height="100" rx="6" /></g>
                  <rect x="320" y="160" width="120" height="30" rx="6" fill="#C9E9DD" />
                  <text x="292" y="30" fontSize="11" fill="#94A3B8" transform="rotate(-87 292 30)">S Congress Ave</text>
                </svg>
                <div className="absolute left-[48%] top-[42%] -translate-x-1/2 -translate-y-full">
                  <div className="glass whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold">Brightline Dental Studio</div>
                  <div className="mx-auto mt-1 h-4 w-4 rounded-full border-4 border-white bg-brand-600 shadow-glow" />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="container-x pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-16 text-center text-white sm:px-16">
              <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top,rgba(26,163,145,.35),transparent_60%)]" />
              <div className="relative"><h2 className="mx-auto max-w-2xl font-display text-3xl tracking-tight sm:text-5xl">Your next visit is 30 seconds away.</h2>
                <p className="mx-auto mt-4 max-w-lg text-slate-400">Book online, chat with Ava, or download the Brightline app for reminders and rewards.</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/book" className="btn-primary !bg-white !text-slate-900 hover:!bg-slate-100">Book now <ArrowRight size={15} /></Link><Link href="/app" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium hover:bg-white/10">See the app</Link></div></div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
