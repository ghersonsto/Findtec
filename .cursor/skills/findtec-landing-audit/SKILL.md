---
name: findtec-landing-audit
description: >-
  Audits the FindTec Soluciones landing page for conversion, hierarchy, brand
  strength, clutter, mobile, and B2B/B2G clarity. Use when the user asks to
  review, analyze, audit, or diagnose the landing, hero, sections, or UX before
  redesigning.
---

# FindTec Landing Audit

## Scope

Source of truth (edit these; ignore unused section files unless re-enabling):

- `app/page.tsx` — section order
- `components/sections/*` mounted in `page.tsx`
- `components/navbar.tsx`, `components/smart-chatbot.tsx`
- `app/globals.css`, `app/layout.tsx`
- `lib/company.ts`

Orphan sections (not on landing): `additional-services`, `catalog`, `cta`, `presentation`, `rnp-status`, `solutions`.

## Workflow

1. Read `app/page.tsx` and the hero + contact sections first.
2. Score each checklist item: Pass / Weak / Fail.
3. Return a short prioritized list (max 8 fixes), ordered by impact.
4. Do **not** edit code unless the user asks to implement.

## Checklist

### Hero (first viewport)

- [ ] Brand "FindTec" is hero-level (not only nav)
- [ ] One headline + one support line + one CTA group
- [ ] Dominant visual (product/context), not only abstract gradients
- [ ] No stats strips, promo chips, or floating badges over hero media
- [ ] No card grid competing with the hero message

### Narrative & conversion

- [ ] Clear B2B/B2G offer in Spanish (Perú / Lima)
- [ ] Proof early (clients, trust) without drowning the hero
- [ ] Services scannable; CTAs lead to `#contacto` or chatbot
- [ ] Contact form + WhatsApp path obvious on mobile
- [ ] Section order tells a story: problem → proof → offer → process → trust → decide → contact

### Design system

- [ ] Uses CSS variables from `globals.css` (Electric Blue brand)
- [ ] Light/dark both readable
- [ ] Motion is intentional (2–3 moments), not noise
- [ ] Avoid AI clichés: purple gradients, cream+terracotta, broadsheet columns, emoji spam

### Tech / a11y

- [ ] Anchors match navbar (`#inicio`, `#servicios`, `#nosotros`, `#experiencia-b2g`, `#testimonios`, `#contacto`)
- [ ] Images have meaningful `alt`
- [ ] Contrast OK in light and dark
- [ ] Form posts to `/api/contact` and handles errors

## Output format

```markdown
## Auditoría FindTec
**Veredicto:** [1 frase]

### Prioridades
1. [Fail/Weak] … — por qué — archivo sugerido
2. …

### Lo que ya funciona
- …
```
