import { cn } from "@/lib/utils";
import { fraunces, inter } from "./_lib/fonts";
import { Nav } from "./_components/nav";
import { Footer } from "./_components/footer";
import { WhatsAppFab } from "./_components/whatsapp-fab";
import "./viajes.css";

export default function ViajesLayout({
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
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
