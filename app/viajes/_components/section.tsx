import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("py-16 lg:py-24", className)}>
      <div className={cn("mx-auto max-w-7xl px-6 lg:px-12", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
