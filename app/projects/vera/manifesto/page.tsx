import type { Metadata } from "next";
import { PageShell } from "../_components/PageShell";
import { EditorialCover } from "../_components/EditorialCover";
import { SectionHeader } from "../_components/SectionHeader";
import { PullQuote } from "../_components/PullQuote";
import { Sidenote } from "../_components/Sidenote";
import { Lede } from "../_components/Lede";
import { OrnamentRule } from "../_components/Ornament";
import { Colophon } from "../_components/Colophon";
import { ProseBlock } from "../_components/ProseBlock";
import { TableOfContents } from "../_components/TableOfContents";
import { BackLink } from "../_components/BackLink";
import { manifesto } from "./copy";

export const metadata: Metadata = {
  title: "Manifesto · Vera",
  description:
    "Por qué el consultorio independiente merece su propio software. Documento № 001 de la serie Vera.",
};

export default function VeraManifesto() {
  const s = manifesto.sections;

  return (
    <PageShell mode="editorial">
      <BackLink href="/projects/vera">Volver al inicio</BackLink>

      <EditorialCover
        metaLeft={manifesto.cover.metaLeft.map((m) => (
          <span key={m}>{m}</span>
        ))}
        metaRight={manifesto.cover.metaRight.map((m) => (
          <span key={m}>{m}</span>
        ))}
        eyebrow={manifesto.cover.eyebrow}
        titleLines={[...manifesto.cover.titleLines]}
        title=""
        deck={manifesto.cover.deck}
        footMeta={manifesto.cover.footMeta}
      />

      <TableOfContents
        entries={manifesto.toc.map((entry) => ({
          label: entry.label,
          href: `#${entry.id}`,
        }))}
      />

      {/* SECTION I */}
      <section id="i" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.i.num} title={s.i.title} />
        <Lede>{s.i.lede}</Lede>
        <ProseBlock>
          {s.i.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
        <PullQuote>{s.i.pullQuote}</PullQuote>
      </section>

      {/* SECTION II */}
      <section id="ii" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.ii.num} title={s.ii.title} />
        <ProseBlock>
          {s.ii.paragraphs.map((p, idx) => (
            <p key={idx} className={idx === 0 ? "lede" : undefined}>
              {p}
            </p>
          ))}
        </ProseBlock>
      </section>

      {/* SECTION III */}
      <section id="iii" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.iii.num} title={s.iii.title} />
        <ProseBlock>
          {s.iii.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
        <Sidenote label={s.iii.sidenote.label}>{s.iii.sidenote.body}</Sidenote>
      </section>

      {/* SECTION IV */}
      <section id="iv" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.iv.num} title={s.iv.title} />
        <ProseBlock>
          {s.iv.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
        <PullQuote>{s.iv.pullQuote}</PullQuote>
      </section>

      {/* SECTION V */}
      <section id="v" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.v.num} title={s.v.title} />
        <ProseBlock>
          {s.v.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
      </section>

      {/* SECTION VI */}
      <section id="vi" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.vi.num} title={s.vi.title} />
        <ProseBlock>
          {s.vi.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
        <blockquote
          style={{
            margin: "var(--space-6) 0 var(--space-8)",
            padding: "var(--space-5) var(--space-6)",
            background: "var(--bg-2)",
            borderLeft: "2px solid var(--accent-soft)",
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontSize: "17px",
            lineHeight: 1.5,
            color: "var(--ink-soft)",
          }}
        >
          {s.vi.template}
        </blockquote>
        <ProseBlock>
          {s.vi.paragraphsAfter.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
      </section>

      {/* SECTION VII */}
      <section id="vii" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num={s.vii.num} title={s.vii.title} />
        <ProseBlock>
          {s.vii.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ProseBlock>
        <OrnamentRule />
      </section>

      {/* CLOSING */}
      <section style={{ marginTop: "var(--space-12)" }}>
        <Lede dropCap={false}>{manifesto.closing.lede}</Lede>
        <PullQuote attribution={manifesto.closing.pullQuote.attribution}>
          {manifesto.closing.pullQuote.body}
        </PullQuote>
      </section>

      <Colophon>{manifesto.colophon}</Colophon>
    </PageShell>
  );
}
