import Image from "next/image";
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";

const photos = [
  { src: "/about/about1.png", alt: "About image 1" },
  { src: "/about/about2.png", alt: "About image 2" },
  { src: "/about/about3.png", alt: "About image 3" },
  { src: "/about/about4.png", alt: "About image 4" },
  { src: "/about/about6.png", alt: "About image 5" },
  { src: "/about/about7.png", alt: "About image 6" },
];

export default function About() {
  return (
    <>
      <Navbar activePath="/about" />
      <div className="flex flex-col p-6 w-full items-center gap-12 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col justify-between w-full max-w-[1800px] gap-12 min-h-[calc(100vh-120px)]">

          {/* Hero text */}
          <div className="flex flex-col gap-8 py-8">
            <h1 className="font-[family-name:var(--font-lora)] text-[52px] leading-[1.1] lg:w-1/2 lg:min-w-[640px]" style={{ color: "var(--project-ink)" }}>
              I&apos;m a designer, builder, &amp; creative—always seeking new adventures.
            </h1>

            <div className="flex flex-col md:flex-row gap-12 lg:w-2/5 lg:min-w-[640px]">
              <div className="flex flex-col gap-3 max-w-[720px] font-[family-name:var(--font-geist)] text-[15px]" style={{ color: "var(--project-ink-muted)" }}>
                <p>I think deeply about people, products, and the future of technology. Currently rabbit-holing into the world of human-AI interaction.</p>
                <p>
                  Open to contract and freelance opportunities. If you&apos;re working on something cool,{" "}
                  <a href="mailto:hello@davhera.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity">
                    let&apos;s chat!
                  </a>
                </p>
                <p>Outside of design, engineering, and being a developer, I&apos;m:</p>
                <ul className="list-disc list-inside pl-3">
                  <li>exploring new cities and cultures</li>
                  <li>searching for good food</li>
                  <li>building side projects</li>
                  <li>reading, reading, &amp; reading</li>
                </ul>
                <p>
                  To befriend me or hire me, reach out on{" "}
                  <a href="https://www.linkedin.com/in/daveherv/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-60 transition-opacity">LinkedIn</a>,{" "}
                  <a href="https://x.com/daveherv" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-60 transition-opacity">X</a>, or by{" "}
                  <a href="mailto:hello@davhera.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity">email</a>—can&apos;t wait to meet you!
                </p>
              </div>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {photos.map(({ src, alt }) => (
              <div key={src} className="relative w-full aspect-square border border-foreground/10 overflow-hidden">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover transition-opacity duration-500 ease-in-out"
                  sizes="(max-width: 1024px) 50vw, 16vw"
                />
              </div>
            ))}
          </div>

        </main>
      </div>
      <Footer />
    </>
  );
}
