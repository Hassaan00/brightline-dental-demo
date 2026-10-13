export const clinic = {
  name: "Brightline Dental Studio",
  phone: "(512) 555-0142",
  email: "hello@brightlinedental.com",
  address: "1100 S Congress Ave, Suite 210, Austin, TX 78704",
  hours: "Mon–Thu 7am–7pm · Fri 7am–4pm · Sat 8am–2pm · Sun closed",
};
export const services = [
  { id: "cleaning", name: "Exam & Cleaning", price: 149, from: false, duration: 60, desc: "Comprehensive exam, digital X-rays and a gentle hygienist cleaning." },
  { id: "whitening", name: "Professional Whitening", price: 399, from: false, duration: 75, desc: "In-office whitening, up to 8 shades brighter in one visit." },
  { id: "invisalign", name: "Invisalign® Clear Aligners", price: 3900, from: true, duration: 45, desc: "3D scan, smile preview and a custom aligner plan. Financing from $129/mo." },
  { id: "implant", name: "Dental Implant", price: 3200, from: true, duration: 90, desc: "Titanium implant, abutment and crown, placed with guided surgery." },
  { id: "veneers", name: "Porcelain Veneers", price: 1150, from: true, duration: 90, desc: "Handcrafted veneers designed with digital smile design. Per tooth." },
  { id: "emergency", name: "Emergency Visit", price: 129, from: false, duration: 30, desc: "Same-day pain relief, exam and X-ray. Booked within 2 hours." },
];
export const dentists = [
  { id: "chen", name: "Dr. Olivia Chen, DDS", role: "Cosmetic & Restorative", years: 12, initials: "OC", hue: "from-brand-200 to-brand-400" },
  { id: "ramirez", name: "Dr. Marcus Ramirez, DMD", role: "Implants & Oral Surgery", years: 15, initials: "MR", hue: "from-sky-200 to-indigo-300" },
  { id: "patel", name: "Dr. Anika Patel, DDS", role: "Orthodontics · Invisalign", years: 9, initials: "AP", hue: "from-amber-100 to-rose-300" },
  { id: "brooks", name: "Dr. James Brooks, DDS", role: "Family & Pediatric", years: 11, initials: "JB", hue: "from-violet-200 to-fuchsia-300" },
];
export const insurers = ["Delta Dental", "Cigna", "Aetna", "MetLife", "Guardian", "United Healthcare", "Humana", "BlueCross BlueShield"];
export const faqs = [
  { q: "Do you take new patients and walk-ins?", a: "Yes. New patients are always welcome, and the AI receptionist can usually book you within 48 hours. Emergencies are seen the same day." },
  { q: "What if I don't have insurance?", a: "Our Brightline Membership is $29/month and covers two cleanings, exams, X-rays and 15% off all treatment. We also offer 0% financing through CareCredit and Sunbit." },
  { q: "Can I book outside office hours?", a: "Anytime. Our AI receptionist answers on the website, by text and on WhatsApp 24/7, in English, Spanish, German and French, and books straight into our calendar." },
  { q: "How does pricing work?", a: "Prices shown are our self-pay rates. After your exam you get a written treatment plan with exact costs and your insurance estimate before anything starts." },
  { q: "Is my data safe?", a: "All patient data is encrypted and handled in line with HIPAA. Chat transcripts are stored securely and never sold or shared." },
];
