import { NextResponse } from "next/server";
import { contactSchema, fieldErrors } from "@/lib/contact/schema";
import { sendContactEmail } from "@/lib/contact/email";
import { hit, clientKey } from "@/lib/contact/rate-limit";

/* ---------------------------------------------------------------------------
   POST /api/contact

   Orchestration only — validation, throttling and delivery each live in their
   own module. Runs on the Node.js runtime because the Resend SDK expects it.

   Responses never leak provider detail or configuration state beyond a coarse
   machine-readable code; specifics are logged server-side instead.

   Required environment:
     RESEND_API_KEY   (required)
     CONTACT_TO       (optional — defaults to imjawadahmad.work@gmail.com)
     CONTACT_FROM     (optional — defaults to Resend's shared sender)
   --------------------------------------------------------------------------- */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorCode =
  | "method_not_allowed"
  | "bad_request"
  | "validation_failed"
  | "rate_limited"
  | "not_configured"
  | "send_failed";

function fail(code: ErrorCode, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: code, ...extra }, { status });
}

export async function POST(request: Request) {
  // ── Throttle before doing any work ──────────────────────────────────────
  const limit = hit(clientKey(request.headers));
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited" satisfies ErrorCode,
        message: `Too many messages. Try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  // ── Parse ───────────────────────────────────────────────────────────────
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail("bad_request", 400);
  }

  // ── Validate ────────────────────────────────────────────────────────────
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return fail("validation_failed", 422, { fields: fieldErrors(parsed.error) });
  }

  // ── Honeypot ────────────────────────────────────────────────────────────
  // Answer 200 so a bot cannot tell rejection from success, and send nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  // ── Deliver ─────────────────────────────────────────────────────────────
  const result = await sendContactEmail(parsed.data, {
    submittedAt: new Date(),
    userAgent: request.headers.get("user-agent") ?? "unknown",
  });

  if (!result.ok) {
    return result.reason === "not_configured"
      ? fail("not_configured", 503)
      : fail("send_failed", 502);
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
  );
}

/* Any other verb is rejected explicitly rather than falling through to a
   framework 405 with no body. */
const reject = () =>
  NextResponse.json(
    { ok: false, error: "method_not_allowed" satisfies ErrorCode },
    { status: 405, headers: { Allow: "POST" } }
  );

export const GET = reject;
export const PUT = reject;
export const PATCH = reject;
export const DELETE = reject;
