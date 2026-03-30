"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { products } from "@/lib/products"

function ProductCard({ product }: { product: typeof products[0] }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card"
      onClick={() => sessionStorage.setItem("grid-scroll", String(window.scrollY))}
    >
      <div className="product-card-image">
        {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 640px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="product-card-meta">
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">{product.price}</span>
      </div>
    </Link>
  )
}

export default function ProductGrid() {
  return (
    <>
      <style>{`
        .product-card {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .product-card-image {
          position: relative;
          aspect-ratio: 3/4;
          background: #f5f5f2;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .product-card-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          text-align: center;
          padding: 0 4px;
        }
        .product-card-name {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: #0c0c0c;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .product-card-price {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #a3a39f;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 32px 0px;
          width: 100%;
        }
        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 48px 32px;
          }
          .product-card-name {
            font-size: 13px;
          }
        }
      `}</style>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  )
}
