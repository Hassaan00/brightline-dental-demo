import Link from "next/link";
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Brightline Dental Studio home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill={light ? "#fff" : "#0F172A"} /><path d="M10 9c2.5-1 4.5 0 6 1 1.5-1 3.5-2 6-1 2.6 1.1 2.6 5 1.5 8.5-.9 2.8-1.6 6.5-3.3 6.5-1.6 0-1.3-4.5-4.2-4.5S13.4 24 11.8 24c-1.7 0-2.4-3.7-3.3-6.5C7.4 14 7.4 10.1 10 9z" fill="#1AA391" /></svg>
      <span className={`text-[15px] font-semibold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>Brightline<span className="font-normal text-slate-400"> Dental</span></span>
    </Link>
  );
}
