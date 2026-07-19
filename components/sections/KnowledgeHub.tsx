import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { journal, type JournalEntry, type JournalStatus } from "@/lib/data";

/* ---------------------------------------------------------------------------
   07 — ENGINEERING JOURNAL

   An archive, not a blog: no search, no filters, no cards, no CMS furniture.
   Entries are editorial rows in the same dossier language as the case files.

   Rows are driven entirely by `journal` in lib/data.ts. An entry becomes a
   real link — and the only kind that shows an arrow — once its status is
   "Published" and it carries a slug. An arrow on an unwritten entry would
   promise a page that does not exist.
   --------------------------------------------------------------------------- */

/** Status mark. Same bronze vocabulary as the case-study section. */
function Status({ status }: { status: JournalStatus }) {
  const pip =
    status === "Published"
      ? "bg-gold"
      : status === "In Progress"
        ? "border border-gold/70 bg-transparent"
        : "border border-ink/15 bg-transparent";

  const text =
    status === "Published"
      ? "text-ink/70"
      : status === "In Progress"
        ? "text-ink/60"
        : "text-ink/35";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`h-1.5 w-1.5 rounded-full ${pip}`} aria-hidden />
      <span
        className={`font-mono text-[10px] uppercase tracking-widest2 ${text}`}
      >
        {status}
      </span>
    </span>
  );
}

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
      <dd className="mt-2">{children}</dd>
    </div>
  );
}

/** The row's inner content — identical whether or not it is wrapped in a link. */
function EntryBody({ entry }: { entry: JournalEntry }) {
  const isLive = entry.status === "Published" && entry.slug;

  return (
    <div className="grid gap-y-7 px-2 py-10 transition-colors duration-700 group-hover:bg-ink/[0.018] md:px-6 md:py-12 lg:grid-cols-12 lg:gap-x-12">
      {/* Number, title, description */}
      <div className="lg:col-span-6">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
          {entry.code}
        </span>

        <h3
          className="mt-4 text-balance font-display font-bold text-ink/90 transition-all duration-500 group-hover:translate-x-1 group-hover:text-ink"
          style={{
            fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.024em",
          }}
        >
          {entry.title}
        </h3>

        <p className="mt-4 max-w-[56ch] text-pretty text-[14px] leading-relaxed text-slate-400 transition-colors duration-500 group-hover:text-slate-300 md:text-[15px]">
          {entry.description}
        </p>
      </div>

      {/* Category + read time */}
      <div className="lg:col-span-3">
        <dl className="space-y-6">
          <Meta label="Category">
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-gold/70 transition-colors duration-500 group-hover:text-gold">
              {entry.category}
            </span>
          </Meta>
          <Meta label="Read Time">
            <span className="text-[14px] text-ink/70">{entry.readTime}</span>
          </Meta>
        </dl>
      </div>

      {/* Status, and the arrow only when there is somewhere to go */}
      <div className="flex items-start justify-between gap-4 lg:col-span-3">
        <Meta label="Status">
          <Status status={entry.status} />
        </Meta>

        {isLive && (
          <ArrowUpRight
            size={20}
            aria-hidden
            className="mt-5 shrink-0 text-ink/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
          />
        )}
      </div>
    </div>
  );
}

function Entry({ entry, index }: { entry: JournalEntry; index: number }) {
  const isLive = entry.status === "Published" && entry.slug;

  return (
    <Reveal delay={index * 0.05}>
      <article className="group relative border-t border-ink/[0.07]">
        {/* Bronze rule drawn across the top edge on hover. */}
        <span
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold/60 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          aria-hidden
        />

        {isLive ? (
          <Link href={`/articles/${entry.slug}`} className="block">
            <EntryBody entry={entry} />
          </Link>
        ) : (
          <EntryBody entry={entry} />
        )}
      </article>
    </Reveal>
  );
}

export default function KnowledgeHub() {
  return (
    <SectionShell id="knowledge" className="border-t border-gold/10">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            07
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            The Archive
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
          Engineering journal
        </h2>

        <p className="mt-7 max-w-[62ch] text-pretty text-lg leading-relaxed text-slate-400">
          Technical notes, architecture decisions, backend engineering insights,
          cybersecurity, and lessons learned while building real systems.
        </p>
      </Reveal>

      {/* ── Entries ──────────────────────────────────────────────────── */}
      <div className="mt-20 border-b border-ink/[0.07] md:mt-24">
        {journal.map((entry, i) => (
          <Entry key={entry.code} entry={entry} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
