"use client";

import { motion } from "framer-motion";
import { hero, identity } from "@/lib/data";

const CORNER = "h-10 w-10 border-copper/25 absolute";

/**
 * The instrument bezel: corner brackets, edge telemetry, and a live status
 * pip. Purely decorative — hidden from assistive tech.
 */
export default function HQFrame() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 z-20 hidden sm:block"
      aria-hidden
    >
      {/* Corner brackets */}
      <div className="absolute inset-4 md:inset-7">
        <div className={`${CORNER} left-0 top-0 border-l border-t`} />
        <div className={`${CORNER} right-0 top-0 border-r border-t`} />
        <div className={`${CORNER} bottom-0 left-0 border-b border-l`} />
        <div className={`${CORNER} bottom-0 right-0 border-b border-r`} />
      </div>

      {/* Top-left — station identity + live pip */}
      <div className="absolute left-10 top-8 flex items-center gap-2.5 md:left-14 md:top-11">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 [animation-duration:3s]" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold/80" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/35">
          {hero.telemetry.node}
        </span>
      </div>

      {/* Top-right — location */}
      <div className="absolute right-10 top-8 text-right md:right-14 md:top-11">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
          {identity.location}
        </span>
      </div>

      {/* Left rail — vertical coordinates */}
      <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block md:left-11">
        <span
          className="block font-mono text-[10px] uppercase tracking-widest2 text-ink/20"
          style={{ writingMode: "vertical-rl" }}
        >
          {hero.telemetry.coordinates}
        </span>
      </div>

      {/* Right rail — vertical status */}
      <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block md:right-11">
        <span
          className="block font-mono text-[10px] uppercase tracking-widest2 text-ink/20"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {hero.telemetry.status}
        </span>
      </div>
    </motion.div>
  );
}
