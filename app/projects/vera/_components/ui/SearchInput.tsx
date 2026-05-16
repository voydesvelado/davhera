"use client";

import { Search } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  trailing?: ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { trailing, style, className, ...rest },
  ref,
) {
  return (
    <div
      className={`vera-search ${className ?? ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        height: "var(--field-height-base)",
        padding: "0 var(--space-3)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        transition: "border-color var(--dur-quick) var(--ease-snap)",
      }}
    >
      <Search size={16} strokeWidth={1.75} color="var(--muted)" />
      <input
        {...rest}
        ref={ref}
        type="search"
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--ink)",
          fontSize: "var(--text-base)",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
          ...style,
        }}
      />
      {trailing}
      <style>{`
        .vera-search:focus-within { border-color: var(--accent); }
      `}</style>
    </div>
  );
});
