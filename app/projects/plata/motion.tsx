"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  amount?: number;
  className?: string;
  onMount?: boolean;
  as?: "div" | "section" | "h1" | "h2" | "h3" | "p" | "span";
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  y = 16,
  amount = 0.35,
  className,
  onMount = false,
  as = "div",
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y, filter: "blur(6px)" };
  const show = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  const trigger = onMount
    ? { animate: show }
    : { whileInView: show, viewport: { once: true, amount } };

  return (
    <Comp
      className={className}
      initial={hidden}
      {...trigger}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
  delayChildren?: number;
  staggerChildren?: number;
};

export function Stagger({
  children,
  className,
  style,
  amount = 0.2,
  delayChildren = 0.1,
  staggerChildren = 0.09,
}: StaggerProps) {
  const container: Variants = {
    hidden: {},
    show: {
      transition: { delayChildren, staggerChildren },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

export function StaggerItem({ children, className, y = 24 }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  const item: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y, filter: "blur(8px)" },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.4 } }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE },
        },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
