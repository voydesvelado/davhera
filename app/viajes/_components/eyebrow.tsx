import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  accent = false,
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-block",
        accent ? "text-accent" : "text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
