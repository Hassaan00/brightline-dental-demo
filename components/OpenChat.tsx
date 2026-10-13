"use client";
export default function OpenChat({ children, className }: { children: React.ReactNode; className?: string }) {
  return <button className={className} onClick={() => window.dispatchEvent(new Event("open-chat"))}>{children}</button>;
}
