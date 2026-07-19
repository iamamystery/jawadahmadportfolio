"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "solid" | "ghost";
};

export default function MagneticButton({
  children,
  onClick,
  href,
  className = "",
  variant = "solid",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  function onMove(e: MouseEvent) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.28);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const styles =
    variant === "solid"
      ? "bg-gold text-night hover:bg-[#e2b988]"
      : "border border-gold/40 text-gold hover:border-gold hover:bg-gold/5";

  const inner = (
    <span
      className={`inline-flex items-center gap-3 px-8 py-4 font-mono text-xs tracking-widest2 uppercase transition-colors duration-300 ${styles} ${className}`}
    >
      {children}
    </span>
  );

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <motion.div style={{ x: sx, y: sy }}>
        {href ? (
          <a href={href} onClick={onClick} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {inner}
          </a>
        ) : (
          <button onClick={onClick} type="button" className="appearance-none">
            {inner}
          </button>
        )}
      </motion.div>
    </div>
  );
}
