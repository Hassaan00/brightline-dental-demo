"use client";
export default function OpenChat({ children, className, voice = false }: { children: React.ReactNode; className?: string; voice?: boolean }) {
  return <button className={className} onClick={() => window.dispatchEvent(new Event(voice ? "open-voice" : "open-chat"))}>{children}</button>;
}
