"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionShell, { SectionHeading } from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { systemNodes, systemEdges, type SystemNode } from "@/lib/data";

const NODE_W = 118;
const NODE_H = 46;

function nodeById(id: string) {
  return systemNodes.find((n) => n.id === id)!;
}

export default function SystemsGallery() {
  const [selected, setSelected] = useState<SystemNode>(systemNodes[1]);

  return (
    <SectionShell id="systems">
      <SectionHeading
        index="04"
        eyebrow="Systems Gallery"
        title="A reference architecture, explorable"
        intro="This is how I think about production systems. Select any component to see what it does — and the engineering decisions behind it."
      />

      <Reveal>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Diagram */}
          <div className="lg:col-span-2 keyline bg-surface/30 p-4 md:p-6 overflow-x-auto">
            <svg
              viewBox="0 0 820 400"
              className="w-full min-w-[640px] h-auto"
              role="group"
              aria-label="Interactive system architecture diagram"
            >
              <defs>
                <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" fill="rgba(212,165,116,0.45)" />
                </marker>
              </defs>

              {/* Edges */}
              {systemEdges.map(([a, b], i) => {
                const A = nodeById(a);
                const B = nodeById(b);
                const highlighted = selected.id === a || selected.id === b;
                return (
                  <g key={`${a}-${b}-${i}`}>
                    <line
                      x1={A.x + NODE_W / 2}
                      y1={A.y}
                      x2={B.x - NODE_W / 2 - 6}
                      y2={B.y}
                      stroke={highlighted ? "#FF6B35" : "rgba(212,165,116,0.28)"}
                      strokeWidth={highlighted ? 1.6 : 1}
                      strokeDasharray="5 6"
                      markerEnd="url(#arrow)"
                      className="transition-all duration-300"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="22"
                        to="0"
                        dur="1.6s"
                        repeatCount="indefinite"
                      />
                    </line>
                  </g>
                );
              })}

              {/* Nodes */}
              {systemNodes.map((n) => {
                const active = selected.id === n.id;
                return (
                  <g
                    key={n.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${n.label}: ${n.kind}`}
                    aria-pressed={active}
                    onClick={() => setSelected(n)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(n)}
                    className="cursor-pointer outline-none focus-visible:opacity-100"
                    style={{ opacity: active ? 1 : 0.85 }}
                  >
                    <rect
                      x={n.x - NODE_W / 2}
                      y={n.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                      fill={active ? "rgba(212,165,116,0.14)" : "#111827"}
                      stroke={active ? "#D4A574" : "rgba(212,165,116,0.28)"}
                      strokeWidth={active ? 1.5 : 1}
                      className="transition-all duration-300"
                    />
                    {active && (
                      <rect
                        x={n.x - NODE_W / 2 - 5}
                        y={n.y - NODE_H / 2 - 5}
                        width={NODE_W + 10}
                        height={NODE_H + 10}
                        fill="none"
                        stroke="rgba(255,107,53,0.5)"
                        strokeWidth={1}
                      />
                    )}
                    <text
                      x={n.x}
                      y={n.y - 2}
                      textAnchor="middle"
                      fill={active ? "#D4A574" : "#F8FAFC"}
                      fontSize="13"
                      fontWeight="600"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {n.label}
                    </text>
                    <text
                      x={n.x}
                      y={n.y + 14}
                      textAnchor="middle"
                      fill="rgba(248,250,252,0.4)"
                      fontSize="8.5"
                      letterSpacing="2"
                      style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                    >
                      {n.kind.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <div className="keyline bg-surface/50 p-8 relative overflow-hidden min-h-[320px]">
            <div className="absolute top-0 left-0 h-px w-full bg-gold-line" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-mono text-[10px] tracking-widest2 uppercase text-ember/80">
                  {selected.kind}
                </p>
                <h3 className="mt-2 font-display font-bold text-2xl md:text-3xl">
                  {selected.label}
                </h3>
                <p className="mt-4 text-sm text-ink/65 leading-relaxed">{selected.detail}</p>
                <p className="mt-7 mb-3 font-mono text-[10px] tracking-widest2 uppercase text-gold/70">
                  Design decisions
                </p>
                <ul className="space-y-2.5">
                  {selected.decisions.map((d) => (
                    <li key={d} className="flex gap-3 text-sm text-ink/70">
                      <span className="text-gold/60 mt-0.5" aria-hidden>▸</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
