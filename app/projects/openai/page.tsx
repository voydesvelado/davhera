"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/Navbar";

const mono = "font-[family-name:var(--font-geist-mono)]";

// ─── Helpers ────────────────────────────────────────────────────────────────

function AutoVideo({ src, className }: { src: string; className?: string }) {
  return (
    <div className="relative w-full border border-foreground/10 overflow-hidden group">
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={className ?? "w-full h-auto object-cover transition-opacity duration-500 ease-in-out"}
      />
    </div>
  );
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        className="w-full h-auto object-contain transition-opacity duration-300"
      />
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; lines: string[] }[] }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
      {items.map(({ label, lines }) => (
        <div key={label} className="flex w-full flex-col gap-2">
          <h4 className="!opacity-100">{label}</h4>
          <div className="flex flex-col gap-0">
            {lines.map((l) => <p key={l}>{l}</p>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ThreeCol({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="flex w-full flex-col md:flex-row gap-6 mt-2">
      {items.map(({ title, body }) => (
        <div key={title} className="flex flex-col gap-1 w-full">
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}

function CoreFlowRow({ src, title, desc }: { src: string; title: string; desc: string }) {
  return (
    <div className="w-full flex gap-6 my-4 items-center">
      <div className="grid grid-cols-1 md:grid-cols-[60%_auto] md:gap-8 md:items-end w-full">
        {/* Mobile label */}
        <div className="md:hidden flex flex-col pb-6">
          <h3 className="mt-2 text-sm">{title}</h3>
          <p className="mt-1 text-sm">{desc}</p>
        </div>
        <AutoVideo src={src} className="w-full h-auto object-cover transition-opacity duration-500 ease-in-out overflow-clip" />
        <div className="flex flex-col h-fit">
          <h3 className="hidden md:block mt-2 text-sm">{title}</h3>
          <p className="hidden md:block mt-1 text-sm">{desc}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────

const sections = [
  { id: "overview", label: "Overview" },
  { id: "solution", label: "Solution" },
  { id: "core-flows", label: "Core Flows" },
  { id: "research", label: "Research" },
  { id: "exploring-form-factors", label: "Exploring Form Factors" },
  { id: "prototyping-and-testing", label: "Prototyping and Testing" },
  { id: "design-decisions", label: "Design Decisions" },
  { id: "hardware-constraints", label: "Designing for Hardware Constraints" },
  { id: "reflection", label: "Reflection" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OpenAIProject() {
  const [active, setActive] = useState("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar activePath="/projects/openai" />
      <div className="min-h-screen px-6">
        <main className="grid max-w-[1800px] mx-auto grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-8">

          {/* ── Sidebar ── */}
          <aside className={`${mono} md:sticky md:top-0 md:h-fit px-0 pt-12 pb-0 md:py-12 min-w-40`}>
            <Link href="/" className="w-full text-left">
              <div className="flex items-center gap-2 hover:opacity-60 transition-opacity group">
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" fill="currentColor" />
                </svg>
                <span className="text-sm uppercase">Back</span>
              </div>
            </Link>

            <nav className="mt-8 hidden md:block">
              <div className="flex flex-col items-start gap-2">
                {sections.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`text-left text-sm transition-colors cursor-pointer ${
                      active === id ? "text-foreground" : "text-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <div className="w-full max-w-[768px] py-12 flex flex-col gap-12 md:gap-24">

            {/* Header */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h4 className={mono}>OpenAI x Hardware • Concept 2025</h4>
                <h1>The future of AI &amp; hardware</h1>
              </div>
              <div className="w-full aspect-[16/9] border border-foreground/10 overflow-hidden">
                <video
                  poster="/projects/openai/openai.png"
                  className="w-full h-full object-cover"
                  loop
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  style={{ backgroundColor: "rgba(233, 141, 52, 0.314)" }}
                >
                  <source src="/projects/openai/openai.mp4" type="video/mp4" />
                </video>
              </div>
              <InfoGrid items={[
                { label: "Role", lines: ["Product Designer"] },
                { label: "Timeline", lines: ["August - September 2025"] },
                { label: "Team", lines: ["3 Designers"] },
                { label: "Skills", lines: ["Product Design", "Product Strategy", "Prototyping"] },
              ]} />
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-12">

              {/* Overview */}
              <section id="overview" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Overview</h4>
                <h2 className="-mb-2">What should OpenAI build as their first AI device?</h2>
                <p>As a team of 3 product designers, our goal was to land on a clear vision within 7 weeks.</p>
                <ThreeCol items={[
                  { title: "Product Strategy", body: "Thinking broadly about OpenAI, the AI landscape, and exploring widely in the solution space." },
                  { title: "Prototyping & Testing", body: "Going wide in ideation and rapidly testing concepts with users." },
                  { title: "Iterating with Feedback", body: "Continuously iterating on concepts and validating product decisions." },
                ]} />
                <h4 className={`${mono} !opacity-100 mt-8`}>Problem</h4>
                <h2 className="-mb-2">ChatGPT is at the top of the stack.</h2>
                <p>ChatGPT is an app, at the top of this technology stack. That's a risky place to be because it leaves OpenAI at the mercy of the lower layers, like the platform, the operating system, and the hardware.</p>
                <ProjectImage src="/projects/openai/1-problem.svg" alt="Problem diagram" />
                <p>Apple and Google are building their own consumer AI ecosystems, but with the advantage of being able to control the entire stack.</p>
                <p>However, OpenAI is currently dominating consumer AI, and Apple has recently dropped the ball on their Apple Intelligence integrations. This creates an opportunity for OpenAI to build an AI device and capture consumers in their own ecosystem.</p>
                <h4 className={`${mono} !opacity-100 mt-8`}>Opportunity</h4>
                <h2 className="-mb-2">Memory as the core of OpenAI's device ecosystem.</h2>
                <p>Memory should be OpenAI's new moat. LLMs are becoming commoditized, but personalization and context are the new differentiators. With hardware, OpenAI will benefit from:</p>
                <ThreeCol items={[
                  { title: "Independence", body: "No longer at the mercy of the lower layers" },
                  { title: "Ecosystem lock-in", body: "Capture users with a tightly-integrated experience like Apple does today" },
                  { title: "New input modalities", body: "A device that can see, hear, and remember in ways an app can't" },
                ]} />
              </section>

              {/* Solution */}
              <section id="solution" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Solution</h4>
                <h2 className="-mb-2">Tomo: the AI device that remembers so you don't have to...</h2>
                <p>A pin and pendant wearable, serving as a camera and microphone on-the-go.</p>
                <ProjectImage src="/projects/openai/2-tomo.png" alt="Tomo device" />
                <h2 className="-mb-2">...powering Moments, logging memories in your everyday life in ChatGPT.</h2>
                <p>Moments is a new atomic unit in ChatGPT, logging all the events, conversations, and solo adventures captured with Tomo.</p>
                <AutoVideo src="/projects/openai/moments.mp4" className="w-full h-auto object-contain transition-opacity duration-500 ease-in-out" />
              </section>

              {/* Core Flows */}
              <section id="core-flows" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Core Flows</h4>
                <CoreFlowRow src="/projects/openai/cf-smart-prompt.mp4" title="Smart prompts, in-the-moment" desc="Get prompts relevant to you in-the-moment, with Tomo." />
                <CoreFlowRow src="/projects/openai/cf-chat-context.mp4" title="Chat with real-time context" desc="ChatGPT can now respond to you with understanding of your real life." />
                <CoreFlowRow src="/projects/openai/cf-moments.mp4" title="Look back on your moments" desc="In the new Moments page, you can look back on everything that's happened, categorized by context." />
                <CoreFlowRow src="/projects/openai/cf-apartmoment.mp4" title="Review a specific moment" desc="Tap into each moment to see all the important things that happened." />
                <h3 className="!opacity-100 mt-4 -mb-3">Onboarding to Tomo</h3>
                <p>Designing for an experience that will show users how Moments work and the immediate value of Tomo.</p>
                <AutoVideo src="/projects/openai/onboarding.mp4" className="w-full h-auto object-contain transition-opacity duration-500 ease-in-out" />
                <div className="h-px w-full bg-foreground/10 mt-16 mb-8" />
              </section>

              {/* Research */}
              <section id="research" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Research</h4>
                <h2 className="-mb-2">Researching the AI landscape and current devices on the market</h2>
                <p>We went deep into understanding OpenAI, and the world of consumer AI, agents, trends, and more. We researched existing devices and tried some out ourselves!</p>
                <ProjectImage src="/projects/openai/4-ai-rabbit-hole.png" alt="AI research rabbit hole" />
              </section>

              {/* Exploring Form Factors */}
              <section id="exploring-form-factors" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Exploring Form Factors</h4>
                <h2 className="-mb-2">Exploring product direction and form factor</h2>
                <p>We explored product direction and form factor, and designed for an experience that will show users how Moments work and the immediate value of Tomo.</p>
                <h4 className={`${mono} !opacity-100 mt-8`}>Strategic Directions</h4>
                <ThreeCol items={[
                  { title: "Productivity Tools", body: "Targeting students, massive AI adopters, with a familiar form factor." },
                  { title: "Home Devices", body: "A less competitive space with fewer constraints on battery life and data plans." },
                  { title: "Wearables", body: "On-the-go form factors fit for mass adoption." },
                ]} />
                <ProjectImage src="/projects/openai/5-form-factor.png" alt="Form factor exploration" />
                <h4 className={`${mono} !opacity-100 mt-8`}>Why Tomo?</h4>
                <ThreeCol items={[
                  { title: "Enhances ChatGPT", body: "Leverages the app's large and fast-growing user base." },
                  { title: "Leverages OpenAI's strengths", body: "Taps into OpenAI's unique strengths of strong foundational models, memory, and agents." },
                  { title: "Easier to scale", body: "Much cheaper to build and easier to scale than glasses, watches etc." },
                ]} />
                <ProjectImage src="/projects/openai/7-why-tomo.png" alt="Why Tomo" />
              </section>

              {/* Prototyping and Testing */}
              <section id="prototyping-and-testing" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Prototyping and Testing</h4>
                <h2 className="-mb-2">Prototyping interfaces for real-world memory</h2>
                <p>We explored a ton of concepts for these 3 strategic directions, here are select few of them:</p>

                {[
                  { srcs: ["/projects/openai/exp1-prompt.mp4", "/projects/openai/exp2-bg-mode.mp4"], title: "ChatGPT Feature Power-ups", desc: "Using real-life context to enhance existing features in the app" },
                  { srcs: ["/projects/openai/exp3-decons-ar.mp4", "/projects/openai/exp4-transcript.mp4"], title: "In-the-moment Canvas", desc: "Exploring interfaces focused on real-time assistance" },
                  { srcs: ["/projects/openai/exp5-stories.mp4", "/projects/openai/exp6-timeline.mp4"], title: "Memory-centered UI", desc: "Focusing on helping users look back on their day" },
                ].map(({ srcs, title, desc }) => (
                  <div key={title} className="w-full flex flex-col md:flex-row gap-6 items-end my-2">
                    <div className="grid grid-cols-2 gap-6 md:gap-5 w-full md:w-1/2">
                      {srcs.map((src) => (
                        <div key={src} className="relative w-full border border-foreground/10 overflow-hidden">
                          <video src={src} autoPlay loop muted playsInline preload="auto" className="w-full h-auto object-cover transition-opacity duration-500 ease-in-out" />
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full md:w-1/3 flex-col h-fit pb-8 md:pb-0">
                      <h3 className="mt-2 text-sm">{title}</h3>
                      <p className="mt-1 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}

                <h3 className="!opacity-100 mt-4 -mb-3">Testing and iterating with feedback!</h3>
                <p>We got users to try these prototypes, observed how they used them, how they felt, and got tons of valuable feedback.</p>
                <AutoVideo src="/projects/openai/user-testing.mp4" className="w-full h-auto object-contain transition-opacity duration-500 ease-in-out" />
                <h4 className={`${mono} !opacity-100 mt-8`}>Key User Insights</h4>
                <ThreeCol items={[
                  { title: "Memory for recall, not reliving", body: "People want to look back and remember important things, rather than re-experiencing them." },
                  { title: "Surface relevant suggestions", body: "Users want personalized prompts, reminders, and tasks—both in the moment and as a recap at the end of their day." },
                ]} />
              </section>

              {/* Design Decisions */}
              <section id="design-decisions" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Design Decisions</h4>
                <h2 className="-mb-2">We identified the most intuitive way to bring this feature to life.</h2>
                <p>With insights and iteration from prototyping and testing, we got to thinking how a clear, intuitive solution could be integrated within the existing ChatGPT ecosystem.</p>
                <ProjectImage src="/projects/openai/systems-thinking.svg" alt="Systems thinking" />

                <h4 className={`${mono} !opacity-100 mt-8`}>Where we landed</h4>
                <h2 className="-mb-2">Insight 1: Memory for recall, not reliving</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {[
                    { type: "video" as const, src: "/projects/openai/ins-chat-context.mp4", title: "Moments as chat context", desc: "People want to look back and remember important things, rather than re-experiencing them." },
                    { type: "image" as const, src: "/projects/openai/ins-moment-page.png", title: "Moments log as a new page", desc: "Users want personalized prompts, reminders, and tasks—both in the moment and as a recap at the end of their day." },
                  ].map(({ type, src, title, desc }) => (
                    <div key={src} className="flex flex-col gap-4 mb-2">
                      {type === "video"
                        ? <AutoVideo src={src} />
                        : <div className="relative w-full border border-foreground/10 overflow-hidden"><Image src={src} alt={title} width={1920} height={1080} className="w-full h-auto object-cover" /></div>
                      }
                      <div>
                        <h3 className="mt-1 text-sm">{title}</h3>
                        <p className="mt-1 text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="-mb-2">Insight 2: Surface relevant suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {[
                    { type: "image" as const, src: "/projects/openai/ins-prompt.png", title: "Smart prompts in-the-moment", desc: "We want to give users relevant prompts with real-time context, in a less invasive way than our initial exploration." },
                    { type: "video" as const, src: "/projects/openai/ins-moment-prompt.mp4", title: "Smart Prompts for every moment", desc: "With prompts for every moment, users can look back on their day and get smart suggestions." },
                  ].map(({ type, src, title, desc }) => (
                    <div key={src} className="flex flex-col gap-4 mb-2">
                      {type === "video"
                        ? <AutoVideo src={src} />
                        : <div className="relative w-full border border-foreground/10 overflow-hidden"><Image src={src} alt={title} width={1920} height={1080} className="w-full h-auto object-cover" /></div>
                      }
                      <div>
                        <h3 className="mt-1 text-sm">{title}</h3>
                        <p className="mt-1 text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Hardware Constraints */}
              <section id="hardware-constraints" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Designing for Hardware Constraints</h4>
                <h2 className="-mb-2">A device that is light-weight and always-recording isn't possible, yet.</h2>
                <p>We researched a bunch of products and found that high-quality camera recording doesn't last more than a few hours.</p>
                <ProjectImage src="/projects/openai/research-devices.png" alt="Device research" />
                <p>So we had to ask:</p>
                <blockquote className="italic py-0 my-6 pl-4 border-l-2 border-foreground/30">
                  How do we maximize memory despite constraints of camera battery life?
                </blockquote>

                <h4 className={`${mono} !opacity-100 mt-8`}>Constraining the experience</h4>
                <h2 className="-mb-2">Context-based Capture</h2>
                <p>In this case, Tomo would use real-time cues to choose when to record, balancing battery with context capture.</p>
                <ProjectImage src="/projects/openai/context-based.png" alt="Context-based capture" />

                <h4 className={`${mono} !opacity-100 mt-8`}>Considerations</h4>
                {[
                  { img: "/projects/openai/cons-1.png", title: "How do we communicate rationale for recording?", desc: "We could use a notification to let users know why Tomo is recording." },
                  { img: "/projects/openai/cons-2.png", title: "Can AI detect when to record?", desc: "We found that with transcripts alone, AI is pretty good at identifying moments worth recording." },
                ].map(({ img, title, desc }) => (
                  <div key={img} className="w-full flex gap-6 my-4 items-center">
                    <div className="grid grid-cols-1 md:grid-cols-[60%_auto] md:gap-8 md:items-end w-full">
                      <div className="md:hidden flex flex-col pb-6"><h3 className="mt-2 text-sm">{title}</h3><p className="mt-1 text-sm">{desc}</p></div>
                      <div className="relative w-full border border-foreground/10 overflow-hidden">
                        <Image src={img} alt={title} width={1920} height={1080} className="w-full h-auto object-cover" />
                      </div>
                      <div className="flex flex-col h-fit">
                        <h3 className="hidden md:block mt-2 text-sm">{title}</h3>
                        <p className="hidden md:block mt-1 text-sm">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <h2 className="-mb-2">Manual Capture</h2>
                <p>In this case, the user is always manually pressing or holding down the button to capture images and videos.</p>
                <ProjectImage src="/projects/openai/manual-capture.png" alt="Manual capture" />

                <h4 className={`${mono} !opacity-100 mt-8`}>Considerations</h4>
                {[
                  { img: "/projects/openai/cons-3.png", title: "How do we remind users to record?", desc: "We could have a subtle on-device indicator to remind users to record at specific moments with non-visual cues." },
                  { img: "/projects/openai/cons-4.png", title: "What does a less visual interface look like?", desc: "We could use icons to represent moments without visual captures, and pull context from other sources, like LinkedIn headshots for coffee chats." },
                  { img: "/projects/openai/cons-5.png", title: "How do we deal with imperfect captures?", desc: "We can use AI to enhance captures, like making shots more flattering, or making blurry photos clearer." },
                ].map(({ img, title, desc }) => (
                  <div key={img} className="w-full flex gap-6 my-4 items-center">
                    <div className="grid grid-cols-1 md:grid-cols-[60%_auto] md:gap-8 md:items-end w-full">
                      <div className="md:hidden flex flex-col pb-6"><h3 className="mt-2 text-sm">{title}</h3><p className="mt-1 text-sm">{desc}</p></div>
                      <div className="relative w-full border border-foreground/10 overflow-hidden">
                        <Image src={img} alt={title} width={1920} height={1080} className="w-full h-auto object-cover" />
                      </div>
                      <div className="flex flex-col h-fit">
                        <h3 className="hidden md:block mt-2 text-sm">{title}</h3>
                        <p className="hidden md:block mt-1 text-sm">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <h2 className="-mb-2">Trading memory for privacy</h2>
                <p>With manual capture, we're making this tradeoff of less memory captured for more user privacy. This is something we should lean into as a strength. Privacy really matters to users, and we want to make it a deliberate design decision that helps us gain trust with users and lowers the barrier to entry of using a product like this.</p>
                <ProjectImage src="/projects/openai/memory-vs-privacy.png" alt="Memory vs privacy" />
                <blockquote className="italic py-0 my-6 pl-4 border-l-2 border-foreground/30">
                  This is a trade-off that we're willing to make for mass adoption.
                </blockquote>
              </section>

              {/* Reflection */}
              <section id="reflection" className="flex flex-col gap-4">
                <h4 className={`${mono} !opacity-100 mb-1`}>Reflection</h4>
                <h2 className="-mb-2">What I learned</h2>
                <ThreeCol items={[
                  { title: "Social signals matter.", body: "We can't design just for the user, but also for those who will be around them and perceive them. What does Tomo imply for social settings? How can we design hardware for self-expression?" },
                  { title: "Think in systems.", body: "It's not just about designing an amazing feature, but how it fits into the existing system, and how it fits into users' mental models." },
                ]} />
              </section>

            </div>
          </div>

          {/* ── Right spacer ── */}
          <div className="p-6 py-12 hidden md:block" />

        </main>
      </div>
    </>
  );
}
