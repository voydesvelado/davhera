import { Fragment, type ReactNode } from "react";
import type { RootContent } from "mdast";

import type { Block } from "../../core/markdown/blocks";
import { codePointLength } from "../../core/text";
import {
  buildOffsetMap,
  joinsWithSpace,
  rawTextOf,
  splitByHighlights,
  type HighlightRange,
  type OffsetMap,
} from "./inline";

/**
 * Render de un bloque mdast a React, con los highlights aplicados.
 *
 * Los headings salen como `<h1>`–`<h6>` REALES, no divs con clase: es lo que hace
 * que el lector se pueda navegar con VoiceOver o TalkBack.
 *
 * Cada pedazo de texto lleva `data-off` con su offset crudo. Es lo que después
 * permite traducir una selección del usuario a offsets del modelo sin adivinar.
 */
export function BlockView({
  block,
  node,
  highlights,
  onHighlightClick,
}: {
  block: Block;
  node: RootContent;
  highlights: HighlightRange[];
  onHighlightClick?: (id: string) => void;
}) {
  const map = buildOffsetMap(rawTextOf(node));
  const ctx: RenderContext = { map, highlights, rawOffset: 0, onHighlightClick };
  const children = renderChildren(node, ctx);

  switch (node.type) {
    case "heading": {
      const Tag = `h${Math.min(6, Math.max(1, node.depth))}` as "h1";
      return (
        <Tag
          data-block={block.index}
          className={
            node.depth === 1
              ? "mt-10 mb-4 text-[1.5em] leading-tight font-medium"
              : "mt-8 mb-3 text-[1.2em] leading-snug font-medium"
          }
        >
          {children}
        </Tag>
      );
    }
    case "blockquote":
      return (
        <blockquote data-block={block.index} className="my-6 border-l-2 border-line pl-4 text-ink-2">
          {children}
        </blockquote>
      );
    case "list": {
      const Tag = node.ordered ? "ol" : "ul";
      return (
        <Tag
          data-block={block.index}
          className={`my-4 pl-6 ${node.ordered ? "list-decimal" : "list-disc"}`}
        >
          {children}
        </Tag>
      );
    }
    case "code":
      return (
        <pre
          data-block={block.index}
          className="my-6 overflow-x-auto rounded-s border border-line p-4 text-[0.85em]"
        >
          <code data-off={0}>{node.value}</code>
        </pre>
      );
    case "thematicBreak":
      return <hr data-block={block.index} className="my-10 border-0 border-t border-line" />;
    case "table":
      return (
        <div data-block={block.index} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-[0.9em]">
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    default:
      return (
        <p data-block={block.index} className="my-4">
          {children}
        </p>
      );
  }
}

interface RenderContext {
  map: OffsetMap;
  highlights: HighlightRange[];
  /** Avanza en paralelo al texto crudo del bloque, separadores incluidos. */
  rawOffset: number;
  onHighlightClick?: ((id: string) => void) | undefined;
}

function renderChildren(node: RootContent, ctx: RenderContext): ReactNode {
  if (!("children" in node) || !Array.isArray(node.children)) return null;
  const separated = joinsWithSpace(node);

  return node.children.map((child, index) => {
    // El separador entre hijos de bloque no se renderiza, pero SÍ existe en el
    // texto crudo que produjo el plainText: hay que contarlo o los offsets de todo
    // lo que sigue quedan corridos un carácter por cada hijo.
    if (separated && index > 0) ctx.rawOffset += 1;
    return <Fragment key={index}>{renderInline(child as RootContent, ctx)}</Fragment>;
  });
}

function renderInline(node: RootContent, ctx: RenderContext): ReactNode {
  switch (node.type) {
    case "text": {
      const rawStart = ctx.rawOffset;
      ctx.rawOffset += codePointLength(node.value);
      const pieces = splitByHighlights(node.value, rawStart, ctx.map, ctx.highlights);

      return pieces.map((piece, index) =>
        piece.highlight ? (
          <mark
            key={index}
            data-off={piece.rawStart}
            data-highlight={piece.highlight.id}
            onClick={() => ctx.onHighlightClick?.(piece.highlight!.id)}
            // El único color de la app. `box-decoration-clone` mantiene el ámbar
            // parejo cuando el subrayado cruza un salto de línea.
            className="box-decoration-clone cursor-pointer bg-accent text-inherit"
          >
            {piece.text}
            {piece.highlight.hasNote && (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-1 w-1 rounded-full bg-[#F5C84C] align-super"
              />
            )}
          </mark>
        ) : (
          <span key={index} data-off={piece.rawStart}>
            {piece.text}
          </span>
        ),
      );
    }
    case "inlineCode": {
      const rawStart = ctx.rawOffset;
      ctx.rawOffset += codePointLength(node.value);
      return (
        <code data-off={rawStart} className="rounded-s bg-line px-1 text-[0.9em]">
          {node.value}
        </code>
      );
    }
    case "strong":
      return <strong className="font-medium">{renderChildren(node, ctx)}</strong>;
    case "emphasis":
      return <em>{renderChildren(node, ctx)}</em>;
    case "delete":
      return <del>{renderChildren(node, ctx)}</del>;
    case "link":
      return (
        <a
          href={node.url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-line underline-offset-2"
        >
          {renderChildren(node, ctx)}
        </a>
      );
    case "image":
      // La imagen aporta su `alt` al texto crudo, aunque no muestre texto.
      ctx.rawOffset += codePointLength(node.alt ?? "");
      return <img src={node.url} alt={node.alt ?? ""} className="my-6 max-w-full rounded-s" />;
    case "break":
      ctx.rawOffset += 1;
      return <br />;
    case "listItem":
      return <li className="my-1">{renderChildren(node, ctx)}</li>;
    case "paragraph":
      return <>{renderChildren(node, ctx)}</>;
    case "tableRow":
      return <tr className="border-b border-line">{renderChildren(node, ctx)}</tr>;
    case "tableCell":
      return <td className="px-3 py-2">{renderChildren(node, ctx)}</td>;
    default:
      return renderChildren(node, ctx);
  }
}
