import { notFound } from "next/navigation"
import Link from "next/link"
import { products } from "@/lib/products"
import PhotoCarousel from "./PhotoCarousel"

const WHATSAPP_NUMBER = "526641265999"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) notFound()

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa tu "${product.name}"`)}`
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
          href="/shop"
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fafaf7" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Me interesa
        </a>
      </div>
    </div>
  )
}
