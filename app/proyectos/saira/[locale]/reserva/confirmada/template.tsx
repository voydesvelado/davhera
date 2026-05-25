// Override del template global de Saira: la confirmación maneja su propio
// stagger interno (checkmark → title → lede → card → whatsapp → actions)
// y no necesita el fade global del template padre.

export default function ConfirmadaTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
