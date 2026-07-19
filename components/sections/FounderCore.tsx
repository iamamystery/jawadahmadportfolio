import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import { founder, identity } from "@/lib/data";

/* ---------------------------------------------------------------------------
   01 — THE ENGINEER BEHIND THE SYSTEMS

   Editorial, not dashboard. There are no cards, fills, icons or counters in
   this section by design: hierarchy is carried entirely by type scale, tonal
   contrast, and hairlines. The one structural device is the identity panel,
   which is a definition list — semantically a profile, visually a record.
   --------------------------------------------------------------------------- */

/** A row of the personnel record. Hairline above, nothing else. */
function ProfileRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-5 border-t border-ink/[0.07] py-5">
      <dt className="col-span-1 pt-0.5 font-mono text-[10px] uppercase tracking-widest2 text-ink/35">
        {label}
      </dt>
      <dd className="col-span-2 text-[15px] leading-relaxed text-ink/85">
        {children}
      </dd>
    </div>
  );
}

export default function FounderCore() {
  return (
    <SectionShell id="core" className="border-t border-gold/10">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            01
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            Profile
          </span>
        </div>

        <h2
          className="font-display font-bold text-ink"
          style={{
            fontSize: "clamp(2.25rem, 5.4vw, 4.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.032em",
          }}
        >
          {founder.headingLines.map((line, i) => (
            <span key={line} className={i === 0 ? "block text-ink/45" : "block"}>
              {line}
            </span>
          ))}
        </h2>

        {/* text-balance keeps short measures from stranding a single word on
            the last line — at this size an orphan reads as a mistake. */}
        <p className="mt-7 max-w-[46ch] text-balance text-lg leading-relaxed text-slate-400">
          {founder.standfirst}
        </p>
      </Reveal>

      {/* ── Statement + identity panel ───────────────────────────────── */}
      <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-12">
        {/* Philosophy */}
        <div className="lg:col-span-7">
          <Reveal>
            <p
              className="font-display font-bold"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.028em",
              }}
            >
              {/* The refusal recedes; the claim carries. */}
              <span className="block text-balance text-ink/30">
                {founder.statement.counter}
              </span>
              <span className="block text-balance text-ink">
                {founder.statement.claim}
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-[58ch] text-[15px] leading-[1.75] text-slate-400 md:text-base">
              {founder.paragraph}
            </p>
          </Reveal>
        </div>

        {/* Identity panel — an internal record, not a card */}
        <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-1 w-1 rounded-full bg-gold/70" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/35">
                System Profile
              </span>
            </div>

            <div className="mt-5 h-px w-full bg-gradient-to-r from-copper/30 via-copper/10 to-transparent" />

            <dl className="mt-1">
              <ProfileRow label="Identity">{identity.name}</ProfileRow>
              <ProfileRow label="Role">{founder.profile.role}</ProfileRow>
              <ProfileRow label="Organization">
                {founder.profile.organization}
              </ProfileRow>
              <ProfileRow label="Specialization">
                <ul className="space-y-1.5">
                  {founder.profile.specialization.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </ProfileRow>
              <ProfileRow label="Mission">
                <span className="text-ink/60">{founder.profile.mission}</span>
              </ProfileRow>
            </dl>
          </div>
        </Reveal>
      </div>

      {/* ── Engineering principles ───────────────────────────────────── */}
      <div className="mt-28 md:mt-40">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-14 bg-gold/40" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
              Engineering Principles
            </span>
          </div>
        </Reveal>

        <ul className="mt-12 border-b border-ink/[0.07]">
          {founder.principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <li className="group grid items-baseline gap-y-4 border-t border-ink/[0.07] py-9 md:grid-cols-12 md:gap-8 md:py-12">
                <span className="font-mono text-[11px] tracking-widest2 text-gold/45 transition-colors duration-500 group-hover:text-gold md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className="text-balance font-display font-bold text-ink/85 transition-colors duration-500 group-hover:text-ink md:col-span-5"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.024em",
                  }}
                >
                  {p.title}
                </h3>

                <p className="max-w-[52ch] text-pretty text-[15px] leading-relaxed text-slate-400 transition-colors duration-500 group-hover:text-slate-300 md:col-span-6">
                  {p.detail}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
