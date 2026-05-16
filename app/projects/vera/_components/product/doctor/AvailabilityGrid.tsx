"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { AvailabilityRule } from "../../../_lib/types";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;
// Monday-indexed: 0=Mon … 6=Sun. Convert to/from JS weekday (Sun=0).
function toJsWeekday(monIdx: number): number {
  return (monIdx + 1) % 7;
}
function fromJsWeekday(jsIdx: number): number {
  return (jsIdx + 6) % 7;
}

interface AvailabilityGridProps {
  rules: AvailabilityRule[];
  doctorId: string;
  onChange: (rules: AvailabilityRule[]) => void;
  startHour?: number;
  endHour?: number;
  compact?: boolean;
}

interface CellKey {
  monIdx: number;
  hour: number;
}

function rulesToCells(
  rules: AvailabilityRule[],
  doctorId: string,
  startHour: number,
  endHour: number,
): boolean[][] {
  const cols = 7;
  const rows = endHour - startHour;
  const grid: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (const r of rules) {
    if (r.doctorId !== doctorId) continue;
    const monIdx = fromJsWeekday(r.weekday);
    for (let h = startHour; h < endHour; h += 1) {
      const cellStart = h * 60;
      const cellEnd = cellStart + 60;
      if (r.startMinute < cellEnd && r.endMinute > cellStart) {
        grid[h - startHour][monIdx] = true;
      }
    }
  }
  return grid;
}

function cellsToRules(grid: boolean[][], doctorId: string, startHour: number): AvailabilityRule[] {
  const rules: AvailabilityRule[] = [];
  for (let monIdx = 0; monIdx < 7; monIdx += 1) {
    const weekday = toJsWeekday(monIdx);
    let runStart: number | null = null;
    for (let row = 0; row <= grid.length; row += 1) {
      const isOn = row < grid.length ? grid[row][monIdx] : false;
      if (isOn && runStart === null) {
        runStart = startHour + row;
      } else if (!isOn && runStart !== null) {
        const runEnd = startHour + row;
        rules.push({
          doctorId,
          weekday,
          startMinute: runStart * 60,
          endMinute: runEnd * 60,
        });
        runStart = null;
      }
    }
  }
  return rules;
}

export function AvailabilityGrid({
  rules,
  doctorId,
  onChange,
  startHour = 7,
  endHour = 21,
  compact = false,
}: AvailabilityGridProps) {
  const [cells, setCells] = useState<boolean[][]>(() =>
    rulesToCells(rules, doctorId, startHour, endHour),
  );

  // Drag state — refs because we mutate during pointermove without re-render.
  const dragging = useRef(false);
  const dragTarget = useRef<boolean>(true);

  const setCell = useCallback(
    ({ monIdx, hour }: CellKey, value: boolean) => {
      setCells((prev) => {
        const row = hour - startHour;
        if (prev[row][monIdx] === value) return prev;
        const next = prev.map((r) => r.slice());
        next[row][monIdx] = value;
        // Defer rule recompute to avoid spamming during drag — the parent
        // listens via the post-drag onPointerUp commit.
        return next;
      });
    },
    [startHour],
  );

  const handlePointerDown = (cell: CellKey) => (e: React.PointerEvent) => {
    e.preventDefault();
    const row = cell.hour - startHour;
    const current = cells[row][cell.monIdx];
    const target = !current;
    dragging.current = true;
    dragTarget.current = target;
    setCell(cell, target);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerEnter = (cell: CellKey) => () => {
    if (!dragging.current) return;
    setCell(cell, dragTarget.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    // Commit the final state up to the parent.
    setCells((prev) => {
      onChange(cellsToRules(prev, doctorId, startHour));
      return prev;
    });
  };

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour],
  );

  const cellHeight = compact ? 24 : 32;

  return (
    <div
      className="vera-avail-grid-wrap"
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3)",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `40px repeat(7, minmax(0, 1fr))`,
          gap: 2,
        }}
      >
        <div aria-hidden />
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontSize: "var(--text-2xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-wider)",
              textTransform: "uppercase",
              color: "var(--muted)",
              paddingBottom: "var(--space-2)",
            }}
          >
            {label}
          </div>
        ))}
        {hours.map((h, rowIdx) => (
          <Hour
            key={h}
            hour={h}
            rowIdx={rowIdx}
            cells={cells}
            cellHeight={cellHeight}
            onPointerDown={handlePointerDown}
            onPointerEnter={handlePointerEnter}
          />
        ))}
      </div>
    </div>
  );
}

function Hour({
  hour,
  rowIdx,
  cells,
  cellHeight,
  onPointerDown,
  onPointerEnter,
}: {
  hour: number;
  rowIdx: number;
  cells: boolean[][];
  cellHeight: number;
  onPointerDown: (cell: CellKey) => (e: React.PointerEvent) => void;
  onPointerEnter: (cell: CellKey) => () => void;
}) {
  return (
    <>
      <div
        style={{
          textAlign: "right",
          paddingRight: "var(--space-2)",
          fontSize: "var(--text-2xs)",
          color: "var(--muted)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontFeatureSettings: '"tnum" 1',
          alignSelf: "center",
          height: cellHeight,
          lineHeight: `${cellHeight}px`,
        }}
      >
        {String(hour).padStart(2, "0")}
      </div>
      {Array.from({ length: 7 }).map((_, monIdx) => {
        const on = cells[rowIdx][monIdx];
        return (
          <button
            key={monIdx}
            type="button"
            onPointerDown={onPointerDown({ monIdx, hour })}
            onPointerEnter={onPointerEnter({ monIdx, hour })}
            aria-pressed={on}
            aria-label={`${WEEKDAY_LABELS[monIdx]} ${hour}:00 ${on ? "disponible" : "no disponible"}`}
            style={{
              height: cellHeight,
              background: on ? "var(--accent-pale)" : "var(--bg-sunken)",
              border: on ? "1px solid var(--accent)" : "1px solid transparent",
              borderRadius: "var(--radius-xs)",
              cursor: "pointer",
              padding: 0,
              transition:
                "background var(--dur-instant) var(--ease-snap), border-color var(--dur-instant) var(--ease-snap)",
            }}
            className="vera-avail-cell"
          />
        );
      })}
      <style>{`
        .vera-avail-cell:hover[aria-pressed="false"] { background: color-mix(in oklch, var(--bg-sunken) 60%, var(--rule)); }
        .vera-avail-cell:hover[aria-pressed="true"] { border-width: 2px; }
      `}</style>
    </>
  );
}
