"use client";

import { motion } from "framer-motion";

/**
 * Everything behind the type: blueprint grid, legibility vignette, and the
 * transition into the site's `night` base. Entirely static — no pointer
 * tracking, no synthetic cursor.
 */
export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Blueprint grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="hq-grid hq-fade absolute inset-0"
      />

      {/* Legibility vignette behind the headline */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 52% at 28% 48%, rgba(8,10,13,0.9) 0%, rgba(8,10,13,0.55) 45%, transparent 78%)",
        }}
      />

      {/* Top + bottom falloff, resolving into the site's night base so the
          hero meets the next section without a visible seam. */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-charcoal to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent via-charcoal/85 to-night" />
    </div>
  );
}
