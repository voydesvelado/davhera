"use client";

import { BookingProvider, useBooking } from "@/lib/saira/booking/context";
import { WizardProgress } from "./WizardProgress";
import { WizardSteps } from "./WizardSteps";
import { WizardNavigation } from "./WizardNavigation";
import { BookingSummary } from "./BookingSummary";
import { Checkout } from "./checkout/Checkout";
import type { Tour } from "@/lib/saira/types";

export function BookingWizard({ tour }: { tour: Tour }) {
  return (
    <BookingProvider tour={tour}>
      <WizardContent />
    </BookingProvider>
  );
}

function WizardContent() {
  const { state } = useBooking();
  const isForm = state.phase === "form";

  return (
    <main className="saira-wizard">
      <div className="saira-wizard-form">
        {isForm ? (
          <>
            <WizardProgress />
            <WizardSteps />
            <WizardNavigation />
          </>
        ) : (
          <Checkout />
        )}
      </div>
      <aside className="saira-wizard-aside">
        <BookingSummary />
      </aside>
    </main>
  );
}
