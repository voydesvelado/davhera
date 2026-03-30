"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

export default function PhotoCarousel({ photos, name }: { photos: string[]; name: string }) {
  const [loaded, setLoaded] = useState<boolean[]>(photos.map(() => false))
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  const setSlideRef = useCallback(
    (i: number) => (node: HTMLDivElement | null) => {
      slideRefs.current[i] = node
    },
    []
  )

  // ── Counter logic: NO React state, direct DOM writes ──
  useEffect(() => {
    const el = containerRef.current
    const pill = pillRef.current
    if (!el || !pill || photos.length <= 1) return

    let currentIndex = 0
    let rafId: number | null = null
    let polling = false
    let lastSL = -1
    let stableFrames = 0

    function writePill(i: number) {
      if (i === currentIndex) return
      currentIndex = i
      // Direct DOM write — bypasses React reconciliation entirely
      pill.textContent = `${i + 1} / ${photos.length}`
    }

    function findClosestSlide(): number {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < slideRefs.current.length; i++) {
        const s = slideRefs.current[i]
        if (!s) continue
        const sr = s.getBoundingClientRect()
        const d = Math.abs(sr.left + sr.width / 2 - cx)
        if (d < bestD) { bestD = d; best = i }
      }
      return best
    }

    function poll() {
      const sl = el!.scrollLeft
      if (sl === lastSL) {
        stableFrames++
        if (stableFrames > 12) {
          // Settled — final update
          writePill(findClosestSlide())
          polling = false
          return
        }
      } else {
        stableFrames = 0
        // Live update while scrolling
        writePill(findClosestSlide())
      }
      lastSL = sl
      rafId = requestAnimationFrame(poll)
    }

    function startPoll() {
      if (polling) return
      polling = true
      lastSL = -1
      stableFrames = 0
      rafId = requestAnimationFrame(poll)
    }

    // Attach to EVERY event that could indicate interaction
    el.addEventListener("scroll", startPoll, { passive: true })
    el.addEventListener("touchstart", startPoll, { passive: true })
    el.addEventListener("touchmove", startPoll, { passive: true })
    el.addEventListener("touchend", startPoll, { passive: true })
    // Pointer events as extra fallback
    el.addEventListener("pointerdown", startPoll, { passive: true })
    el.addEventListener("pointermove", startPoll, { passive: true })
    el.addEventListener("pointerup", startPoll, { passive: true })

    return () => {
      el.removeEventListener("scroll", startPoll)
      el.removeEventListener("touchstart", startPoll)
      el.removeEventListener("touchmove", startPoll)
      el.removeEventListener("touchend", startPoll)
      el.removeEventListener("pointerdown", startPoll)
      el.removeEventListener("pointermove", startPoll)
      el.removeEventListener("pointerup", startPoll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [photos.length])

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
            ref={setSlideRef(i)}
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

      {/* Counter pill — NOT driven by React state.
          textContent is written directly via pillRef.
          transform: translate3d forces its own compositing layer
          so iOS Safari actually repaints it. */}
      <div
        ref={pillRef}
        style={{
          position: "absolute",
          bottom: 12,
          right: 14,
          background: "rgba(12,12,12,0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          color: "#fafaf7",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          padding: "4px 10px",
          pointerEvents: "none",
          // Force own compositing layer — iOS Safari repaint fix
          transform: "translate3d(0,0,0)",
          willChange: "contents",
        }}
      >
        1 / {photos.length}
      </div>
    </div>
  )
}
