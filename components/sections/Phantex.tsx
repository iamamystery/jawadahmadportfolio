import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { phantex, type MilestoneState } from "@/lib/data";

/* ---------------------------------------------------------------------------
   06 — BUILDING PHANTEX TECH

   An engineering manifesto rather than a company landing page: a factual
   snapshot, then four numbered panels, then a log of the year so far.

   There are no product cards here because there are no products yet. The
   section's credibility comes from what it declines to claim.
   --------------------------------------------------------------------------- */

/** One numbered panel. Title rail left, argument right. */
function Panel({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="group relative border-t border-ink/[0.07]">
      {/* Bronze rule drawn across the top edge on hover. */}
      <span
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold/60 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
        aria-hidden
      />

      <div className="grid gap-y-7 py-12 md:py-16 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-3">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/45 transition-colors duration-500 group-hover:text-gold">
            {index}
          </span>
          <h3
            className="mt-4 text-balance font-display font-bold text-ink/90 transition-colors duration-500 group-hover:text-ink"
            style={{
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.022em",
            }}
          >
            {title}
          </h3>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </section>
  );
}

/** Prose block — one paragraph per string, first set slightly brighter. */
function Prose({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="space-y-6">
      {paragraphs.map((p, i) => (
        <p
          key={p}
          className={`max-w-[62ch] text-pretty leading-[1.75] ${
            i === 0
              ? "text-[17px] text-ink/80 md:text-lg"
              : "text-[15px] text-slate-400 md:text-base"
          }`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

/** Milestone pip — same bronze vocabulary as the case-study status marks. */
function MilestonePip({ state }: { state: MilestoneState }) {
  const cls =
    state === "done"
      ? "bg-gold"
      : state === "current"
        ? "border border-gold/70 bg-charcoal"
        : "border border-ink/15 bg-charcoal";

  return (
    <span
      className={`relative z-10 mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${cls}`}
      aria-hidden
    />
  );
}

export default function Phantex() {
  return (
    <SectionShell id="phantex" className="border-t border-gold/10">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            06
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            The Studio
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
          Building Phantex Tech
        </h2>

        <p className="mt-7 max-w-[62ch] text-pretty text-lg leading-relaxed text-slate-400">
          {phantex.standfirst}
        </p>
      </Reveal>

      {/* ── Company snapshot ─────────────────────────────────────────── */}
      <Reveal delay={0.1}>
        <dl className="mt-16 grid gap-y-9 border-t border-ink/[0.07] pt-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 md:mt-20">
          {[
            { label: "Founded", value: phantex.established },
            { label: "Location", value: phantex.location },
            { label: "Focus", value: phantex.focus },
            { label: "Current Stage", value: phantex.stage },
          ].map((field, i) => (
            <div
              key={field.label}
              className={
                i > 0 ? "lg:border-l lg:border-ink/[0.07] lg:pl-10" : undefined
              }
            >
              <dt className="font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
                {field.label}
              </dt>
              <dd className="mt-3 text-[15px] text-ink/80">
                {Array.isArray(field.value) ? (
                  <ul className="space-y-1.5">
                    {field.value.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                ) : (
                  field.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* ── Panels ───────────────────────────────────────────────────── */}
      <div className="mt-20 border-b border-ink/[0.07] md:mt-28">
        <Reveal>
          <Panel index="01" title="Who we are">
            <Prose paragraphs={phantex.who} />
          </Panel>
        </Reveal>

        <Reveal>
          <Panel index="02" title="Mission">
            <Prose paragraphs={phantex.mission} />
          </Panel>
        </Reveal>

        <Reveal>
          <Panel index="03" title="What we build">
            <div>
              {phantex.capabilities.map((c, i) => (
                <div
                  key={c.name}
                  className={`py-6 ${
                    i > 0 ? "border-t border-ink/[0.07]" : "pt-0"
                  }`}
                >
                  <h4 className="font-display text-lg text-ink/90 md:text-xl">
                    {c.name}
                  </h4>
                  <ul className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
                    {c.items.map((item) => (
                      <li
                        key={item}
                        className="border border-ink/[0.07] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45 transition-colors duration-500 group-hover:border-gold/20 group-hover:text-ink/65"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal>
          <Panel index="04" title="Where we&rsquo;re headed">
            <Prose paragraphs={phantex.outlook} />
          </Panel>
        </Reveal>
      </div>

      {/* ── The year so far ──────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <div className="mt-20 md:mt-28">
          <div className="flex items-center gap-4">
            <span className="h-px w-14 bg-gold/40" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
              {phantex.year}
            </span>
          </div>

          <ol className="relative mt-10 max-w-[54ch]">
            {/* Spine, stopping short of the unwritten final entry. */}
            <span
              className="absolute bottom-8 left-[2.5px] top-2 w-px bg-gradient-to-b from-gold/25 to-ink/[0.06]"
              aria-hidden
            />
            {phantex.milestones.map((m) => (
              <li key={m.label} className="flex items-start gap-5 py-3.5">
                <MilestonePip state={m.state} />
                <span
                  className={`text-[15px] leading-relaxed ${
                    m.state === "pending"
                      ? "text-ink/30"
                      : m.state === "current"
                        ? "text-ink/85"
                        : "text-slate-400"
                  }`}
                >
                  {m.label}
                  {m.state === "pending" && (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest2 text-ink/20">
                      &mdash; to be written
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </SectionShell>
  );
}
