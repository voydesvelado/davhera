"use client";

import { Plus, Zap } from "lucide-react";

function AppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      {/* sparkle */}
      <path
        d="M8 2 L9.4 7 L14 8 L9.4 9 L8 14 L6.6 9 L2 8 L6.6 7 Z"
        fill="white"
        opacity="0.85"
      />
      {/* house */}
      <path d="M15 14 L19.5 10.5 L24 14 L24 22 L15 22 Z" fill="white" opacity="0.7" />
      <rect x="17.5" y="17" width="4" height="5" rx="1" fill="#2c2c2e" />
    </svg>
  );
}

export default function CapsuleCard() {
  return (
    <div style={styles.wrapper}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={styles.bgVideo}
        src="https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/video1.mp4"
      />

      <div style={styles.card}>
        {/* Header pill */}
        <div style={styles.headerPill}>
          <div style={styles.iconCircle}>
            <AppIcon />
          </div>
          <span style={styles.capsuleLabel}>Capsule</span>
        </div>

        {/* Battery info */}
        <div style={styles.body}>
          <p style={styles.batteryText}>29% &bull; 25 min left</p>
          <p style={styles.chargingText}>
            <Zap size={15} fill="rgba(255,255,255,0.55)" stroke="none" />
            Charging...
          </p>
        </div>

        {/* Bottom buttons */}
        <div style={styles.bottomRow}>
          <div style={styles.actionButton}>
            <div style={styles.pinkSquare} />
          </div>
          <div style={styles.actionButton}>
            <Plus size={26} color="rgba(255,255,255,0.5)" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000",
    position: "relative",
    overflow: "hidden",
    fontFamily: "var(--font-inter), sans-serif",
  },
  bgVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  },
  card: {
    width: "340px",
    background: "rgba(30, 30, 30, 0.72)",
    borderRadius: "28px",
    border: "1px solid rgba(255,255,255,0.28)",
    backdropFilter: "blur(5px) saturate(160%)",
    WebkitBackdropFilter: "blur(5px) saturate(160%)",
    padding: "12px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  headerPill: {
    background: "#1a1a1c",
    borderRadius: "18px",
    padding: "10px 20px 10px 10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconCircle: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    background: "#2c2c2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  capsuleLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: "20px",
    fontWeight: 500,
    letterSpacing: "-0.3px",
  },
  body: {
    padding: "2px 14px 2px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  batteryText: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 700,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  chargingText: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 400,
    color: "rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  bottomRow: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    flex: 1,
    height: "90px",
    background: "rgba(70, 68, 64, 0.5)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
  },
  pinkSquare: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background:
      "radial-gradient(circle at 38% 32%, rgba(255,190,210,0.98) 0%, rgba(245,110,155,0.75) 55%, rgba(190,55,110,0.45) 100%)",
    boxShadow: "0 0 18px rgba(255,130,175,0.65), 0 0 40px rgba(255,100,160,0.3)",
  },
} as const;
