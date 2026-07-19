"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Loader2, ArrowUpRight } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import Reveal from "../ui/Reveal";
import Toast, { type ToastMessage } from "../ui/Toast";
import { identity, contact } from "@/lib/data";

/* ---------------------------------------------------------------------------
   10 — OPEN A SECURE CHANNEL

   A communication panel and a direct channel, not contact cards and a
   lead-capture form. The left column is a hairline-separated record in the
   same language as the identity panel in section 01.

   The form posts to /api/contact and shows the success message only on a
   genuine 200. If the mail service is not configured the route says so and
   the form offers a direct mail link — it never reports a delivery that did
   not happen.
   --------------------------------------------------------------------------- */

type State = "idle" | "sending";

/* Toast copy. Kept together so the wording is easy to audit in one place. */
const TOASTS = {
  sending: {
    tone: "pending",
    title: "Establishing secure channel\u2026",
  },
  success: {
    tone: "success",
    title: "Secure channel established.",
    body: "Your message has been received and I\u2019ll get back to you soon.",
  },
  failure: {
    tone: "error",
    title: "Transmission failed.",
    body: "Please try again.",
  },
} satisfies Record<string, ToastMessage>;

/** One row of the communication panel. */
function Channel({
  label,
  value,
  href,
  inactive,
}: {
  label: string;
  value: string;
  href?: string;
  inactive?: boolean;
}) {
  // mailto: hands off to a mail client rather than navigating away, so the
  // external-link affordance belongs only on http(s) destinations.
  const external = !!href && href.startsWith("http");

  return (
    <div className="group grid grid-cols-3 items-baseline gap-5 border-t border-ink/[0.07] py-5">
      <dt className="col-span-1 font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
        {label}
      </dt>
      <dd className="col-span-2 text-[15px]">
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-ink/85 transition-colors duration-300 hover:text-gold"
          >
            {value}
            {external && (
              <ArrowUpRight
                size={13}
                aria-hidden
                className="text-ink/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
              />
            )}
          </a>
        ) : (
          <span className={inactive ? "text-ink/30" : "text-ink/85"}>
            {value}
            {inactive && (
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest2 text-ink/20">
                &mdash; soon
              </span>
            )}
          </span>
        )}
      </dd>
    </div>
  );
}

/* Shared field chrome: hairline border that warms to bronze on focus, with a
   soft bronze ring standing in for the default outline. */
const FIELD =
  "mt-2.5 w-full border border-ink/[0.09] bg-ink/[0.015] px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/25 outline-none transition-all duration-300 hover:border-ink/20 focus:border-gold/60 focus:bg-ink/[0.03] focus:shadow-[0_0_0_3px_rgba(212,165,116,0.09)]";

const LABEL =
  "font-mono text-[10px] uppercase tracking-widest2 text-ink/40 transition-colors duration-300 group-focus-within:text-gold/80";

