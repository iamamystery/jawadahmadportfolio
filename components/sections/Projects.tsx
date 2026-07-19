import { ArrowUpRight } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { projects, type Project, type ProjectStatus } from "@/lib/data";

/* ---------------------------------------------------------------------------
   03 — ENGINEERING CASE STUDIES

   Case files, not cards. The flagship takes the top of the section as a full
   feature; the rest follow as a consistent dossier ledger beneath it. The
   hierarchy is carried by scale, spacing and a single bronze rule rather
   than by colour or elevation.

   There is deliberately no modal: every field shown here is author-supplied,
   and inventing architecture or performance detail for real shipped systems
   is not something a case study can afford.
   --------------------------------------------------------------------------- */

/** Status pip. One bronze family, differentiated by fill rather than hue. */
function Status({ status }: { status: ProjectStatus }) {
  const pip =
    status === "Live"
      ? "bg-gold"
      : status === "In Development"
        ? "border border-gold/70 bg-transparent"
        : "bg-ink/25";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`h-1.5 w-1.5 rounded-full ${pip}`} aria-hidden />
      <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/55">
        {status}
      </span>
    </span>
  );
}

/** Technology labels — the Hero's badge treatment, reused for continuity. */
function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {items.map((t) => (
        <li
          key={t}
          className="border border-ink/[0.07] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45 transition-colors duration-500 group-hover:border-gold/20 group-hover:text-ink/65"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/** External link, or inert text when there is nothing to link to yet. */
function CaseLink({
  label,
  href,
  strong = false,
}: {
  label: string;
  href: string | null;
  strong?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors duration-300";

  if (!href) {
    return (
      <span className={`${base} cursor-default text-ink/30`}>
        {label}
        <span className="text-ink/20" aria-hidden>
          &mdash;
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${base} group/link ${
        strong ? "text-gold hover:text-ink" : "text-ink/55 hover:text-gold"
      }`}
    >
      {label}
      <ArrowUpRight
        size={13}
        aria-hidden
        className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
    </a>
  );
}

/** Small label/value pair used in both the flagship rail and the ledger. */
function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
        {label}
      </dt>
      <dd className="mt-2 text-[15px] text-ink/80">{children}</dd>
    </div>
  );
}

/* --- Flagship ------------------------------------------------------------- */

function Flagship({ project }: { project: Project }) {
  return (
    <Reveal>
      <article className="group relative">
        {/* The single bronze rule that marks this as the centerpiece. */}
        <div
          className="h-px w-full bg-gradient-to-r from-gold/70 via-gold/25 to-transparent"
          aria-hidden
        />

        {/* Elevation is a whisper — 1.5% white, no glass, no blur. */}
        <div className="bg-ink/[0.015] px-6 py-12 transition-colors duration-700 group-hover:bg-ink/[0.028] md:px-10 md:py-16">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-gold">
              Flagship Project
            </span>
            <span className="h-3 w-px bg-gold/30" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/35">
              {project.code}
            </span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-x-12">
            {/* Title, summary, stack */}
            <div className="lg:col-span-7">
              <h3
                className="text-balance font-display font-bold text-ink"
                style={{
                  fontSize: "clamp(1.9rem, 3.6vw, 3.15rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                {project.name}
              </h3>

              <p className="mt-7 max-w-[58ch] text-pretty text-[15px] leading-[1.75] text-slate-400 md:text-base">
                {project.summary}
              </p>

              <div className="mt-9">
                <Stack items={project.technologies} />
              </div>
            </div>

            {/* Specification rail */}
            <div className="lg:col-span-4 lg:col-start-9">
              <dl className="space-y-7">
                <Meta label="Category">{project.category}</Meta>
                <Meta label="Status">
                  <Status status={project.status} />
                </Meta>
              </dl>

              <div className="mt-10 flex flex-col items-start gap-4 border-t border-ink/[0.07] pt-7">
                <CaseLink
                  label={project.live ? "Live Demo" : "Live Demo · Coming Soon"}
                  href={project.live}
                  strong
                />
                {/* Whichever link actually works carries the accent — a
                    disabled label must never outrank a live one. */}
                <CaseLink
                  label="Source"
                  href={project.github}
                  strong={!project.live}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* --- Ledger row ----------------------------------------------------------- */

function CaseRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="group relative border-t border-ink/[0.07]">
        {/* Divider animation: a bronze rule drawn across the row's top edge. */}
        <span
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold/60 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          aria-hidden
        />

        <div className="px-2 py-11 transition-colors duration-700 group-hover:bg-ink/[0.018] md:px-6 md:py-14">
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            {/* Case file + title + summary */}
            <div className="lg:col-span-6">
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
                {project.code}
              </span>

              <h3
                className="mt-4 text-balance font-display font-bold text-ink/90 transition-all duration-500 group-hover:translate-x-1 group-hover:text-ink"
                style={{
                  fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.026em",
                }}
              >
                {project.name}
              </h3>

              <p className="mt-5 max-w-[52ch] text-pretty text-[14px] leading-relaxed text-slate-400 transition-colors duration-500 group-hover:text-slate-300 md:text-[15px]">
                {project.summary}
              </p>
            </div>

            {/* Specification */}
            <div className="lg:col-span-3">
              <dl className="space-y-6">
                <Meta label="Category">
                  <span className="text-[14px]">{project.category}</span>
                </Meta>
                <Meta label="Status">
                  <Status status={project.status} />
                </Meta>
              </dl>
            </div>

            {/* Stack + links */}
            <div className="lg:col-span-3">
              <Stack items={project.technologies} />
              <div className="mt-7 flex flex-col items-start gap-3.5">
                <CaseLink
                  label={project.live ? "Live Demo" : "Live Demo · Coming Soon"}
                  href={project.live}
                  strong
                />
                {/* Whichever link actually works carries the accent — a
                    disabled label must never outrank a live one. */}
                <CaseLink
                  label="Source"
                  href={project.github}
                  strong={!project.live}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* --- Section -------------------------------------------------------------- */

export default function Projects() {
  const flagship = projects.find((p) => p.flagship);
  const rest = projects.filter((p) => !p.flagship);

  return (
    <SectionShell id="projects" className="border-t border-gold/10">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            03
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            Case Files
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
          Engineering case studies
        </h2>

        <p className="mt-7 max-w-[56ch] text-pretty text-lg leading-relaxed text-slate-400">
          Production systems I&rsquo;ve designed and engineered &mdash; what each
          one solves, how it is built, and where to explore it.
        </p>
      </Reveal>

      {/* ── Flagship ─────────────────────────────────────────────────── */}
      {flagship && (
        <div className="mt-20 md:mt-28">
          <Flagship project={flagship} />
        </div>
      )}

      {/* ── Ledger ───────────────────────────────────────────────────── */}
      <div className="mt-24 border-b border-ink/[0.07] md:mt-32">
        {rest.map((p, i) => (
          <CaseRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
