/* ---------------------------------------------------------------------------
   Input sanitisation.

   Submitted values are interpolated into an HTML email, which makes the email
   body an injection sink: without escaping, a message containing markup would
   render as markup in the recipient's mail client. Everything user-supplied
   passes through `escapeHtml` before it reaches a template.
   --------------------------------------------------------------------------- */

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapes the five characters that carry meaning in HTML. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
}

/**
 * Strips control characters and collapses excessive blank lines. Applied to
 * free text before escaping so the email body stays tidy.
 */
export function normalizeText(value: string): string {
  return value
    // Strip C0/C1 control characters, keeping tab and newline.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Header injection guard. A newline inside a value used in a subject line or
 * address header could forge additional headers, so they are stripped.
 */
export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Escapes and converts newlines to <br> for HTML display. */
export function toHtmlParagraph(value: string): string {
  return escapeHtml(normalizeText(value)).replace(/\n/g, "<br />");
}
