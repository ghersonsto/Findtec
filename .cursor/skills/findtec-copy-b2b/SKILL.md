---
name: findtec-copy-b2b
description: >-
  Writes and rewrites Spanish B2B/B2G marketing copy for FindTec Soluciones
  (Lima, Perú): headlines, CTAs, service blurbs, trust lines. Use when the user
  asks to improve texts, copy, headlines, microcopy, or messaging on the landing.
---

# FindTec Copy B2B/B2G

## Brand voice

- Professional, clear, close — not hype-startup
- Spanish (Perú): "tú/usted" formal-friendly for empresas e instituciones
- Emphasize: alcance documentado, cotización clara, soporte postventa, experiencia B2G / RNP when relevant
- Never invent certifications, clients, or numbers not already in the codebase

## Facts (from `lib/company.ts`)

- Name: FindTec Soluciones
- Legal: FINDTEC BIENES Y SERVICIOS E INVERSIONES E.I.R.L.
- Offer: hardware, soporte TI, redes, Microsoft 365/cloud, automatización, web, datos, IA aplicada
- Contact: email, phone, WhatsApp, Chorrillos/Lima
- Site: https://findtec.pe

## Patterns

**Headline:** benefit + audience  
Ej: `Soluciones TI para operar con confianza`

**Support:** one concrete sentence (how / for whom)

**CTA primary:** action + outcome  
Ej: `Solicitar cotización` / `Hablar por WhatsApp`

**CTA secondary:** softer  
Ej: `Ver servicios` → `#servicios`

**Service blurb:** problem → solution → proof cue (1–2 lines max)

## Workflow

1. Read current copy in the target section + `lib/company.ts`.
2. Propose 2 variants per key string (A conservative / B sharper).
3. After user picks (or if they say "aplica"), edit the section file.
4. Keep length similar so layout does not break; flag if a line needs layout tweak.

## Output when proposing (no edit yet)

```markdown
### [Sección]
**Actual:** …
**A:** …
**B:** …
**CTA:** …
```

## Avoid

- Anglicismos innecesarios ("synergy", "disruptivo")
- Promesas absolutas ("el mejor", "100% garantizado")
- Listas interminables in the hero
- Emojis in headlines
