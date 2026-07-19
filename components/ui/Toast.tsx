"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Loader2 } from "lucide-react";

/* ---------------------------------------------------------------------------
   Toast.

   Deliberately built from the site's existing vocabulary — charcoal panel,
   hairline border, bronze rule, mono label — rather than a notification
   library, so it reads as part of the headquarters rather than bolted on.
   --------------------------------------------------------------------------- */

export type ToastTone = "pending" | "success" | "error";

export type ToastMessage = {
  tone: ToastTone;
  title: string;
  body?: string;
};

const TONE = {
  pending: { rule: "from-gold/60", icon: "text-gold/80", Icon: Loader2 },
  success: { rule: "from-gold/80", icon: "text-gold", Icon: Check },
  error: { rule: "from-ink/30", icon: "text-ink/50", Icon: AlertTriangle },
} as const;

export default function Toast({
  message,
  onDismiss,
}: {
  message: ToastMessage | null;
  onDismiss?: () => void;
}) {
  const tone = message ? TONE[message.tone] : null;
  const Icon = tone?.Icon;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 sm:justify-end sm:px-6 sm:pb-8"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {message && tone && Icon && (
          <motion.div
            key={message.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-sm border border-ink/[0.09] bg-charcoal/95 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.7)] backdrop-blur-sm"
            role={message.tone === "error" ? "alert" : "status"}
          >
            <div
              className={`h-px w-full bg-gradient-to-r ${tone.rule} to-transparent`}
              aria-hidden
            />
            <div className="flex items-start gap-3.5 px-5 py-4">
              <Icon
                size={15}
                aria-hidden
                className={`mt-0.5 shrink-0 ${tone.icon} ${
                  message.tone === "pending" ? "animate-spin" : ""
                }`}
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink/80">
                  {message.title}
                </p>
                {message.body && (
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                    {message.body}
                  </p>
                )}
              </div>
              {onDismiss && message.tone !== "pending" && (
                <button
                  type="button"
                  onClick={onDismiss}
                  aria-label="Dismiss notification"
                  className="-mr-1 ml-auto shrink-0 px-1 font-mono text-[11px] text-ink/30 transition-colors hover:text-gold"
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
