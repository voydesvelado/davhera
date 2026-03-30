import { notFound } from "next/navigation"
import Link from "next/link"
import { products } from "@/lib/products"
import PhotoCarousel from "./PhotoCarousel"

const WHATSAPP_NUMBER = "5491100000000" // TODO: replace with real number

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) notFound()

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa "${product.name}" (${product.price}). ¿Pueden darme más información?`)}`
  const photos = product.photos ?? [product.image]

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      background: "#fafaf7",
      fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    }}>
      {/* Nav */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid #e0e0dc",
      }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0c0c0c",
            textDecoration: "none",
          }}
        >
          ← Back
        </Link>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#a3a39f",
        }}>
          Item
        </span>
      </div>

      {/* Photos */}
      <PhotoCarousel photos={photos} name={product.name} />

      {/* Content */}
      <div style={{ padding: "20px 20px 12px", flex: 1 }}>
        {product.badge && (
          <span style={{
            display: "inline-block",
            background: "#c8ff00",
            color: "#0c0c0c",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "3px 7px",
            marginBottom: 12,
          }}>
            {product.badge}
          </span>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <h1 style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#0c0c0c",
          }}>
            {product.name}
          </h1>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0c0c0c",
            flexShrink: 0,
          }}>
            {product.price}
          </span>
        </div>

        <p style={{
          fontSize: 14,
          fontWeight: 400,
          color: "#6b6b67",
          lineHeight: 1.65,
        }}>
          {product.description}
        </p>
      </div>

      {/* CTA */}
      <div style={{ padding: "12px 20px 40px", borderTop: "1px solid #e0e0dc" }}>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#0c0c0c",
            color: "#fafaf7",
            padding: "16px",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          Me interesa
        </a>
      </div>
    </div>
  )
}
