import Link from "next/link";
import Logo from "./Logo";
import { clinic } from "@/lib/clinic";
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">Calm, modern dentistry on South Congress. Transparent pricing, same-day emergencies and a receptionist that never sleeps.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Visit</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{clinic.address}</p>
          <p className="mt-2 text-sm text-slate-500"><a href="tel:+15125550142" className="hover:text-slate-900">{clinic.phone}</a><br /><a href={`mailto:${clinic.email}`} className="hover:text-slate-900">{clinic.email}</a></p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href="/book" className="hover:text-slate-900">Book online</Link></li>
            <li><Link href="/app" className="hover:text-slate-900">Mobile app</Link></li>
            <li><Link href="/admin" className="hover:text-slate-900">Clinic dashboard</Link></li>
            <li><Link href="/#faq" className="hover:text-slate-900">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-slate-200 py-6 text-xs text-slate-400 sm:flex-row">
        <p>© {new Date().getFullYear()} Brightline Dental Studio. Demo website. Fictional clinic.</p>
        <p>Privacy · HIPAA notice · Accessibility</p>
      </div>
    </footer>
  );
}
