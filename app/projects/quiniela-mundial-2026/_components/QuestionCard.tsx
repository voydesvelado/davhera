"use client";

import { memo } from "react";
import { OptionButton } from "./OptionButton";
import type { Question } from "../_lib/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

const LETTERS = ["A", "B", "C", "D"] as const;

function QuestionCardImpl({ question, questionNumber, selectedOption, onSelectOption, disabled }: QuestionCardProps) {
  return (
    <section
      aria-labelledby={`q-${question.id}-title`}
      role="radiogroup"
      className="flex flex-col"
    >
      <p
        id={`q-${question.id}-title`}
        className="mb-5 text-[18px] font-bold leading-[1.4] text-stadium-text-primary"
      >
        <span className="sr-only">Pregunta {questionNumber}: </span>
        {question.text}
      </p>
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, index) => (
          <OptionButton
            key={option.id}
            label={option.label}
            letter={LETTERS[index] ?? `${index + 1}`}
            selected={selectedOption === option.id}
            onSelect={() => onSelectOption(option.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}

export const QuestionCard = memo(QuestionCardImpl);
