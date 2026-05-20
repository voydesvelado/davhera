import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Case preview · David Herrera",
};

export default function PreviewPage() {
  return (
    <main
      className="
        h-dvh w-full overflow-hidden bg-white text-stone-900
        flex flex-col lg:flex-row
      "
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ─── Left: case content ─── */}
      <section
        className="
          flex-1 min-w-0
          flex flex-col justify-start lg:justify-start
          px-8 sm:px-12 lg:px-16 xl:px-20
          pt-12 lg:pt-20
          pb-8 lg:pb-20
        "
      >
        <h1
          className="
            text-4xl sm:text-5xl xl:text-6xl
            font-semibold tracking-tight leading-[1.05]
            text-stone-900
          "
          style={{ fontFamily: "var(--font-display)" }}
        >
          Case title
        </h1>
        <p className="mt-4 text-base sm:text-lg text-stone-500 leading-relaxed max-w-md">
          Secciión para contenido del case
        </p>
      </section>

      {/* ─── Right: gray panel with phone mockup ─── */}
      <aside
        className="
          relative shrink-0
          bg-[#EAEAEA]
          w-full lg:w-[64.8vw]
          h-[min(100dvw,640px)] lg:h-dvh
          flex items-center justify-center
          px-4 lg:px-6
        "
      >
        <PhoneMockup />
      </aside>
    </main>
  );
}

function PhoneMockup() {
  // Outer phone: 390 × 844. Inner image: 370 × 804.
  // Height is capped by 844px and the viewport height (leaving breathing room
  // so the phone is always fully visible on MacBook Air through MacBook Pro 16").
  // Width is derived from the 390/844 aspect ratio, then clamped by container
  // width too (max-w-full) to handle narrow lg breakpoints.
  return (
    <div
      className="
        relative shrink-0 max-w-full
        bg-white rounded-[44px]
        shadow-[0_0_0_1px_rgba(28,25,23,0.06),0_20px_60px_-15px_rgba(28,25,23,0.18)]
      "
      style={{
        // Phone scales with viewport height so the ratio between phone and panel
        // matches the 844/982 spec (≈86% of viewport height). Capped at 1040px
        // for very tall displays so it never becomes oversized.
        aspectRatio: "390 / 844",
        height: "min(1040px, calc(100dvh * 0.86))",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[44px]"
        style={{
          // 10/390 ≈ 2.56% horizontal inset, 20/844 ≈ 2.37% vertical inset
          paddingInline: "2.56%",
          paddingBlock: "2.37%",
        }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-[36px] bg-stone-50">
          <Image
            src="/case-studies/menura/menu.png"
            alt="Menura menu preview"
            fill
            priority
            sizes="(min-width: 1024px) 390px, 90vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
