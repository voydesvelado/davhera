"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PastMatch } from "../../_data/mockResults";

interface TrendChartProps {
  history: PastMatch[];
}

interface ChartPoint {
  x: number;
  y: number;
  label: string;
  correct: number;
}

const CHART_W = 320;
const CHART_H = 120;
const PADDING_X = 18;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 24;
const MAX_Y = 5;

function smoothPath(points: ChartPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const cpx = (prev.x + cur.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${cur.y}, ${cur.x} ${cur.y}`;
  }
  return d;
}

export function TrendChart({ history }: TrendChartProps) {
  const reduced = useReducedMotion();

  const { points, line, area, midY, summary, ariaLabel } = useMemo(() => {
    // Oldest → newest.
    const ordered = [...history].reverse();
    const innerW = CHART_W - PADDING_X * 2;
    const innerH = CHART_H - PADDING_TOP - PADDING_BOTTOM;
    const stepX = ordered.length > 1 ? innerW / (ordered.length - 1) : 0;
    const pts: ChartPoint[] = ordered.map((m, i) => {
      const ratio = m.correct / MAX_Y;
      return {
        x: PADDING_X + stepX * i,
        y: PADDING_TOP + innerH * (1 - ratio),
        label: m.matchday,
        correct: m.correct,
      };
    });
    const linePath = smoothPath(pts);
    const lastX = pts.length ? pts[pts.length - 1].x : PADDING_X;
    const firstX = pts.length ? pts[0].x : PADDING_X;
    const baselineY = PADDING_TOP + innerH;
    const areaPath = pts.length ? `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z` : "";
    const midRatio = 3 / MAX_Y;
    const midYVal = PADDING_TOP + innerH * (1 - midRatio);
    const playedCount = history.length;
    const avg = playedCount > 0 ? history.reduce((s, h) => s + h.correct, 0) / playedCount : 0;
    const best = history.reduce((m, h) => Math.max(m, h.correct), 0);
    return {
      points: pts,
      line: linePath,
      area: areaPath,
      midY: midYVal,
      summary: { played: playedCount, avg, best },
      ariaLabel: `Gráfico de tendencia: ${playedCount} partidos, promedio ${avg.toFixed(1)} aciertos, mejor racha ${best}.`,
    };
  }, [history]);

  return (
    <div className="rounded-[14px] bg-stadium-surface-elevated p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
        Tendencia de aciertos
      </p>

      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        role="img"
        aria-label={ariaLabel}
        className="mt-3 block h-[120px] w-full"
      >
        <defs>
          <linearGradient id="trend-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(0 230 118 / 0.35)" />
            <stop offset="100%" stopColor="rgb(0 230 118 / 0)" />
          </linearGradient>
        </defs>

        {/* Mid reference line */}
        <line
          x1={PADDING_X}
          x2={CHART_W - PADDING_X}
          y1={midY}
          y2={midY}
          stroke="var(--color-stadium-border-subtle)"
          strokeDasharray="4 4"
        />

        {/* Area under curve */}
        {area && <path d={area} fill="url(#trend-area-fill)" />}

        {/* Line */}
        {line && (
          <motion.path
            d={line}
            fill="none"
            stroke="var(--color-stadium-pitch)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 1, ease: "easeOut" }}
          />
        )}

        {/* Points */}
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          return (
            <motion.g
              key={`${p.label}-${i}`}
              initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: reduced ? 0 : 0.6 + i * 0.1 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              {isLast && !reduced && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={6}
                  fill="none"
                  stroke="var(--color-stadium-pitch)"
                  strokeWidth={2}
                  initial={{ r: 6, opacity: 0.6 }}
                  animate={{ r: 12, opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill="var(--color-stadium-midnight)"
                stroke="var(--color-stadium-pitch)"
                strokeWidth={2}
              />
            </motion.g>
          );
        })}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={`l-${i}`}
            x={p.x}
            y={CHART_H - 6}
            textAnchor="middle"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            fill="var(--color-stadium-text-muted)"
          >
            {p.label}
          </text>
        ))}
      </svg>

      <dl className="mt-4 flex justify-between gap-2 border-t border-stadium-border-subtle pt-3">
        <div className="flex flex-col">
          <dt className="text-[10px] font-medium uppercase tracking-wider text-stadium-text-muted">
            Partidos
          </dt>
          <dd className="font-mono text-[18px] font-extrabold text-stadium-text-primary">
            {summary.played}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-[10px] font-medium uppercase tracking-wider text-stadium-text-muted">
            Promedio
          </dt>
          <dd className="font-mono text-[18px] font-extrabold text-stadium-text-primary">
            {summary.avg.toFixed(1)}
          </dd>
        </div>
        <div className="flex flex-col items-end">
          <dt className="text-[10px] font-medium uppercase tracking-wider text-stadium-text-muted">
            Mejor racha
          </dt>
          <dd
            className={`font-mono text-[18px] font-extrabold ${
              summary.best === MAX_Y ? "text-stadium-gold" : "text-stadium-text-primary"
            }`}
          >
            {summary.best === MAX_Y ? "¡Perfecto!" : summary.best}
          </dd>
        </div>
      </dl>
    </div>
  );
}
