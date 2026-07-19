"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lock, Unlock, FileText, ChevronDown } from "lucide-react";
import SectionShell, { SectionHeading } from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { vaultEntries } from "@/lib/data";

function VaultDial({ unlocked, onUnlock }: { unlocked: boolean; onUnlock: () => void }) {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      onClick={onUnlock}
      disabled={unlocked}
      aria-label={unlocked ? "Vault unlocked" : "Unlock the vault"}
      className="relative mx-auto flex h-52 w-52 md:h-64 md:w-64 items-center justify-center rounded-full group"
    >
      {/* Outer ring */}
      <motion.span
        className="absolute inset-0 rounded-full border border-gold/25"
        animate={unlocked && !reduced ? { rotate: 120, scale: 1.04, opacity: 0.4 } : { rotate: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      {/* Tick ring */}
      <motion.span
        className="absolute inset-4 rounded-full"
        style={{
          background:
            "repeating-conic-gradient(rgba(212,165,116,0.35) 0deg 1deg, transparent 1deg 12deg)",
          WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
          mask: "radial-gradient(circle, transparent 62%, black 63%)",
        }}
        animate={unlocked && !reduced ? { rotate: -200 } : { rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      {/* Core */}
      <motion.span
        className="relative z-10 flex h-28 w-28 md:h-32 md:w-32 items-center justify-center rounded-full border bg-surface"
        animate={{
          borderColor: unlocked ? "rgba(212,165,116,0.8)" : "rgba(212,165,116,0.3)",
          boxShadow: unlocked
            ? "0 0 60px rgba(212,165,116,0.25)"
            : "0 0 0px rgba(212,165,116,0)",
        }}
        transition={{ duration: 0.9 }}
      >
        {unlocked ? (
          <Unlock size={30} className="text-gold" aria-hidden />
        ) : (
          <Lock size={30} className="text-ink/60 group-hover:text-gold transition-colors" aria-hidden />
        )}
      </motion.span>
      {!unlocked && (
        <span className="absolute -bottom-9 font-mono text-[10px] tracking-widest2 uppercase text-ink/40 group-hover:text-gold transition-colors">
          Authorize access
        </span>
      )}
    </button>
  );
}

export default function Vault() {
  const [unlocked, setUnlocked] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SectionShell id="vault" className="border-t border-gold/10">
      <SectionHeading
        index="05"
        eyebrow="Cybersecurity Vault"
        title="Classified until you knock"
        intro="Research, threat models, and methodologies from real security work. The vault opens for anyone who asks — the systems it describes are not so generous."
      />

      <Reveal className="text-center">
        <VaultDial unlocked={unlocked} onUnlock={() => setUnlocked(true)} />
      </Reveal>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 grid gap-4 max-w-4xl mx-auto"
          >
            {vaultEntries.map((entry, i) => {
              const open = openId === entry.id;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.09, duration: 0.6 }}
                  className="keyline bg-surface/50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : entry.id)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-4 md:gap-6 p-6 text-left hover:bg-surface/70 transition-colors"
                  >
                    <FileText size={18} className="text-gold/70 shrink-0" aria-hidden />
                    <span className="font-mono text-[10px] tracking-widest2 text-ember/80 shrink-0 hidden sm:inline">
                      {entry.id} · {entry.clearance}
                    </span>
                    <span className="flex-1 font-display font-semibold text-base md:text-lg">
                      {entry.title}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest2 uppercase text-ink/40 hidden md:inline">
                      {entry.category}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-ink/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-7 pt-1 border-t border-gold/10">
                          <p className="pt-5 text-sm text-ink/65 leading-relaxed max-w-2xl">
                            {entry.summary}
                          </p>
                          <ul className="mt-5 space-y-2.5">
                            {entry.points.map((pt) => (
                              <li key={pt} className="flex gap-3 text-sm text-ink/70">
                                <span className="text-gold/60 mt-0.5" aria-hidden>▸</span>
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
