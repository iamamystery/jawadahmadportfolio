import { z } from "zod";

/* ---------------------------------------------------------------------------
   Contact payload validation.

   The single source of truth for the shape of a contact submission. The route
   handler validates against this before anything else runs, so nothing
   downstream ever sees an unvalidated field.
   --------------------------------------------------------------------------- */

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  company: { max: 160 },
  message: { min: 10, max: 5000 },
} as const;

export const contactSchema = z.object({
  name: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(LIMITS.name.min, "Please enter your name.")
    .max(LIMITS.name.max, "That name is too long."),

  email: z
    .email("Please enter a valid email address.")
    .max(LIMITS.email.max, "That email address is too long."),

  /** Optional. Normalised to undefined when blank so the template can skip it. */
  company: z
    .string({ error: "That value is invalid." })
    .trim()
    .max(LIMITS.company.max, "That value is too long.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),

  message: z
    .string({ error: "Please include a message." })
    .trim()
    .min(LIMITS.message.min, "Please include a little more detail.")
    .max(LIMITS.message.max, "That message is too long."),

  /**
   * Honeypot. Hidden from real users, so any value at all means a bot filled
   * it in.
   *
   * Note this ACCEPTS a filled value rather than rejecting it. Failing
   * validation here would return a 422 and tell the bot precisely which field
   * caught it; instead the value passes through and the route answers 200
   * while quietly discarding the submission.
   */
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Flattens Zod issues into a `{ field: message }` map for the client. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}
