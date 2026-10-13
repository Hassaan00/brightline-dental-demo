"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";
const links = [["Services", "/#services"], ["Dentists", "/#dentists"], ["Insurance", "/#insurance"], ["Mobile app", "/app"], ["Dashboard", "/admin"]];
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <header className={`sticky top-0 z-50 transition ${scrolled ? "border-b border-slate-200/70 bg-white/75 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => <li key={h}><Link href={h} className="text-sm text-slate-600 transition hover:text-slate-900">{l}</Link></li>)}
        </ul>
        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+15125550142" className="text-sm text-slate-600 hover:text-slate-900">(512) 555-0142</a>
          <Link href="/book" className="btn-primary !py-2">Book now <ArrowRight size={15} /></Link>
        </div>
        <button className="rounded-full p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <ul className="container-x flex flex-col py-3">
            {links.map(([l, h]) => <li key={h}><Link onClick={() => setOpen(false)} href={h} className="block py-3 text-slate-700">{l}</Link></li>)}
            <li className="pt-2"><Link href="/book" className="btn-primary w-full">Book in 30 seconds</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
