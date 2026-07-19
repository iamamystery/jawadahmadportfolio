"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { MouseEvent } from "react";

import HeroBackdrop from "./HeroBackdrop";
import HQFrame from "./HQFrame";
import HeroButton from "./HeroButton";
import { hero } from "@/lib/data";

const CoreCanvas = dynamic(() => import("./CoreCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-charcoal" aria-hidden />,
});

/** Shared easing — a long, settled decelerate. Nothing bounces in an HQ. */
const EASE = [0.22, 1, 0.36, 1] as const;

/* Choreography: the eye lands on the label, climbs the name, then reads out.
   Each step is deliberately slow; the whole sequence resolves inside 2.4s. */
const T = {
  label: 0.35,
  name: 0.55,
  nameStep: 0.11,
  roles: 1.15,
  statement: 1.3,
  cta: 1.45,
  bar: 1.7,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 1, ease: EASE },
  }),
};

/** The name reveals by sliding out from behind a clipped edge, line by line. */
const nameLine: Variants = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { delay: T.name + i * T.nameStep, duration: 1.15, ease: EASE },
  }),
};

/* The headline spans the full container while body copy stays in a narrow
   measure. Sized from the real metric: Syne ExtraBold caps run ~1.33em wide,
   so the longest line ("MUHAMMAD", 8 glyphs) needs ~10.6em of width. The
   clamp is derived from the tightest breakpoint — a 320px viewport, where
   the available measure is 272px — with headroom on top of that.
   Pulled back ~12% from the previous setting so the name reads as a mark
   rather than filling its box. */
const NAME_SIZE = "clamp(1.35rem, 6.7vw, 5.75rem)";

/* Optical left alignment. Set flush left, each line starts at its glyph's
   *advance* origin, not its ink — so the left edge comes out ragged by the
   width of each cap's side bearing. These offsets cancel that bearing so the
   ink itself aligns.

   Values are the negative of the side bearings measured in the browser at
   92px Syne ExtraBold, not estimates: M/H/N carry ~0.065em, J ~0.022em, and
   A carries none at all — its diagonal already reaches the origin, so it
   needs only a hair of hang rather than the large pull a flat stem needs.
   Keyed by first letter so the table survives a change of name; unlisted
   letters fall back to no correction. */
const OPTICAL_INSET: Record<string, string> = {
  M: "-0.065em",
  H: "-0.065em",
  N: "-0.065em",
  O: "-0.054em",
  C: "-0.054em",
  G: "-0.054em",
  S: "-0.033em",
  J: "-0.022em",
  // Diagonals sit near-flush already; a slight hang keeps them from
  // reading as indented next to a flat stem.
  A: "-0.010em",
  V: "-0.010em",
  W: "-0.010em",
};

export default function Hero() {
  const reduced = useReducedMotion();

  function scrollTo(e: MouseEvent<HTMLElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <header
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-charcoal"
    >
      <CoreCanvas reduced={!!reduced} />
      <HeroBackdrop />
      <HQFrame />

      {/* ── Main block — optically centred in the remaining space ────── */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-14 lg:py-24">
          {/* Label */}
          <motion.div
            custom={T.label}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center gap-4"
          >
            <span className="h-px w-8 bg-gold/40 sm:w-12" />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-gold/75 sm:text-[11px]">
              {hero.label}
            </span>
          </motion.div>

          {/* Name — full container width. The last line is the signature. */}
          <h1
            className="mt-7 font-display font-extrabold uppercase sm:mt-9"
            style={{
              fontSize: NAME_SIZE,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              fontKerning: "normal",
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              textRendering: "optimizeLegibility",
            }}
          >
            {hero.nameLines.map((word, i) => {
              const isSignature = i === hero.nameLines.length - 1;
              return (
                <span
                  key={word}
                  className="hq-line-mask"
                  style={{ marginLeft: OPTICAL_INSET[word[0].toUpperCase()] ?? "0" }}
                >
                  <motion.span
                    custom={i}
                    variants={nameLine}
                    initial="hidden"
                    animate="show"
                    className={`block w-fit ${
                      isSignature ? "hq-name-accent" : "hq-name-line"
                    }`}
                    /* Stagger the highlight so it rakes across the block
                       diagonally rather than striking all lines at once. */
                    style={{ animationDelay: `${i * 0.22}s` }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </h1>

          {/* Body column — deliberately narrower than the headline */}
          <div className="max-w-2xl">
            {/* Roles */}
            <motion.div
              custom={T.roles}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5"
            >
              {hero.roles.map((role, i) => (
                <span key={role} className="flex items-center gap-4 sm:gap-5">
                  {i > 0 && <span className="h-3 w-px bg-copper/35" aria-hidden />}
                  <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/60 sm:text-[11px]">
                    {role}
                  </span>
                </span>
              ))}
            </motion.div>

            {/* Statement */}
            <motion.p
              custom={T.statement}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-7 max-w-[54ch] text-[15px] leading-relaxed text-slate-400 sm:text-base md:text-[17px] md:leading-[1.7]"
            >
              {hero.statement}
            </motion.p>

            {/* Call to action — one, deliberately. The extra top margin gives
                the single button the room the pair used to occupy. */}
            <motion.div
              custom={T.cta}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-10 sm:mt-12"
            >
              <HeroButton
                href={hero.primaryCta.href}
                onClick={(e) => scrollTo(e, hero.primaryCta.href)}
              >
                {hero.primaryCta.label}
                <ArrowDown size={14} aria-hidden />
              </HeroButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Instrument bar — stack left, scroll cue right ─────────────── */}
      <motion.div
        custom={T.bar}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 md:px-14 md:pb-10"
      >
        <div className="h-px w-full bg-gradient-to-r from-copper/25 via-copper/10 to-transparent" />
        <div className="mt-5 flex items-end justify-between gap-6">
          <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            {hero.stack.map((tech) => (
              <li
                key={tech}
                className="border border-ink/[0.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 transition-colors duration-300 hover:border-gold/25 hover:text-ink/70"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 flex-col items-center gap-2.5 sm:flex">
            <span className="font-mono text-[9px] uppercase tracking-widest2 text-ink/25">
              Scroll
            </span>
            <span className="relative h-9 w-px overflow-hidden bg-ink/10">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-gold/70"
                animate={reduced ? undefined : { y: ["-100%", "300%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