export default function Contact() {
  const [state, setState] = useState<State>("idle");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  // Guards against a double-submit racing past the disabled attribute.
  const inFlight = useRef(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((next: ToastMessage, autoDismissMs?: number) => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setToast(next);
    if (autoDismissMs) {
      dismissTimer.current = setTimeout(() => setToast(null), autoDismissMs);
    }
  }, []);

  useEffect(
    () => () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    []
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    inFlight.current = true;
    setState("sending");
    showToast(TOASTS.sending);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          message: data.get("message"),
          website: data.get("website"), // honeypot
        }),
      });

      if (res.ok) {
        form.reset();
        showToast(TOASTS.success, 9000);
        return;
      }

      // Surface the server's own wording for throttling and field errors;
      // fall back to the generic failure copy for everything else.
      const payload = await res.json().catch(() => null);
      const detail =
        payload?.message ??
        (payload?.fields
          ? Object.values(payload.fields as Record<string, string>)[0]
          : undefined);

      showToast(
        detail
          ? { ...TOASTS.failure, body: detail }
          : TOASTS.failure,
        9000
      );
    } catch {
      showToast(TOASTS.failure, 9000);
    } finally {
      inFlight.current = false;
      setState("idle");
    }
  }

  return (
    <SectionShell id="contact" className="border-t border-gold/10">
      {/* ── Heading ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest2 text-gold/70">
            10
          </span>
          <span className="h-px w-14 bg-gold/40" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
            Contact
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
          Open a secure channel
        </h2>

        <p className="mt-7 max-w-[58ch] text-pretty text-lg leading-relaxed text-slate-400">
          {contact.standfirst}
        </p>
      </Reveal>

      <div className="mt-20 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-x-16">
        {/* ── Communication panel ────────────────────────────────────── */}
        <Reveal className="lg:col-span-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-1 w-1 rounded-full bg-gold/70" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/35">
                Direct Channel
              </span>
            </div>

            <div className="mt-5 h-px w-full bg-gradient-to-r from-copper/30 via-copper/10 to-transparent" />

            <dl className="mt-1">
              <Channel label="Location" value={identity.location} />
              <Channel label="Role" value={contact.role} />
              <Channel label="Agency" value={contact.agency} />
              <Channel
                label="Email"
                value={identity.email}
                href={`mailto:${identity.email}`}
              />
              <Channel
                label="GitHub"
                value="github.com/iamamystery"
                href={identity.github}
              />
              {identity.linkedin ? (
                <Channel
                  label="LinkedIn"
                  value="linkedin.com/in/jawad-algotixai-dev"
                  href={identity.linkedin}
                />
              ) : (
                <Channel label="LinkedIn" value="Not linked yet" inactive />
              )}
            </dl>

            {/* Availability */}
            <div className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink/30">
                Availability
              </p>
              <ul className="mt-5 space-y-3.5">
                {contact.availability.map((a) => (
                  <li key={a} className="flex items-start gap-3.5">
                    <span
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden
                    />
                    <span className="text-[15px] leading-relaxed text-ink/70">
                      {a}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ── Form ───────────────────────────────────────────────────── */}
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <form onSubmit={onSubmit}>
            <div className="h-px w-full bg-gradient-to-r from-gold/50 via-gold/15 to-transparent" />

            <div className="grid gap-6 pt-9 sm:grid-cols-2">
              <label className="group block">
                <span className={LABEL}>Name</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  maxLength={120}
                  className={FIELD}
                  placeholder="Your name"
                />
              </label>
              <label className="group block">
                <span className={LABEL}>Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={200}
                  className={FIELD}
                  placeholder="your@email.com"
                />
              </label>
            </div>

            <label className="group mt-6 block">
              <span className={LABEL}>Project / Company</span>
              <input
                name="company"
                autoComplete="organization"
                maxLength={160}
                className={FIELD}
                placeholder="Project or Company (Optional)"
              />
            </label>

            <label className="group mt-6 block">
              <span className={LABEL}>Message</span>
              <textarea
                required
                name="message"
                rows={6}
                maxLength={5000}
                className={`${FIELD} resize-y`}
                placeholder={contact.messagePlaceholder}
              />
            </label>

            {/* Honeypot — hidden from people and assistive tech alike. */}
            <div className="hidden" aria-hidden>
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="submit"
                disabled={state === "sending"}
                className="group relative inline-flex items-center gap-3.5 overflow-hidden border border-gold/55 bg-gold/[0.05] px-9 py-[1.15rem] font-mono text-xs uppercase tracking-widest2 text-gold transition-colors duration-500 hover:border-gold hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-disabled:scale-x-0 motion-reduce:transition-none"
                  aria-hidden
                />
                <span className="relative z-10 flex items-center gap-3.5">
                  {state === "sending" ? (
                    <>
                      Sending
                      <Loader2 size={14} aria-hidden className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Start a Conversation
                      <ArrowRight size={14} aria-hidden />
                    </>
                  )}
                </span>
              </button>

              {/* Status is delivered by the toast, so nothing sits here. */}
            </div>
          </form>
        </Reveal>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </SectionShell>
  );
}
