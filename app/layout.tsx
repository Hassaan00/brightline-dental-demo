import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://brightline-dental-demo.vercel.app"),
  title: { default: "Brightline Dental Studio · Modern Dentistry in Austin, TX", template: "%s · Brightline Dental Studio" },
  description: "Calm, modern dentistry in South Congress, Austin. Transparent pricing, same-day emergencies and a 24/7 AI receptionist that books you in 30 seconds.",
  keywords: ["dentist Austin", "Invisalign Austin", "teeth whitening", "dental implants", "emergency dentist"],
  openGraph: { title: "Brightline Dental Studio", description: "Book in 30 seconds with our 24/7 AI receptionist.", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

const jsonLd = { "@context": "https://schema.org", "@type": "Dentist", name: "Brightline Dental Studio", telephone: "+1-512-555-0142",
  address: { "@type": "PostalAddress", streetAddress: "1100 S Congress Ave, Suite 210", addressLocality: "Austin", addressRegion: "TX", postalCode: "78704", addressCountry: "US" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1284" } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        {children}
        <ChatWidget />
        <CookieBanner />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
