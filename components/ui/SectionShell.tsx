import type { ReactNode } from "react";
import Reveal from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className="flex items-center gap-4 mb-5">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            {index}
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] tracking-widest2 uppercase text-ink/50">
            {eyebrow}
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] max-w-3xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-6 max-w-2xl text-ink/60 text-lg leading-relaxed">{intro}</p>
        )}
      </Reveal>
    </div>
  );
}

export default function SectionShell({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-6 md:px-12 lg:px-20 py-24 md:py-36 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
