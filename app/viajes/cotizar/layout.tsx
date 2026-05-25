import { cn } from "@/lib/utils";
import { fraunces, inter } from "../_lib/fonts";
import "../viajes.css";

export default function CotizarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        fraunces.variable,
        inter.variable,
        "viajes-scope min-h-screen flex flex-col bg-bg text-fg font-sans antialiased",
      )}
    >
      {children}
    </div>
  );
}
