export default function Home() {
  return (
    <main style={{
      minHeight: "100dvh",
      background: "#ffffff",
      fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    }}>
      <p style={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#a3a39f",
      }}>
        Próximamente
      </p>
      <h1 style={{
        fontSize: "clamp(1.1rem, 4vw, 1.6rem)",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#0c0c0c",
        textAlign: "center",
      }}>
        Davhera
      </h1>
    </main>
  )
}
