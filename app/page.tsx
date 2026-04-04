import Navbar from "./Navbar";
import WorkGrid from "./WorkGrid";
import Footer from "./Footer";

const experience = [
  { year: "2025", company: "Bloomberg", href: "https://bloomberg.com", role: "Software Engineering Intern" },
  { year: "2025", company: "1Password", href: "https://1password.com", role: "Product Design Intern" },
  { year: "2024", company: "Royal Bank of Canada", href: "https://rbc.com", role: "Software Engineering Intern" },
  { year: "2023", company: "Onova", href: "https://onova.io", role: "Product Design + Engineering Intern" },
];

const mono = "font-[family-name:var(--font-geist-mono)]";

export default function Home() {
  return (
    <>
      <Navbar activePath="/" />
      <main className="flex flex-col items-center px-6 w-full">

        {/* Hero: headline + experience */}
        <div className="grid grid-cols-1 gap-12 lg:gap-6 lg:pt-[26vh] pt-8 pb-8 w-full max-w-[1800px] lg:grid-cols-2">

          {/* Headline — display font, large */}
          <div className="flex flex-col w-full gap-4">
            <h1 className="font-[family-name:var(--font-lora)] max-w-[700px] text-[52px] font-medium tracking-tight leading-[1.1]" style={{ color: "var(--project-ink)" }}>
              I&apos;m David, a product designer who{" "}
              <span className="italic font-normal">engineers</span>.
            </h1>
          </div>

          {/* Experience list — mono */}
          <div className="flex flex-col gap-3 w-full justify-end font-[family-name:var(--font-geist)]">
            <div className="flex flex-col gap-2 lg:gap-[2px]">
              {experience.map(({ year, company, href, role }) => (
                <div key={`${year}-${company}`} className="flex gap-2 lg:items-baseline">
                  <span className="w-[3.5rem] shrink-0 text-sm font-[family-name:var(--font-geist-mono)]" style={{ color: "var(--project-ink-muted)" }}>{year}</span>
                  <div className="flex flex-col lg:flex-row gap-0.5">
                    <div className="w-52 shrink-0">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-150"
                        style={{ color: "var(--project-ink)" }}
                      >
                        {company}
                      </a>
                    </div>
                    <p className="text-sm" style={{ color: "var(--project-ink-muted)" }}>{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Project grid */}
        <div className={`${mono} w-full max-w-[1800px] pb-16`}>
          <WorkGrid />
        </div>

      </main>
      <Footer />
    </>
  );
}
