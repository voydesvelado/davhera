import Link from "next/link";

const COL_LINKS = [
  { label: "Catálogo", href: "/viajes#catalogo" },
  { label: "Sobre nosotros", href: "#" },
  { label: "Aviso de privacidad", href: "#" },
  { label: "Términos", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-token bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <span className="text-display-md font-display text-fg">VIAJES</span>
            <p className="text-body text-fg-muted max-w-xs">
              Viajes diseñados a tu medida.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-eyebrow text-fg-muted">Navegación</p>
            <ul className="space-y-3">
              {COL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-body text-fg hover:text-accent transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-eyebrow text-fg-muted">Contacto</p>
            <ul className="space-y-3 text-body text-fg">
              <li>
                <a
                  href="https://wa.me/525500000000"
                  className="hover:text-accent transition-colors duration-200"
                >
                  WhatsApp: 55 0000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@agencia.mx"
                  className="hover:text-accent transition-colors duration-200"
                >
                  hola@agencia.mx
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="hover:text-accent transition-colors duration-200"
                >
                  @agencia
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-token flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-body-sm text-fg-muted">
            © 2026 Agencia. Todos los derechos reservados.
          </p>
          <p className="text-body-sm text-fg-subtle">Ciudad de México, México</p>
        </div>
      </div>
    </footer>
  );
}
