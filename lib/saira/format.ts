// Saira · formatters

export function formatBRL(amount: number): string {
  return `R$ ${amount.toLocaleString("pt-BR")}`;
}

/** Formato editorial corto: 45 min · 2h · 2h30 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes - hours * 60;
  if (rest === 0) return `${hours}h`;
  return `${hours}h${rest.toString().padStart(2, "0")}`;
}
