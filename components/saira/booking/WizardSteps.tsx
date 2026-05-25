"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/lib/saira/booking/context";
import { StepDate } from "./steps/StepDate";
import { StepPeople } from "./steps/StepPeople";
import { StepContact } from "./steps/StepContact";
import { StepLanguage } from "./steps/StepLanguage";
import { StepComments } from "./steps/StepComments";

const STEPS = [StepDate, StepPeople, StepContact, StepLanguage, StepComments];

export function WizardSteps() {
  const { state } = useBooking();
  const StepComponent = STEPS[state.currentStep - 1];

  return (
    <div className="saira-wizard-steps">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
