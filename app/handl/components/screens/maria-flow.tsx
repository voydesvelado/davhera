"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import s from "../../handl.module.css";
import { DEFAULT_PROVIDER } from "../../data";
import type { Nav } from "../types";
import { Avatar, CameraIcon, SendIcon, staggerContainer, fadeUp } from "../primitives";
import { ProviderCard } from "./options-flow";

/* ==========================================================================
 * 5.16a chatMaria
 * ========================================================================== */
export function ChatMaria({ nav }: { nav: Nav }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  // step: 0 = user bubble, 1 = typing, 2 = maria1, 3 = typing2, 4 = maria2
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase(4);
      const t = setTimeout(() => nav.go("mariaPlan"), 800);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 1150);
    const t3 = setTimeout(() => setPhase(3), 1400);
    const t4 = setTimeout(() => setPhase(4), 2300);
    const t5 = setTimeout(() => nav.go("mariaPlan"), 4200);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [nav, reduced]);

  const bubble = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.15 : 0.3, delay: reduced ? 0 : delay },
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" onClick={() => nav.go("mariaPlan")}>
      <div className={s.appbar}>
        <div className={s.appbarLeft}>
          <Avatar initials="MT" photo="/handl/img/maria.jpg" dark />
          <div>
            <div className={s.appbarTitle}>Maria Torres</div>
            <span className={s.online}>Care navigator · online now</span>
          </div>
        </div>
      </div>

      <motion.div variants={fadeUp} className={s.card}>
        <p className={s.whisper}>
          Maria can see what you have entered so far. No need to repeat
          yourself.
        </p>
      </motion.div>

      <div className={s.chat} style={{ marginTop: 12 }}>
        <motion.div {...bubble(0)} className={`${s.bubble} ${s.bubbleUser}`}>
          My doctor says I need my knee operated but I'm honestly not sure which
          surgery it is
        </motion.div>

        {phase >= 1 && phase < 2 && (
          <motion.div className={s.typing} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span /><span /><span />
          </motion.div>
        )}
        {phase >= 2 && (
          <motion.div {...bubble(0)} className={`${s.bubble} ${s.bubbleMaria}`}>
            Happy to help, Jenny. Does your order mention a small camera, called
            an arthroscopy, or a replacement?
          </motion.div>
        )}
        {phase >= 3 && phase < 4 && (
          <motion.div className={s.typing} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span /><span /><span />
          </motion.div>
        )}
        {phase >= 4 && (
          <motion.div {...bubble(0)} className={`${s.bubble} ${s.bubbleMaria}`}>
            If you have the order handy, you can also send me a photo of it
            here.
          </motion.div>
        )}
      </div>

      <div className={s.chatbar} style={{ marginTop: "auto" }}>
        <span style={{ color: "var(--muted)" }}><CameraIcon /></span>
        <span className={s.placeholder}>Message Maria</span>
        <span className={s.chatbarIcon}><SendIcon /></span>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.16b mariaPlan
 * ========================================================================== */
export function MariaPlan({ nav }: { nav: Nav }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase(4);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 3000);
    const t4 = setTimeout(() => setPhase(4), 4200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [reduced]);

  const bubble = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: reduced ? 0 : delay },
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div className={s.appbar}>
        <div className={s.appbarLeft}>
          <Avatar initials="MT" photo="/handl/img/maria.jpg" dark />
          <div>
            <div className={s.appbarTitle}>Maria Torres</div>
            <span className={s.online}>Care navigator · online now</span>
          </div>
        </div>
      </div>

      <div className={s.chat} style={{ marginTop: 12 }}>
        {phase >= 1 && (
          <motion.div {...bubble(0)} className={`${s.bubble} ${s.bubbleMaria}`}>
            Found it. Your order is a knee arthroscopy. I checked your plan and
            your network, and this is the strongest option near you:
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div {...bubble(0)} style={{ alignSelf: "stretch" }}>
            <ProviderCard
              provider={DEFAULT_PROVIDER}
              badge="Maria's pick · best value"
              cta="Open the full estimate"
              onCta={() => nav.go("estimate")}
            />
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div {...bubble(0)} className={`${s.bubble} ${s.bubbleMaria}`}>
            This is the same estimate the app builds. I just walked there with
            you. Want me to stay on while you book?
          </motion.div>
        )}

        {phase >= 4 && (
          <motion.div {...bubble(0)} className={`${s.bubble} ${s.bubbleUser}`}>
            Thanks Maria, this helps a lot
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
