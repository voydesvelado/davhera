import Link from "next/link";
import type { Doctor } from "../../_lib/types";
import { Button } from "../ui/Button";
import { CredentialBadge } from "./CredentialBadge";
import { LocationPill } from "./LocationPill";
import { NextSlotPill } from "./NextSlotPill";
import { DoctorAvatar } from "./DoctorAvatar";

interface ProfileHeroProps {
  doctor: Doctor;
  reservarHref: string;
}

export function ProfileHero({ doctor, reservarHref }: ProfileHeroProps) {
  const cityShort =
    doctor.location.type === "in_person"
      ? doctor.location.address.split("\n")[1] ?? doctor.location.city
      : "Online";

  return (
    <section
      className="vera-profile-hero"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "var(--space-5)",
        paddingTop: "var(--space-12)",
        paddingBottom: "var(--space-8)",
        alignItems: "start",
      }}
    >
      <div className="vera-profile-photo">
        <DoctorAvatar doctor={doctor} size={120} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <h1
          className="vera-profile-name"
          style={{
            margin: 0,
            fontSize: "var(--text-3xl)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--ink)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {doctor.name}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            {doctor.specialty}
          </span>
          <CredentialBadge cedula={doctor.cedula} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            flexWrap: "wrap",
            marginTop: "var(--space-1)",
          }}
        >
          <LocationPill>{cityShort}</LocationPill>
          <LocationPill variant="languages">{doctor.languages.join(" · ")}</LocationPill>
        </div>

        <div style={{ marginTop: "var(--space-2)" }}>
          <NextSlotPill doctorId={doctor.id} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "var(--space-3)",
          }}
        >
          <Link href={reservarHref}>
            <Button size="md">
              Reservar cita
              <span aria-hidden>→</span>
            </Button>
          </Link>
          {doctor.instagram ? (
            <a
              href={`https://instagram.com/${doctor.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1_5)",
                fontSize: "var(--text-sm)",
                color: "var(--ink-soft)",
                textDecoration: "none",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-sm)",
              }}
              className="vera-instagram-link"
            >
              <InstagramGlyph size={16} />
              {doctor.instagram}
              <style>{`
                .vera-instagram-link:hover { color: var(--ink); background: var(--bg-sunken); }
              `}</style>
            </a>
          ) : null}
        </div>
      </div>

      <style>{`
        .vera-profile-hero {
          animation: vera-hero-in var(--dur-smooth) var(--ease-snap) both;
        }
        @keyframes vera-hero-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vera-profile-hero { animation: none; }
        }
        @media (min-width: 768px) {
          .vera-profile-hero {
            grid-template-columns: 200px 1fr;
            gap: var(--space-8);
            padding-top: var(--space-16);
          }
          .vera-profile-photo > div { width: 200px !important; height: 200px !important; }
          .vera-profile-name { font-size: var(--text-4xl) !important; }
        }
      `}</style>
    </section>
  );
}

function InstagramGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
