import Image from "next/image";
import Link from "next/link";

type Project = {
  title: string;
  subtitle: string;
  href: string;
  external?: boolean;
  aspect?: string;
  bg: string;
} & (
  | { type: "video"; poster: string; src: string }
  | { type: "image"; src: string }
);

const colA: Project[] = [
  {
    type: "video",
    title: "The future of AI & hardware",
    subtitle: "OpenAI x Hardware • Concept 2025",
    href: "/projects/openai",
    aspect: "aspect-[16/9]",
    bg: "rgba(233, 141, 52, 0.314)",
    poster: "/projects/openai/openai.png",
    src: "/projects/openai/openai.mp4",
  },
  {
    type: "video",
    title: "Novel consumer AI experiences",
    subtitle: "Amazon Alexa+ • Contract 2025",
    href: "/projects/alexa",
    aspect: "aspect-[8/5]",
    bg: "rgba(0, 20, 69, 0.314)",
    poster: "/projects/alexa/alexa.png",
    src: "/projects/alexa/alexa.mp4",
  },
  {
    type: "video",
    title: "Mobile-first for Figma",
    subtitle: "Figma • Concept 2025",
    href: "/projects/figma",
    aspect: "aspect-[10/7]",
    bg: "rgba(208, 168, 216, 0.314)",
    poster: "/projects/figma/figma.png",
    src: "/projects/figma/figma.mp4",
  },
  {
    type: "image",
    title: "Patent-pending AI",
    subtitle: "Royal Bank of Canada • Handed off 2024",
    href: "/projects/rbc",
    aspect: "aspect-[16/9]",
    bg: "rgb(232, 242, 251)",
    src: "/projects/rbc/rbc.png",
  },
];

const colB: Project[] = [
  {
    type: "video",
    title: "The world's first AI poker coach",
    subtitle: "PokerGPT • Shipped 2023",
    href: "/projects/pokergpt",
    aspect: "aspect-[10/7]",
    bg: "rgba(221, 208, 252, 0.314)",
    poster: "/projects/pokergpt/pokergpt.png",
    src: "/projects/pokergpt/pokergpt.mp4",
  },
  {
    type: "video",
    title: "Bringing autofill to macOS",
    subtitle: "1Password • Shipped 2025",
    href: "/projects/1password",
    aspect: "aspect-[8/5]",
    bg: "rgba(26, 49, 110, 0.314)",
    poster: "/projects/1password/1password.png",
    src: "/projects/1password/1password.mp4",
  },
  {
    type: "image",
    title: "Making 0-1 building for everyone",
    subtitle: "Hack Western 12 • Shipped 2025",
    href: "https://hackwestern.com",
    external: true,
    aspect: "aspect-[8/5]",
    bg: "rgb(26, 26, 26)",
    src: "/projects/hackwestern/hackwestern.png",
  },
  {
    type: "video",
    title: "Innovation management for Fortune 500s",
    subtitle: "Earth • Shipped 2023",
    href: "/projects/earth",
    aspect: "aspect-[16/9]",
    bg: "rgba(122, 174, 233, 0.314)",
    poster: "/projects/earth/earth.png",
    src: "/projects/earth/earth.mp4",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const linkProps = project.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={project.href} {...linkProps} className="group block transition-all duration-300 ease-in-out">
      <div className="flex flex-col gap-2">

        {/* Media */}
        <div
          className="relative w-full aspect-[16/9] border border-foreground/10 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="relative w-full h-full overflow-hidden">
            {project.type === "video" ? (
              <video
                poster={project.poster}
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                loop
                autoPlay
                playsInline
                preload="metadata"
                style={{ backgroundColor: project.bg }}
              >
                <source src={project.src} type="video/mp4" />
              </video>
            ) : (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: project.bg }}
              >
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/0 transition-colors duration-300 ease-in-out group-hover:bg-background/40" />
        </div>

        {/* Caption */}
        <div className="flex flex-col justify-between gap-0.5 mt-1 transition-colors duration-300 ease-in-out lg:flex-row">
          <h3
            className="font-[family-name:var(--font-lora)] text-[17px] overflow-hidden leading-snug"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", color: "var(--project-ink)" }}
          >
            {project.title}
          </h3>
          <h4
            className="font-[family-name:var(--font-geist-mono)] uppercase text-[15px] overflow-hidden transition-colors duration-300 ease-in-out"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", color: "var(--project-ink-muted)" }}
          >
            {project.subtitle}
          </h4>
        </div>

      </div>
    </Link>
  );
}

export default function WorkGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 transition-all duration-300 ease-in-out lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        {colA.map((p) => <ProjectCard key={p.href} project={p} />)}
      </div>
      <div className="flex flex-col gap-6">
        {colB.map((p) => <ProjectCard key={p.href} project={p} />)}
      </div>
    </div>
  );
}
