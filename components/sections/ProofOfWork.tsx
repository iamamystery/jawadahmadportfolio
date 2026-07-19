"use client";

import { motion } from "framer-motion";
import { Award, FlaskConical } from "lucide-react";
import SectionShell, { SectionHeading } from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import Counter from "../ui/Counter";
import { proof } from "@/lib/data";

export default function ProofOfWork() {
  return (
    <SectionShell id="proof" className="border-t border-gold/10">
      <SectionHeading
        index="09"
        eyebrow="Proof of Work"
        title="The numbers behind the claims"
        intro="Metrics, achievements, and active research — measured, not asserted."
      />

      {/* Headline counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {proof.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="keyline bg-surface/50 p-8 relative overflow-hidden group hover:border-gold/30 transition-colors">
              <div className="absolute top-0 left-0 h-px w-full bg-gold-line opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
              <div className="font-display font-bold text-4xl md:text-5xl text-gold">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 font-mono text-[10px] tracking-widest2 uppercase text-ink/50">
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Distribution bars */}
        <Reveal className="lg:col-span-1">
          <div className="keyline bg-surface/40 p-8 h-full">
            <p className="font-mono text-[10px] tracking-widest2 uppercase text-gold/70 mb-7">
              Work distribution
            </p>
            <div className="space-y-6">
              {proof.breakdown.map((b, i) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ink/70">{b.label}</span>
                    <span className="font-mono text-xs text-gold">{b.value}</span>
                  </div>
                  <div className="h-[3px] bg-ink/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold to-ember"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: b.value / b.max }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Achievements */}
        <Reveal delay={0.1} className="lg:col-span-1">
          <div className="keyline bg-surface/40 p-8 h-full">
            <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest2 uppercase text-gold/70 mb-7">
              <Award size={13} aria-hidden /> Achievements
            </p>
            <ul className="space-y-4">
              {proof.achievements.map((a) => (
                <li key={a} className="flex gap-3 text-sm text-ink/70 leading-relaxed">
                  <span className="text-gold/60 mt-0.5" aria-hidden>▸</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Research */}
        <Reveal delay={0.2} className="lg:col-span-1">
          <div className="keyline bg-surface/40 p-8 h-full">
            <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest2 uppercase text-gold/70 mb-7">
              <FlaskConical size={13} aria-hidden /> Active research
            </p>
            <ul className="space-y-4">
              {proof.research.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-ink/70 leading-relaxed">
                  <span className="text-ember/70 mt-0.5" aria-hidden>▸</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
