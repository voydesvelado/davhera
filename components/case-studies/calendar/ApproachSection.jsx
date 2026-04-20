"use client";

import Image from "next/image";

import { motion, useReducedMotion } from "framer-motion";

export default function ApproachSection() {
  const reduceMotion = useReducedMotion();

  const item = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 10, filter: "blur(6px)" },
    show: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <section className="w-full bg-[#0B0B0C] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-8 py-28">
        <div className="max-w-[980px]">
          {/* Eyebrow */}
          <motion.p
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[16px] font-medium tracking-[-0.04em] text-white/80"
          >
            Approach
          </motion.p>

          {/* Title */}
          <motion.h2
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.85,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[48px] font-medium tracking-[-0.04em] leading-none"
          >
            We focused on testing ideas early to validate what actually works
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[24px] font-normal tracking-[-0.04em] leading-normal text-white/85"
          >
            Rather than redesigning the calendar all at once, we worked in short
            cycles to validate assumptions with users. Research insights
            informed early prototypes, which were reviewed and adjusted through
            continuous feedback. This approach allowed us to move with clarity,
            reduce risk, and focus on solutions that genuinely improved the user
            experience.
          </motion.p>
        </div>

        {/* Full-width image (no container) */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.95,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mt-14 w-full overflow-hidden rounded-2xl"
        >
          {/* Keep the same editorial radius like reference */}
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/case-studies/dior/approach.png"
              alt="Early validation sessions and iterative prototyping for Dior LatAm intranet"
              fill
              className="object-cover"
              sizes="100vw"
              quality={100}
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
