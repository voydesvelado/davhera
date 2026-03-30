import ProductGrid from "@/components/ProductGrid"
import ScrollRestorer from "@/components/ScrollRestorer"

export default function Home() {
  return (
    <main style={{
      minHeight: "100dvh",
      background: "#ffffff",
      fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "32px 24px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        borderBottom: "1px solid #e8e8e5",
        marginBottom: 0,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#a3a39f",
        }}>
          DAVE'S STORE
        </p>
        <h1 style={{
          fontSize: "clamp(1.1rem, 4vw, 1.6rem)",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#0c0c0c",
          textAlign: "center",
        }}>
          Objetos en Venta
        </h1>
      </div>

      {/* Grid */}
      <div style={{ padding: "40px 20px 100px" }}>
        <ScrollRestorer />
        <ProductGrid />
      </div>
    </main>
  )
}
