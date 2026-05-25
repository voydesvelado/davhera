"use client";

import { BookingProvider } from "@/lib/saira/booking/context";
import { WizardProgress } from "./WizardProgress";
import { WizardSteps } from "./WizardSteps";
import { WizardNavigation } from "./WizardNavigation";
import type { Tour } from "@/lib/saira/types";

export function BookingWizard({ tour }: { tour: Tour }) {
  return (
    <BookingProvider tour={tour}>
      <main className="saira-wizard">
        <div className="saira-wizard-form">
          <WizardProgress />
          <WizardSteps />
          <WizardNavigation />
        </div>
        <aside className="saira-wizard-aside">
          {/* BookingSummary mounts at M20 */}
        </aside>
      </main>
    </BookingProvider>
  );
}
