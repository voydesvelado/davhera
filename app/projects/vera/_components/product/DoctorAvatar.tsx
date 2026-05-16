"use client";

import type { Doctor } from "../../_lib/types";

interface DoctorAvatarProps {
  doctor: Doctor;
  size: number;
}

/**
 * Doctor photo with a refined SVG silhouette fallback. Uses next/image-free
 * <img> with onError to swap to the SVG; both server and client render the
 * <img> tag so no hydration mismatch.
 */
export function DoctorAvatar({ doctor, size }: DoctorAvatarProps) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--bg-sunken)",
        border: "1px solid var(--rule)",
      }}
    >
      <SilhouetteFallback />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={doctor.photoUrl}
        alt={`Foto de ${doctor.name}`}
        loading="eager"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        onError={(e) => {
          // Hide the broken image so the silhouette underneath shows through.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

function SilhouetteFallback() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        color: "var(--rule-strong)",
      }}
      aria-hidden
    >
      <rect width="100" height="100" fill="var(--bg-sunken)" />
      <circle cx="50" cy="38" r="16" fill="currentColor" opacity="0.6" />
      <path
        d="M 18 100 C 18 75, 30 64, 50 64 C 70 64, 82 75, 82 100 Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
