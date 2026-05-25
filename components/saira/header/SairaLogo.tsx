// Stylized palm-leaf mark · echo del logo definido en saira-design-system.html.
// `currentColor` permite que el header controle el color (moss claro / jade en dark).

export function SairaLogo({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M16 30 C16 22, 13 16, 8 12 C10 18, 12 24, 16 30 Z" />
      <path d="M16 30 C16 20, 14 14, 10 8 C13 14, 15 22, 16 30 Z" />
      <path d="M16 30 C16 18, 16 10, 16 4 C16 12, 16 22, 16 30 Z" />
      <path d="M16 30 C16 20, 18 14, 22 8 C19 14, 17 22, 16 30 Z" />
      <path d="M16 30 C16 22, 19 16, 24 12 C22 18, 20 24, 16 30 Z" />
    </svg>
  );
}
