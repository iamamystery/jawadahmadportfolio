# Phantex HQ — Digital Headquarters of Muhammad Jawad Ahmad

A premium, immersive portfolio built as a digital headquarters: cinematic 3D landing, command-center founder core, interactive systems architecture, a cybersecurity vault, and a full MDX knowledge hub.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** — custom token palette (night / surface / ink / gold / ember)
- **Framer Motion** — reveals, transitions, magnetic buttons, scroll-linked timeline
- **React Three Fiber + Three.js + Drei** — the hero ecosystem constellation
- **MDX** via `next-mdx-remote` — file-based articles with search & category filters
- **Lucide React** — iconography

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also what Vercel runs)
```

## Deploy to Vercel

Push to GitHub, import the repo in Vercel — zero configuration needed. Then:

1. Replace `https://phantextech.com` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` with your real domain.
2. Set the contact-form environment variables (below).

### Contact form — environment variables

Set these in **Vercel → Project → Settings → Environment Variables**, for both
**Production** and **Preview**. Locally they live in `.env.local`, which is
git-ignored; `.env.example` documents the same list.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | yes | — | Resend API key ([resend.com/api-keys](https://resend.com/api-keys)) |
| `CONTACT_TO` | no | `imjawadahmad.work@gmail.com` | Inbox that receives submissions |
| `CONTACT_FROM` | no | `Phantex HQ <onboarding@resend.dev>` | Sender identity |

Redeploy after adding them — Vercel only injects environment variables at
build/run time, so existing deployments will not pick them up.

### Verifying a sending domain (required for real delivery)

Resend's shared sender, `onboarding@resend.dev`, needs no DNS setup but **can
only deliver to the email address that owns the Resend account**. Sending to
any other recipient returns a `validation_error` and the API responds `502`.

To deliver to an arbitrary inbox:

1. Add a domain at [resend.com/domains](https://resend.com/domains).
2. Add the DKIM/SPF records Resend gives you to that domain's DNS.
3. Once it shows **Verified**, set `CONTACT_FROM` to an address on it —
   for example `Phantex HQ <hello@phantex.tech>`.
4. Leave `CONTACT_TO` set to wherever you want to read the mail.

Until that is done, either verify a domain or point `CONTACT_TO` at the
Resend account owner's address.

**Current state:** `CONTACT_TO` is set to `jawadking6971@gmail.com` (the Resend
account owner) so the form delivers today. After verifying a domain, change
`CONTACT_FROM` to an address on it and `CONTACT_TO` to
`imjawadahmad.work@gmail.com`. Both are environment variables — no code change.

### How the endpoint behaves

`POST /api/contact` — Node.js runtime, force-dynamic (a Vercel Serverless
Function). No other verb is accepted.

| Status | Meaning |
|---|---|
| `200` | Delivered — or honeypot triggered, which is silently discarded |
| `400` | Body was not valid JSON |
| `405` | Wrong HTTP method (`Allow: POST`) |
| `422` | Zod validation failed; `fields` carries per-field messages |
| `429` | Rate limited; `Retry-After` header in seconds |
| `502` | Provider rejected the send |
| `503` | `RESEND_API_KEY` is not set |

Provider errors are logged server-side only. Responses never expose
configuration state or provider internals beyond a coarse machine-readable
code.

**Rate limiting caveat.** `lib/contact/rate-limit.ts` keeps counters in
instance memory: 5 submissions per IP per 10 minutes, enforced *per warm
serverless instance* rather than globally. That is a courtesy throttle against
casual abuse, not a hard guarantee — a scaled-out deployment can be bypassed by
landing on cold instances. For a strict global limit, swap `hit()` for a
Redis-backed atomic counter (Upstash or Vercel KV); the call site does not
change.

### Contact module layout

```
lib/contact/
  schema.ts      # Zod schema, limits, field-error flattening
  sanitize.ts    # HTML escaping, control-char stripping, header-injection guard
  rate-limit.ts  # fixed-window limiter + client key derivation
  email.ts       # Resend integration, HTML + plain-text templates
app/api/contact/route.ts   # orchestration only
components/ui/Toast.tsx    # status notifications
```

## Editing content — one file for almost everything

**`lib/data.ts`** contains the entire site's content as typed, documented objects:

| What | Where |
|---|---|
| Name, roles, tagline, links | `identity` |
| Hero + Founder Core metrics | `metrics`, `founder` |
| Expertise cards | `pillars` |
| Projects (problem/solution/architecture/security/results/gallery/links) | `projects` |
| Systems diagram nodes & edges | `systemNodes`, `systemEdges` |
| Vault dossiers | `vaultEntries` |
| Phantex Tech HQ content | `phantex` |
| Journey timeline | `timeline` |
| Proof of Work stats | `proof` |

**Articles** live in `content/articles/*.mdx`. Add a file with frontmatter and it appears in the Knowledge Hub (with search, filtering, reading time, sitemap entry) automatically:

```mdx
---
title: "Your Title"
description: "One-line summary."
category: "Cybersecurity"   # any string — filters are generated from categories
date: "2026-07-01"
---

Your content in Markdown/MDX…
```

**Project gallery images**: the dossier view renders labeled placeholder frames. Drop real screenshots into `public/` and swap the placeholder block in `components/sections/Projects.tsx` for `next/image`.

**Contact form**: currently opens a pre-filled email (no backend required). To send via API instead, replace the `onSubmit` handler in `components/sections/Contact.tsx` with a `fetch` to your route or a service like Resend/Formspree.

## Architecture notes

- The Three.js scene is dynamically imported (`ssr: false`) and only loads on the client — the rest of the page is server-rendered for SEO.
- The constellation uses a seeded PRNG so it looks identical on every visit, buffer geometries (one draw call for all nodes, one for all edges), capped DPR, and Drei's `AdaptiveDpr` for weaker GPUs.
- `prefers-reduced-motion` is respected globally (CSS) and in every interactive component (tilt, magnetic buttons, camera drift, counters).
- All content sections are static/server-rendered; interactivity is hydrated per-component.
- Focus-visible styles, aria labels, keyboard-operable diagram nodes, and semantic landmarks are included.

## Folder structure

```
app/
  layout.tsx            # fonts, SEO metadata, theme
  page.tsx              # the headquarters (all 10 sections)
  globals.css           # tokens, grain, focus, reduced-motion
  articles/[slug]/      # MDX article pages (static-generated)
  sitemap.ts robots.ts  # SEO
components/
  Hero.tsx Nav.tsx
  three/EcosystemCanvas.tsx
  ui/                   # MagneticButton, Reveal, Counter, SectionShell
  sections/             # FounderCore … Contact (one file per section)
content/articles/       # MDX knowledge hub
lib/
  data.ts               # ← edit this to change the site
  articles.ts           # MDX loader
```
