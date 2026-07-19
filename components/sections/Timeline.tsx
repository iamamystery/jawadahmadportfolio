"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion";
import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { timeline, type TimelineEvent } from "@/lib/data";

/* ---------------------------------------------------------------------------
   08 — THE JOURNEY SO FAR

   A biography, so it runs as a single column down one rail rather than
   alternating left and right — zig-zag timelines read as pitch decks. The
   bronze rail fills with scroll progress, and whichever milestone is in view
   lifts slightly: its node fills and takes a soft bronze ring.

   Rail geometry is shared between the track, the nodes and the year column,
   so the three stay locked together at every breakpoint.
   --------------------------------------------------------------------------- */

/* Rail sits at 6px on narrow screens and 11rem on lg, where the year column
   occupies the 10rem to its left. "Future" is the widest year, so the column
   is sized for it rather than for a four-digit number. */
const RAIL = "left-[6px] lg:left-[11rem]";
const CONTENT_INSET = "pl-10 lg:pl-[13rem]";

function Milestone({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  // Activates once the milestone reaches the comfortable reading band.
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });

  return (
    <li ref={ref} className={`relative ${CONTENT_INSET}`}>
      {/* Node */}
      <span
        className={`absolute ${RAIL} top-[0.6rem] z-10 h-[9px] w-[9px] -translate-x-1/2 rounded-full border transition-all duration-700 ${
          active
            ? "border-gold bg-gold shadow-[0_0_0_5px_rgba(212,165,116,0.10)]"
            : "border-gold/35 bg-charcoal"
        }`}
        aria-hidden
      />

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 26 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Year — inline on narrow screens, in its own rail column on lg */}
        <span
          className={`block font-display font-bold leading-none transition-colors duration-700 lg:absolute lg:left-0 lg:top-0 lg:w-40 lg:text-right ${
            active ? "text-gold" : "text-gold/40"
          }`}
          style={{
            fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {event.year}
        </span>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest2 text-ink/40 lg:mt-0">
          {event.label}
        </p>

        <h3
          className={`mt-3 text-balance font-display font-bold transition-colors duration-700 ${
            active ? "text-ink" : "text-ink/85"
          }`}
          style={{
            fontSize: "clamp(1.25rem, 1.9vw, 1.65rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.022em",
          }}
        >
          {event.title}
        </h3>

        <p className="mt-4 max-w-[58ch] text-pretty text-[15px] leading-[1.75] text-slate-400">
          {event.body}
        </p>
      </motion.div>

      <span className="sr-only">{`Milestone ${index + 1} of ${timeline.length}`}</span>
    </li>
  );
}

export default function Timeline() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <SectionShell id="journey" className="border-t border-gold/10">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            08
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            Journey
          </span>
        </div>

        <h2
          className="text-balance font-display font-bold text-ink"
          style={{
            fontSize: "clamp(2.25rem, 5.4vw, 4.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.032em",
          }}
        >
          The journey so far
        </h2>

        <p className="mt-7 max-w-[56ch] text-pretty text-lg leading-relaxed text-slate-400">
          Every engineer starts somewhere. This is the path that shaped how I
          build software today.
        </p>
      </Reveal>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <div ref={railRef} className="relative mt-20 md:mt-28">
        {/* Track */}
        <span
          className={`absolute ${RAIL} bottom-2 top-2 w-px -translate-x-1/2 bg-ink/[0.08]`}
          aria-hidden
        />
        {/* Progress fill — scroll-linked, so it is left solid when the viewer
            prefers reduced motion rather than animating under them. */}
        <motion.span
          className={`absolute ${RAIL} bottom-2 top-2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold/80 via-gold/50 to-gold/15`}
          style={reduced ? undefined : { scaleY: progress }}
          aria-hidden
        />

        <ol className="space-y-20 md:space-y-28">
          {timeline.map((e, i) => (
            <Milestone key={e.year} event={e} index={i} />
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
