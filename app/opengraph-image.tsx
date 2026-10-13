import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "Brightline Dental Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#ffffff 0%,#EEFBF8 55%,#AEEADE 100%)", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", color: "#3FBFAB", fontSize: 32, fontWeight: 700 }}>B</div>
        <div style={{ fontSize: 30, color: "#0F172A", fontWeight: 600 }}>Brightline Dental Studio</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, color: "#0F172A", lineHeight: 1.05, letterSpacing: -2 }}>Dentistry that feels</div>
        <div style={{ fontSize: 76, color: "#0F8476", lineHeight: 1.05, letterSpacing: -2 }}>calm, clear and modern.</div>
        <div style={{ fontSize: 28, color: "#475569", marginTop: 24 }}>Austin, TX · Book in 30 seconds with our 24/7 AI receptionist</div>
      </div>
    </div>, size);
}
