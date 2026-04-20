const mono = "font-[family-name:var(--font-mono)]";

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/daveherv/", external: true },
  { label: "X", href: "https://x.com/daveherv", external: true },
  { label: "Github", href: "https://github.com/daveherv", external: true },
];

export default function Footer() {
  return (
    <footer className={`${mono} uppercase w-full flex items-center justify-center px-6 py-5 border-t border-foreground/10`}>
      <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-6 max-w-[1800px]">

        {/* Left: credit */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
          <span className="text-sm font-bold text-foreground">Designed + Coded with</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="text-sm text-foreground">by David</span>
        </div>

        {/* Right: social links */}
        <div className="flex flex-row items-end gap-3 md:gap-8 w-full md:w-fit justify-between">
          <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3 md:gap-8">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-150"
              >
                {label}
              </a>
            ))}
            <button className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-150 text-start">
              Email
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
