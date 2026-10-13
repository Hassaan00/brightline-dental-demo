import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { brand: { 50:"#EEFBF8",100:"#D5F5EE",200:"#AEEADE",300:"#79D9C8",400:"#3FBFAB",500:"#1AA391",600:"#0F8476",700:"#0F6A60",800:"#10554E",900:"#0F4641" } },
    fontFamily: { sans: ["var(--font-inter)","system-ui","sans-serif"], display: ["var(--font-display)","Georgia","serif"] },
    boxShadow: { soft: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px -8px rgba(15,23,42,.08)", glow: "0 20px 60px -20px rgba(26,163,145,.45)" },
  } }, plugins: [] };
export default config;
