"use client";

import { motion, useReducedMotion } from "framer-motion";
import SwapVisual from "@/components/case-studies/SwapVisual";

export default function BackgroundSection() {
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
      <div className="mx-auto w-full max-w-[1200px] px-8 py-24">
        <div className="max-w-[980px]">
          <motion.p
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[16px] font-medium leading-none tracking-[-0.04em] text-white/80"
          >
            Background
          </motion.p>

          <motion.h2
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.8,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[48px] font-medium leading-none tracking-[-0.04em]"
          >
            Upgrading Dior LatAm’s file management experience
          </motion.h2>

          <motion.p
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[24px] font-normal leading-normal tracking-[-0.04em] text-white/85"
          >
            Dior Latin America teams relied on a file repository that was
            difficult to navigate and inefficient to use. Poor UI decisions and
            a fragmented information structure made it hard to locate assets
            quickly. As a result, everyday tasks took longer than necessary,
            increasing frustration and reducing overall productivity.
          </motion.p>
        </div>

        {/* Frame + Swap (misma lógica que SwapVisual) */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 w-full"
        >
          <SwapVisual
            src1="/case-studies/dior/repository/background-o.png"
            src2="/case-studies/dior/repository/background-n.png"
            alt1="Old Dior LatAm intranet interface"
            alt2="New Dior LatAm intranet interface"
            containerHeight={672} // como tu estándar
            imageHeight={600} // ✅ MISMA altura para 1 y 2
            maxWidth={1100} // ajusta si lo quieres más ancho
            widthPercent={92}
            bgColor="#E9DFE5"
            rounded="rounded-2xl"
            innerRounded="rounded-xl"
            showFrame={true}
            // ✅ transición más larga (igual vibe que SwapVisual)
            holdMs={950}
            inDuration={1.35}
            outDuration={1.2}
            blurPx={10}
            inScale={1.01}
            outScale={0.995}
            amount={0.45}
            once={true}
            sizes="(max-width: 1200px) 92vw, 1100px"
          />
        </motion.div>
      </div>
    </section>
  );
}
