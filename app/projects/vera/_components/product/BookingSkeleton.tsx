import { Skeleton } from "../ui/Skeleton";

export function BookingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", paddingTop: "var(--space-8)" }}>
      <Skeleton width={120} height={14} />
      <Skeleton width="80%" height={32} />
      <div
        style={{
          padding: "var(--space-6)",
          background: "var(--bg-raised)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <Skeleton width={140} height={12} />
        <Skeleton width="70%" height={26} />
        <Skeleton width="60%" height={14} />
        <Skeleton width="50%" height={14} />
      </div>
      <Skeleton width={200} height={14} style={{ alignSelf: "center" }} />
      <Skeleton width="min(80vw, 320px)" height={460} radius="var(--radius-xl)" style={{ alignSelf: "center" }} />
    </div>
  );
}
