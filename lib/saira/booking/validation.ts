import type { BookingState } from "./context";

const WHATSAPP_RE = /^\+?[\d\s\-()]{8,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isStepValid(step: number, state: BookingState): boolean {
  switch (step) {
    case 1:
      return state.date !== null;
    case 2:
      return state.people >= 1 && state.people <= 8;
    case 3: {
      const { name, whatsapp, email } = state.contact;
      return (
        name.trim().length >= 2 &&
        WHATSAPP_RE.test(whatsapp.trim()) &&
        EMAIL_RE.test(email.trim())
      );
    }
    case 4:
      return state.languagePreference !== undefined;
    case 5:
      return true;
    default:
      return false;
  }
}
