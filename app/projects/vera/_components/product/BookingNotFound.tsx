import Link from "next/link";
import { Button } from "../ui/Button";

export function BookingNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-4)",
        textAlign: "center",
        padding: "var(--space-16) var(--space-4)",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "var(--text-3xl)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-snug)",
          color: "var(--ink)",
        }}
      >
        No encontramos esa cita
      </h1>
      <p style={{ margin: 0, fontSize: "var(--text-md)", color: "var(--muted)", maxWidth: "440px" }}>
        El enlace puede haber caducado, o estás abriendo una cita reservada en otro navegador.
        Recuerda que las reservas del demo se guardan solo en el navegador donde las hiciste.
      </p>
      <Link href="/projects/vera/dra-sofia-ramirez">
        <Button size="md">Volver al perfil de la doctora</Button>
      </Link>
    </div>
  );
}
