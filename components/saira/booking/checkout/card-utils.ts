export type CardField = "number" | "name" | "expiry" | "cvc";
export type CardData = Record<CardField, string>;
export type CardBrand = "visa" | "mastercard" | "amex" | "generic";

export function detectBrand(number: string): CardBrand {
  const clean = number.replace(/\s/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  return "generic";
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isCardValid(card: CardData): boolean {
  return (
    card.number.replace(/\s/g, "").length >= 13 &&
    card.name.trim().length >= 3 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvc.length >= 3
  );
}
