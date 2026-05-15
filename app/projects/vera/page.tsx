import { PageShell } from "./_components/PageShell";
import { EditorialCover } from "./_components/EditorialCover";
import { Eyebrow } from "./_components/Eyebrow";
import { ModePicker } from "./_components/ModePicker";
import { PullQuote } from "./_components/PullQuote";
import { ProseBlock } from "./_components/ProseBlock";
import { SectionHeader } from "./_components/SectionHeader";
import { EditorialFooter } from "./_components/EditorialFooter";
import { landing } from "./_lib/copy";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vera · Una plataforma de reservas para la doctora independiente",
  description:
    "Investigada, diseñada y construida de principio a fin, en código. Una pieza de portafolio de Davhera.",
};

export default function VeraLandingPage() {
  return (
    <PageShell mode="editorial">
      <EditorialCover
        metaLeft={landing.cover.metaLeft.map((m) => (
          <span key={m}>{m}</span>
        ))}
        metaRight={landing.cover.metaRight.map((m) => (
          <span key={m}>{m}</span>
        ))}
        eyebrow={landing.cover.eyebrow}
        titleLines={[...landing.cover.titleLines]}
        title=""
        deck={landing.cover.deck}
        footMeta={landing.cover.footMeta}
      />

      {/* SECTION — Mode picker */}
      <section style={{ marginTop: "var(--space-16)" }}>
        <div style={{ marginBottom: "var(--space-6)" }}>
          <Eyebrow>{landing.modePicker.eyebrow}</Eyebrow>
        </div>
        <ProseBlock>
          <p>{landing.modePicker.intro}</p>
        </ProseBlock>
        <ModePicker />
      </section>

      {/* SECTION — El problema */}
      <section style={{ marginTop: "var(--space-20)" }}>
        <SectionHeader num="Sección I" title={landing.problem.title} />
        <ProseBlock>
          {landing.problem.body.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
        <PullQuote>{landing.problem.pullQuote}</PullQuote>
      </section>

      {/* SECTION — La propuesta */}
      <section style={{ marginTop: "var(--space-20)" }}>
        <SectionHeader num="Sección II" title={landing.propose.title} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-7)",
          }}
        >
          {landing.propose.principles.map((p, idx) => (
            <div
              key={idx}
              style={{
                paddingTop: "var(--space-5)",
                borderTop: idx === 0 ? undefined : "1px dotted var(--rule-soft)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontVariationSettings: '"opsz" 36, "SOFT" 50',
                  fontWeight: 500,
                  fontSize: "22px",
                  lineHeight: 1.2,
                  letterSpacing: "-0.005em",
                  margin: "0 0 var(--space-3)",
                  color: "var(--ink)",
                }}
              >
                {p.title}
              </h3>
              <ProseBlock>
                <p>{p.body}</p>
              </ProseBlock>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION — Lo que está vivo */}
      <section style={{ marginTop: "var(--space-20)" }}>
        <SectionHeader num="Sección III" title={landing.live.title} />
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            borderTop: "1px solid var(--rule-soft)",
          }}
        >
          {landing.live.items.map((item) => (
            <li
              key={item}
              style={{
                padding: "var(--space-4) 0 var(--space-4) var(--space-7)",
                borderBottom: "1px solid var(--rule-soft)",
                position: "relative",
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "17px",
                lineHeight: 1.5,
                color: "var(--ink-soft)",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: "var(--space-3)",
                  top: "var(--space-4)",
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--accent)",
                  fontSize: "18px",
                }}
              >
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION — La investigación detrás */}
      <section style={{ marginTop: "var(--space-20)" }} id="scope">
        <SectionHeader num="Sección IV" title={landing.research.title} />
        <ProseBlock>
          <p>{landing.research.body}</p>
        </ProseBlock>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-4)",
            marginTop: "var(--space-8)",
          }}
        >
          {landing.research.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                padding: "var(--space-5)",
                border: "1px solid var(--rule)",
                background: "var(--bg-2)",
                color: "inherit",
                transition: "border-color var(--dur-base) var(--ease-out)",
              }}
              className="vera-link-card"
            >
              <span
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontVariationSettings: '"opsz" 36, "SOFT" 50',
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "var(--ink)",
                }}
              >
                {link.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-newsreader), serif",
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "var(--muted)",
                }}
              >
                {link.note}
              </span>
            </a>
          ))}
        </div>
        <style>{`
          .vera-link-card:hover { border-color: var(--accent) !important; }
        `}</style>
      </section>

      <EditorialFooter
        left={landing.footer.left}
        right={landing.footer.right}
      />
    </PageShell>
  );
}
