---
name: findtec-landing-improve
description: >-
  Improves FindTec landing sections (hero, services, B2G, contact, motion,
  layout) while preserving Electric Blue brand tokens and Next.js/Tailwind
  patterns. Use when the user asks to improve, redesign, polish, or refactor
  the landing page or a specific section.
---

# FindTec Landing Improve

## Before coding

1. If the request is vague, run the audit skill workflow first (or ask which section).
2. Touch only requested sections + shared tokens if needed.
3. Prefer editing existing section files over creating new ones.
4. Keep Spanish copy; company facts live in `lib/company.ts`.

## Stack conventions

- Next.js App Router, React client components where interaction exists
- Tailwind 4 + tokens in `app/globals.css`
- UI primitives in `components/ui/`
- Chatbot open: `window.dispatchEvent(new Event("open-findtec-chatbot"))`
- WhatsApp: `whatsappHref()` from `lib/company.ts`

## Design rules (must follow)

- **One composition** in the first viewport — not a dashboard
- **Brand first**: FindTec must remain a dominant signal in the hero
- **Hero budget**: brand, one headline, one short line, one CTA group, one dominant visual
- **Full-bleed or strong visual plane** for hero imagery; avoid inset card heroes unless already required
- **No hero overlays**: no floating badges/chips on media
- **Cards sparingly**: only when they aid interaction; not in the hero
- **One job per section**: one headline + one short support line
- **Motion**: add or keep 2–3 intentional motions (fade-up, marquee, hero frame cycle)
- **Color**: keep Electric Blue tokens; do not switch to purple/cream/terracotta defaults
- **Typography**: prefer expressive loaded fonts if changing Inter; avoid default system-only looks for display

## Implementation steps

1. Read the target section file(s) and `globals.css` tokens.
2. Sketch the change in 2–3 bullets (what stays / what changes).
3. Implement with existing class utilities (`gradient-mesh`, `noise`, `card-premium`, `btn-primary`, etc.) when possible.
4. Verify both light and dark classes if theming is affected.
5. Confirm navbar anchors still resolve.
6. Summarize files changed and how to preview (`pnpm dev` → http://localhost:3000).

## Section map

| Goal | File |
|------|------|
| Hero | `components/sections/hero-section.tsx` |
| Logos | `clients-section.tsx` |
| Proof | `trust-section.tsx` |
| Offer | `services-section.tsx` |
| How we work | `process-section.tsx` |
| Company | `about-section.tsx` |
| Highlights | `features-section.tsx` |
| Public sector | `b2g-section.tsx` |
| Compare | `decision-section.tsx` |
| Social proof | `testimonials-section.tsx` |
| Lead gen | `contact-section.tsx` |
| Shell | `app/page.tsx`, `navbar.tsx`, `footer.tsx` |

## Do not

- Commit secrets (`.env.local`)
- Mount orphan sections without an explicit request
- Rewrite the whole page when asked to fix one section
- Invent fake clients, certifications, or metrics
