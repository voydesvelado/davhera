"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  House,
  CalendarDays,
  Clock,
  List,
  User,
  MessageCircle,
  ExternalLink,
  Sun,
  Trash,
} from "lucide-react";
import { useTheme } from "../../../_lib/theme";
import { useToast } from "../../ui/Toast";
import { clearVisitorData } from "../../../_lib/storage";
import type { CommandAction } from "../../ui/CommandPalette";

export function useDoctorActions(closePalette: () => void): CommandAction[] {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const toast = useToast();

  return useMemo<CommandAction[]>(
    () => [
      {
        id: "go-today",
        label: "Ir a hoy",
        icon: <House size={16} strokeWidth={1.75} />,
        shortcut: "G H",
        onSelect: () => router.push("/projects/vera/panel"),
      },
      {
        id: "go-week",
        label: "Ir a la semana",
        icon: <CalendarDays size={16} strokeWidth={1.75} />,
        shortcut: "G W",
        onSelect: () => router.push("/projects/vera/panel/semana"),
      },
      {
        id: "go-availability",
        label: "Ir a horarios",
        icon: <Clock size={16} strokeWidth={1.75} />,
        shortcut: "G A",
        onSelect: () => router.push("/projects/vera/panel/disponibilidad"),
      },
      {
        id: "go-services",
        label: "Ir a servicios",
        icon: <List size={16} strokeWidth={1.75} />,
        shortcut: "G S",
        onSelect: () => router.push("/projects/vera/panel/servicios"),
      },
      {
        id: "go-profile",
        label: "Ir a perfil",
        icon: <User size={16} strokeWidth={1.75} />,
        shortcut: "G P",
        onSelect: () => router.push("/projects/vera/panel/perfil"),
      },
      {
        id: "go-reminders",
        label: "Próximos recordatorios",
        icon: <MessageCircle size={16} strokeWidth={1.75} />,
        onSelect: () => router.push("/projects/vera/panel/proximos-recordatorios"),
      },
      {
        id: "view-public",
        label: "Ver mi página pública",
        icon: <ExternalLink size={16} strokeWidth={1.75} />,
        onSelect: () => {
          if (typeof window !== "undefined") {
            window.open("/projects/vera/dra-sofia-ramirez", "_blank", "noopener,noreferrer");
          }
        },
      },
      {
        id: "toggle-theme",
        label: resolvedTheme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
        icon: <Sun size={16} strokeWidth={1.75} />,
        onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "clear-data",
        label: "Limpiar datos del demo",
        icon: <Trash size={16} strokeWidth={1.75} />,
        onSelect: () => {
          if (typeof window === "undefined") return;
          const ok = window.confirm("¿Borrar tus reservas guardadas en este navegador? Las citas pre-cargadas no se afectan.");
          if (!ok) return;
          clearVisitorData();
          toast.show({ tone: "success", message: "Tus reservas fueron borradas." });
          setTimeout(() => window.location.reload(), 400);
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, resolvedTheme, toast, closePalette],
  );
}
