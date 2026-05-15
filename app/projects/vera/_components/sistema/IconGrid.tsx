import {
  Calendar, Clock, MapPin, Phone, Mail, MessageCircle,
  Check, X, ArrowRight, Plus, Settings, User,
  Sun, Moon, Search, Command,
} from "lucide-react";

const ICONS = [
  { name: "Calendar", Icon: Calendar },
  { name: "Clock", Icon: Clock },
  { name: "MapPin", Icon: MapPin },
  { name: "Phone", Icon: Phone },
  { name: "Mail", Icon: Mail },
  { name: "MessageCircle", Icon: MessageCircle },
  { name: "Check", Icon: Check },
  { name: "X", Icon: X },
  { name: "ArrowRight", Icon: ArrowRight },
  { name: "Plus", Icon: Plus },
  { name: "Settings", Icon: Settings },
  { name: "User", Icon: User },
  { name: "Sun", Icon: Sun },
  { name: "Moon", Icon: Moon },
  { name: "Search", Icon: Search },
  { name: "Command", Icon: Command },
];

export function IconGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
        gap: "var(--space-3)",
      }}
    >
      {ICONS.map(({ name, Icon }) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4) var(--space-2)",
            background: "var(--bg-raised)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-md)",
            color: "var(--ink)",
          }}
        >
          <Icon size={20} strokeWidth={1.5} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "var(--text-2xs)",
              color: "var(--muted)",
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
