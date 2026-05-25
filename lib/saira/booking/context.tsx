"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Tour } from "@/lib/saira/types";

export type LanguagePreference = "pt" | "en" | "es" | "it" | "any";
export type BookingPhase = "form" | "checkout" | "processing";
export type PaymentMethod = "pix" | "card";

export type BookingState = {
  tour: Tour;
  currentStep: number;
  date: Date | null;
  people: number;
  contact: {
    name: string;
    whatsapp: string;
    email: string;
  };
  languagePreference: LanguagePreference;
  comments: string;
  phase: BookingPhase;
  paymentMethod: PaymentMethod | null;
};

export type BookingAction =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GO_TO"; step: number }
  | { type: "SET_DATE"; date: Date | null }
  | { type: "SET_PEOPLE"; people: number }
  | {
      type: "SET_CONTACT";
      field: keyof BookingState["contact"];
      value: string;
    }
  | { type: "SET_LANGUAGE"; language: LanguagePreference }
  | { type: "SET_COMMENTS"; comments: string }
  | { type: "GO_TO_CHECKOUT" }
  | { type: "BACK_TO_FORM" }
  | { type: "SET_PAYMENT_METHOD"; method: PaymentMethod }
  | { type: "START_PROCESSING" };

export const TOTAL_STEPS = 5;

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
      };
    case "BACK":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case "GO_TO":
      return {
        ...state,
        currentStep: Math.min(Math.max(action.step, 1), TOTAL_STEPS),
      };
    case "SET_DATE":
      return { ...state, date: action.date };
    case "SET_PEOPLE":
      return { ...state, people: action.people };
    case "SET_CONTACT":
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
      };
    case "SET_LANGUAGE":
      return { ...state, languagePreference: action.language };
    case "SET_COMMENTS":
      return { ...state, comments: action.comments };
    case "GO_TO_CHECKOUT":
      // Defaulteamos a Pix porque es el método más usado en Brasil.
      return {
        ...state,
        phase: "checkout",
        paymentMethod: state.paymentMethod ?? "pix",
      };
    case "BACK_TO_FORM":
      // El state del wizard se preserva intacto al volver.
      return { ...state, phase: "form" };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.method };
    case "START_PROCESSING":
      return { ...state, phase: "processing" };
    default:
      return state;
  }
}

type BookingContextValue = {
  state: BookingState;
  dispatch: Dispatch<BookingAction>;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
  tour,
  children,
}: {
  tour: Tour;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    tour,
    currentStep: 1,
    date: null,
    people: 2,
    contact: { name: "", whatsapp: "", email: "" },
    languagePreference: "any",
    comments: "",
    phase: "form",
    paymentMethod: null,
  });

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

/** Helper compartido por checkout para snapshot la reserva confirmada. */
export type ConfirmedBookingSnapshot = {
  tour: Tour;
  date: string | null;
  people: number;
  contact: BookingState["contact"];
  languagePreference: LanguagePreference;
  paymentMethod: PaymentMethod;
  comments: string;
  confirmedAt: string;
};

export const CONFIRMED_BOOKING_KEY = "saira_booking_confirmed";

export function snapshotBooking(
  state: BookingState,
  paymentMethod: PaymentMethod,
): ConfirmedBookingSnapshot {
  return {
    tour: state.tour,
    date: state.date ? state.date.toISOString() : null,
    people: state.people,
    contact: state.contact,
    languagePreference: state.languagePreference,
    paymentMethod,
    comments: state.comments,
    confirmedAt: new Date().toISOString(),
  };
}
