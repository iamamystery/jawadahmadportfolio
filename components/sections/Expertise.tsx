import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { chapters, type Chapter } from "@/lib/data";

/* ---------------------------------------------------------------------------
   02 — BUILD. SECURE. SCALE.

   Three chapters read in order rather than three cards read in parallel.
   The order carries the argument: you cannot secure what does not hold, or
   scale what is not secure — so each chapter is a full-width movement with
   its own word, thesis, and disciplines.

   Asymmetry is structural, not decorative: the middle chapter mirrors —
   word right, disciplines left — which breaks the column rhythm that made
   the old three-up card grid read as a feature list.
   --------------------------------------------------------------------------- */

/* Sized so the longest word ("SECURE", 6 wide Syne caps ≈ 1.33em each) clears
   the measure at every breakpoint, and so the chapter word always stays under
   the Hero name's 92px — the Hero has to remain the largest type on the site. */
const WORD_SIZE = "clamp(2rem, 7.5vw, 5rem)";

/* Chapters are numbered in roman so they never collide with the section
   numbering — "02" immediately followed by "01" reads as a mistake. */
const NUMERALS = ["I", "II", "III"] as const;

function ChapterBlock({
  chapter,
  index,
  flipped,
}: {
  chapter: Chapter;
  index: number;
  flipped: boolean;
}) {
  return (
    <article className="border-t border-ink/[0.07] pt-10 md:pt-14">
      {/* Marker + word. Both follow the mirror. */}
      <Reveal>
        <div className={flipped ? "lg:text-right" : ""}>
          <div
            className={`flex items-center gap-4 ${
              flipped ? "lg:justify-end" : ""
            }`}
          >
            <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
              {NUMERALS[index] ?? String(index + 1)}
            </span>
            <span className="h-px w-14 bg-gold/40" aria-hidden />
          </div>

          <h3
            className="mt-6 font-display font-extrabold uppercase text-ink"
            style={{
              fontSize: WORD_SIZE,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {chapter.word}
          </h3>
        </div>
      </Reveal>

      {/* Thesis + disciplines. Column order swaps on the mirrored chapter,
          but only from lg up — narrow screens keep reading order. */}
      <div className="mt-12 grid gap-y-10 md:mt-16 lg:grid-cols-12 lg:gap-x-12">
        <Reveal
          delay={0.08}
          className={
            flipped
              ? "lg:col-span-4 lg:col-start-9 lg:row-start-1"
              : "lg:col-span-4"
          }
        >
          <p className="max-w-[42ch] text-pretty text-lg leading-relaxed text-ink/70">
            {chapter.thesis}
          </p>
        </Reveal>

        <Reveal
          delay={0.14}
          className={
            flipped
              ? "lg:col-span-7 lg:col-start-1 lg:row-start-1"
              : "lg:col-span-7 lg:col-start-6"
          }
        >
          <ul className="border-b border-ink/[0.07]">
            {chapter.items.map((item) => (
              <li
                key={item.name}
                className="group grid gap-x-6 gap-y-1.5 border-t border-ink/[0.07] py-5 sm:grid-cols-12 sm:py-6"
              >
                <h4 className="font-display text-lg text-ink/90 transition-colors duration-500 group-hover:text-ink sm:col-span-5 md:text-xl">
                  {item.name}
                </h4>
                <p className="text-pretty text-[14px] leading-relaxed text-slate-400 transition-colors duration-500 group-hover:text-slate-300 sm:col-span-7 md:text-[15px]">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </article>
  );
}

export default function Expertise() {
  return (
    <SectionShell id="expertise">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            02
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            How I Engineer
          </span>
        </div>

        {/* The bronze full stops echo the MJA.HQ wordmark in the nav — the
            smallest possible accent, used three times. */}
        <h2
          className="text-balance font-display font-bold text-ink"
          style={{
            fontSize: "clamp(2.25rem, 5.4vw, 4.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.032em",
          }}
        >
          {chapters.map((c) => (
            <span key={c.id} className="whitespace-nowrap">
              {c.word}
              <span className="text-gold">.</span>{" "}
            </span>
          ))}
        </h2>

        <p className="mt-7 max-w-[48ch] text-balance text-lg leading-relaxed text-slate-400">
          Three disciplines, in the order they matter. Each one assumes the one
          before it.
        </p>
      </Reveal>

      {/* ── Chapters ─────────────────────────────────────────────────── */}
      <div className="mt-24 space-y-24 md:mt-32 md:space-y-32">
        {chapters.map((c, i) => (
          <ChapterBlock
            key={c.id}
            chapter={c}
            index={i}
            flipped={i % 2 === 1}
          />
        ))}
      </div>
    </SectionShell>
  );
}
