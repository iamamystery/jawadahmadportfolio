import { Github, Linkedin, Mail } from "lucide-react";
import { identity } from "@/lib/data";

/* The page's last word. Very small type, one hairline, nothing else. */

/* Shared icon chrome. The lift is 2px — enough to feel responsive, small
   enough to stay quiet. */
const ICON =
  "flex h-10 w-10 items-center justify-center border border-ink/[0.08] text-ink/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/45 hover:bg-gold/[0.04] hover:text-gold";

export default function Footer() {
  // Rendered from the current date so the notice never goes stale.
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 pb-14 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl border-t border-ink/[0.07] pt-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-base font-bold text-ink/85">
              {identity.name}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-ink/40">
              Backend Engineer &bull; Founder, Phantex Tech
            </p>
            <p className="mt-5 max-w-[52ch] text-[13px] leading-relaxed text-ink/30">
              Built with Next.js, TypeScript, Framer Motion, and an obsession
              for clean engineering.
            </p>
            <p className="mt-2 text-[13px] text-ink/25">
              &copy; {year} All Rights Reserved.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={ICON}
            >
              <Github size={16} aria-hidden />
            </a>

            {/* Degrades to an inert mark if the URL is ever cleared. */}
            {identity.linkedin ? (
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={ICON}
              >
                <Linkedin size={16} aria-hidden />
              </a>
            ) : (
              <span
                aria-label="LinkedIn — not linked yet"
                title="Not linked yet"
                className="flex h-10 w-10 items-center justify-center border border-ink/[0.05] text-ink/15"
              >
                <Linkedin size={16} aria-hidden />
              </span>
            )}

            <a
              href={`mailto:${identity.email}`}
              aria-label={`Email ${identity.email}`}
              className={ICON}
            >
              <Mail size={16} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
