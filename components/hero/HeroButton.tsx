"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
};

/**
 * The hero's single call to action. Magnetic, with a copper wipe that fills
 * from the left on hover. Hero-local by design: the site-wide MagneticButton
 * is tuned for the Contact section and shouldn't inherit this treatment.
 */
export default function HeroButton({ children, href, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.6 });

  function onMove(e: MouseEvent) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.22);
    y.set((e.clientY - r.top - r.height / 2) * 0.22);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  /* Standing alone, the button carries a faint bronze wash at rest so it holds
     the composition without the wipe having to do all the work. */
  const content = (
    <span
      className={[
        "group relative inline-flex items-center gap-3.5 overflow-hidden",
        "px-9 py-[1.15rem]",
        "font-mono text-xs uppercase tracking-widest2",
        "border border-gold/55 bg-gold/[0.05] text-gold",
        "transition-colors duration-500 hover:border-gold hover:text-charcoal",
      ].join(" ")}
    >
      <span
        className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
        aria-hidden
      />
      <span className="relative z-10 flex items-center gap-3.5">{children}</span>
    </span>
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      <motion.div style={{ x: sx, y: sy }}>
        {href ? (
          <a
            href={href}
            onClick={onClick}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
          >
            {content}
          </a>
        ) : (
          <button type="button" onClick={onClick} className="appearance-none">
            {content}
          </button>
        )}
      </motion.div>
    </div>
  );
}
