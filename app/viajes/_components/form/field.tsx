import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & { id: string };
};

const inputClasses =
  "w-full rounded-md border border-border-token bg-bg-elevated px-4 py-3 text-body text-fg placeholder:text-fg-subtle transition-colors duration-200 focus:border-accent outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Field({ label, error, hint, className, inputProps }: FieldProps) {
  const describedBy = [
    hint ? `${inputProps.id}-hint` : null,
    error ? `${inputProps.id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={inputProps.id}
        className="block text-eyebrow text-fg-muted mb-2"
      >
        {label}
      </label>
      <input
        {...inputProps}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          inputClasses,
          error ? "border-accent focus:border-accent" : null,
          inputProps.className,
        )}
      />
      {hint ? (
        <p id={`${inputProps.id}-hint`} className="mt-2 text-body-sm text-fg-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${inputProps.id}-error`}
          className="mt-2 text-body-sm text-accent"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
