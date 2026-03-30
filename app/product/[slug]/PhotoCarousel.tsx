"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

export default function PhotoCarousel({ photos, name }: { photos: string[]; name: string }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState<boolean[]>(photos.map(() => false))
  const containerRef = useRef<HTMLDivElement>(null)

  function onScroll() {
    const el = containerRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.offsetWidth)
    setIndex(i)
  }

  function markLoaded(i: number) {
    setLoaded((prev) => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  if (photos.length === 1) {
    return (
      <div style={{ position: "relative", aspectRatio: "1/1", width: "100%" }}>
        {!loaded[0] && <Skeleton className="absolute inset-0 rounded-none" />}
        <Image
          src={photos[0]}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
          priority
          onLoad={() => markLoaded(0)}
        />
      </div>
    )
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {photos.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              flexShrink: 0,
              width: "100%",
              aspectRatio: "1/1",
              scrollSnapAlign: "start",
            }}
          >
            {!loaded[i] && <Skeleton className="absolute inset-0 rounded-none" />}
            <Image
              src={src}
              alt={`${name} ${i + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
              priority={i === 0}
              onLoad={() => markLoaded(i)}
            />
          </div>
        ))}
      </div>

      {/* Counter pill */}
      <div style={{
        position: "absolute",
        bottom: 12,
        right: 14,
        background: "rgba(12,12,12,0.65)",
        backdropFilter: "blur(6px)",
        color: "#fafaf7",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        padding: "4px 10px",
        pointerEvents: "none",
      }}>
        {index + 1} / {photos.length}
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute",
        bottom: 14,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 5,
        pointerEvents: "none",
      }}>
        {photos.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 16 : 5,
              height: 5,
              borderRadius: 99,
              background: i === index ? "#c8ff00" : "rgba(255,255,255,0.45)",
              transition: "width 0.25s ease, background 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  )
}
