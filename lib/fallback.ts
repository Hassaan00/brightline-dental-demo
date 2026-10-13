import { clinic, services } from "./clinic";
type Lang = "en" | "es" | "de" | "fr";
export function detectLang(t: string): Lang {
  const s = t.toLowerCase();
  if (/\b(hola|precio|cita|cuánto|cuanto|dientes|gracias|quiero|horario)\b|¿/.test(s)) return "es";
  if (/\b(hallo|termin|preis|zähne|danke|ich|möchte|öffnungszeiten|wie viel)\b/.test(s)) return "de";
  if (/\b(bonjour|prix|rendez-vous|dents|merci|je|voudrais|horaires|combien)\b/.test(s)) return "fr";
  return "en";
}
const T = {
  en: { hours: `We're open ${clinic.hours}. I can book you anytime, even now.`, book: "Happy to book you! Which service, and do you prefer mornings or afternoons? You can also tap “Book now” to pick an exact slot.", pain: "I'm sorry you're in pain. We hold same-day emergency slots ($129, exam + X-ray). Shall I reserve the next one for you? If you have swelling with fever, please call 911.", ins: "We're in-network with Delta Dental, Cigna, Aetna, MetLife, Guardian, UHC, Humana and BCBS. No insurance? Our membership is $29/month.", where: `We're at ${clinic.address}, with free parking behind the building.`, def: "I'm Ava, Brightline's AI receptionist. I can share prices, check insurance, recommend a treatment or book a visit. What can I help with?", price: "Here are our self-pay prices:" },
  es: { hours: `Abrimos L–J 7am–7pm, V 7am–4pm, S 8am–2pm. Puedo agendarle ahora mismo.`, book: "¡Con gusto! ¿Qué servicio desea y prefiere mañana o tarde?", pain: "Lamento su dolor. Tenemos citas de emergencia el mismo día ($129). ¿Le reservo la próxima?", ins: "Aceptamos Delta Dental, Cigna, Aetna, MetLife, Guardian, UHC, Humana y BCBS. Sin seguro: membresía de $29/mes.", where: `Estamos en ${clinic.address}.`, def: "Soy Ava, la recepcionista IA de Brightline. ¿Precios, seguros o una cita?", price: "Nuestros precios:" },
  de: { hours: `Geöffnet Mo–Do 7–19 Uhr, Fr 7–16 Uhr, Sa 8–14 Uhr. Ich buche Sie jederzeit ein.`, book: "Sehr gern! Welche Behandlung und lieber vormittags oder nachmittags?", pain: "Das tut mir leid. Wir haben Notfalltermine am selben Tag (129 $). Soll ich den nächsten reservieren?", ins: "Wir arbeiten mit Delta Dental, Cigna, Aetna, MetLife u. a. Ohne Versicherung: Mitgliedschaft 29 $/Monat.", where: `Adresse: ${clinic.address}.`, def: "Ich bin Ava, die KI-Rezeption von Brightline. Preise, Versicherung oder Termin?", price: "Unsere Preise:" },
  fr: { hours: `Ouvert lun–jeu 7h–19h, ven 7h–16h, sam 8h–14h. Je peux réserver à tout moment.`, book: "Avec plaisir ! Quel soin, et plutôt matin ou après-midi ?", pain: "Désolée pour la douleur. Nous avons des urgences le jour même (129 $). Je réserve le prochain créneau ?", ins: "Nous acceptons Delta Dental, Cigna, Aetna, MetLife, etc. Sans assurance : abonnement à 29 $/mois.", where: `Adresse : ${clinic.address}.`, def: "Je suis Ava, la réceptionniste IA de Brightline. Prix, assurance ou rendez-vous ?", price: "Nos tarifs :" },
};
export function fallback(msg: string): string {
  const l = detectLang(msg); const t = T[l]; const s = msg.toLowerCase();
  if (/pain|hurt|emergenc|toothache|dolor|schmerz|notfall|douleur|urgence/.test(s)) return t.pain;
  if (/price|cost|how much|\$|precio|cuánto|preis|kost|prix|combien|whiten|invisalign|implant|veneer|clean/.test(s))
    return `${t.price}\n` + services.map((x) => `• ${x.name}: ${x.from ? "from " : ""}$${x.price.toLocaleString()}`).join("\n");
  if (/book|appoint|schedule|slot|cita|agendar|termin|rendez|réserv/.test(s)) return t.book;
  if (/hour|open|time|horario|öffnung|horaire/.test(s)) return t.hours;
  if (/insur|seguro|versicher|assurance|delta|cigna|aetna/.test(s)) return t.ins;
  if (/where|address|location|park|dónde|adresse|wo /.test(s)) return t.where;
  return t.def;
}
