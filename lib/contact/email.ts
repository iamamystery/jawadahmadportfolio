import { Resend } from "resend";
import type { ContactInput } from "./schema";
import { escapeHtml, singleLine, toHtmlParagraph } from "./sanitize";

/* ---------------------------------------------------------------------------
   Email delivery.

   Owns everything Resend-shaped: configuration, the message template, and the
   send call. The route handler talks to `sendContactEmail` and never touches
   the provider directly, so swapping providers is a change to this file only.
   --------------------------------------------------------------------------- */

export type DeliveryMeta = {
  submittedAt: Date;
  userAgent: string;
};

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "provider_error" };

/** Reads configuration at call time so a missing key never crashes the build. */
function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? "imjawadahmad.work@gmail.com";
  // Resend's shared sender works with no domain setup. Once a domain is
  // verified, set CONTACT_FROM to an address on it for better deliverability.
  const from = process.env.CONTACT_FROM ?? "Phantex HQ <onboarding@resend.dev>";
  return { apiKey, to, from };
}

const BRONZE = "#B87333";
const INK = "#1a1d21";
const MUTED = "#6b7280";
const HAIRLINE = "#e6e3df";

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:14px 0;border-top:1px solid ${HAIRLINE};vertical-align:top;width:170px;">
        <span style="font:600 11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">${label}</span>
      </td>
      <td style="padding:14px 0;border-top:1px solid ${HAIRLINE};vertical-align:top;">
        <span style="font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">${value}</span>
      </td>
    </tr>`;
}

/**
 * Builds the HTML body. Deliberately table-based with inline styles — mail
 * clients remain the one place where that is still the correct choice.
 */
export function renderContactEmail(input: ContactInput, meta: DeliveryMeta) {
  const name = escapeHtml(singleLine(input.name));
  const email = escapeHtml(singleLine(input.email));
  const company = input.company
    ? escapeHtml(singleLine(input.company))
    : "&mdash;";
  const message = toHtmlParagraph(input.message);
  const time = escapeHtml(
    meta.submittedAt.toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }) + " (PKT)"
  );
  const agent = escapeHtml(singleLine(meta.userAgent).slice(0, 300));

  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f3;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid ${HAIRLINE};">
      <tr>
        <td style="height:3px;background:${BRONZE};font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding:36px 36px 8px;">
          <p style="margin:0;font:600 11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:${BRONZE};">
            Phantex HQ &middot; New Inquiry
          </p>
          <h1 style="margin:14px 0 0;font:700 24px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">
            ${name}
          </h1>
          <p style="margin:8px 0 0;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">
            Sent from the portfolio contact form.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 36px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${row("Name", name)}
            ${row("Email", `<a href="mailto:${email}" style="color:${BRONZE};text-decoration:none;">${email}</a>`)}
            ${row("Project / Company", company)}
            ${row("Message", `<span style="white-space:normal;">${message}</span>`)}
            ${row("Submission Time", time)}
            ${row("User Agent", `<span style="font:400 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:${MUTED};word-break:break-word;">${agent}</span>`)}
          </table>

          <p style="margin:28px 0 0;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">
            Reply directly to this email to respond to ${name}.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Plain-text alternative, for clients that will not render HTML. */
export function renderContactText(input: ContactInput, meta: DeliveryMeta) {
  return [
    "NEW PORTFOLIO INQUIRY",
    "",
    `Name:              ${singleLine(input.name)}`,
    `Email:             ${singleLine(input.email)}`,
    `Project / Company: ${input.company ? singleLine(input.company) : "—"}`,
    "",
    "Message:",
    input.message,
    "",
    `Submitted:  ${meta.submittedAt.toISOString()}`,
    `User Agent: ${singleLine(meta.userAgent).slice(0, 300)}`,
  ].join("\n");
}

export async function sendContactEmail(
  input: ContactInput,
  meta: DeliveryMeta
): Promise<SendResult> {
  const { apiKey, to, from } = getConfig();
  if (!apiKey) return { ok: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: singleLine(input.email),
    subject: `New Portfolio Inquiry — ${singleLine(input.name)}`,
    html: renderContactEmail(input, meta),
    text: renderContactText(input, meta),
  });

  if (error) {
    // Logged server-side only; the client is never shown provider internals.
    console.error("[contact] Resend error:", error.name, error.message);
    return { ok: false, reason: "provider_error" };
  }
  return { ok: true, id: data?.id ?? null };
}
