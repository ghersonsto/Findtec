# Findtec Soluciones — metodología, herramientas y mapa del repositorio

Documento de referencia del sitio web de **Findtec Soluciones** (FINDTEC BIENES Y SERVICIOS E INVERSIONES E.I.R.L., RUC 20613828606). Describe cómo está construido el proyecto, con qué herramientas y cómo se reparte el código.

Los datos de marca, contacto y servicios viven en `lib/company.ts`. El sitio es **multipágina** (App Router): inicio, servicios, nosotros, sector público y contacto, envueltos por `SiteFrame` (navbar, footer, chatbot).

---

## 1. Qué es este repositorio

Sitio B2B/B2G en español (Perú) para cotizar software, integraciones con IA, digitalización e infraestructura TI. No es un panel administrativo ni un e-commerce: el objetivo es presentar la empresa, explicar servicios y llevar a cotización.

Flujo principal del visitante:

1. Entra por `/` (hero + prueba + servicios destacados + metodología + CTA).
2. Explora `/servicios`, `/nosotros` o `/sector-publico`.
3. Cotiza desde un servicio (`startQuote`) o desde **Cotizar** en el header.
4. Llega a `/contacto` con el formulario precargado (`?servicio=` / `?mensaje=`).
5. El envío sale por `POST /api/contact` (correo con Nodemailer).
6. En paralelo puede usar el chatbot (`POST /api/agents`), que orienta y también puede abrir la cotización.

---

## 2. Metodología de trabajo

### 2.1 Enfoque de producto

- **Multipágina con shell compartido.** Rutas de marketing en `app/*/page.tsx`. El menú apunta a rutas (`/`, `/servicios`, `/nosotros`, `/sector-publico`, `/contacto`), no a anclas de una sola landing.
- **Hechos en un solo lugar.** Nombre, RUC, teléfono, correo, WhatsApp y catálogo salen de `lib/company.ts`. Las secciones no inventan esos datos.
- **Copy B2B.** Textos formales, orientados a empresas e instituciones: alcance, cotización y soporte. Sin métricas inventadas ni tono de startup.
- **Marca visual.** Electric Blue (`#2563eb` / `#3b82f6`), tipografía Plus Jakarta Sans + Inter + JetBrains Mono, modo claro/oscuro con `next-themes`.

### 2.2 Cómo se construye una sección o página

1. El contenido de empresa se lee de `lib/`.
2. La sección se escribe en `components/sections/`.
3. Si necesita clic, scroll, 3D o estado, es un componente `"use client"`.
4. La **home** monta secciones en `app/page.tsx`. Las páginas internas montan `PageHeader` + sección(es) en su propia `page.tsx`.
5. Los CTAs de cotización llaman a `startQuote()` en `lib/quote.ts` (navega a `/contacto?servicio=...` y dispara el evento `findtec-quote`).

### 2.3 Cómo se construye una API

Las rutas en `app/api/*/route.ts` son handlers de Next.js App Router (`GET` / `POST`). Validan con **Zod** donde aplica, responden JSON (o SSE en agentes) y delegan la lógica a `lib/`.

### 2.4 Metodología de diseño aplicada en este repo

Convive con las reglas de `.cursorrules` y las skills de `.cursor/skills/`:

| Pieza | Para qué sirve |
| --- | --- |
| `.cursorrules` | Jerarquía B2B, Electric Blue, bordes sutiles, springs Kowalski, `prefers-reduced-motion`. |
| `findtec-landing-audit` | Revisar conversión, jerarquía y claridad B2B antes de rediseñar. |
| `findtec-landing-improve` | Cambiar hero, servicios, contacto o layout sin romper tokens. |
| `findtec-copy-b2b` | Reescribir titulares y CTAs en español corporativo. |

Reglas prácticas:

- Un trabajo por sección: un título y un texto de apoyo.
- El hero comunica marca + oferta + CTA; el visual 3D es apoyo, no un dashboard.
- Imágenes reales vía `lib/media.ts` y `next/image` (Unsplash permitido en `next.config.mjs`).
- 3D acotado: Spline / R3F / `TiltCard` donde aporta; respetar reduced motion.

---

## 3. Herramientas y stack

### 3.1 Runtime y framework

| Herramienta | Versión (package.json) | Uso |
| --- | --- | --- |
| Next.js | 16.2.4 | App Router, páginas y API. Scripts con webpack: `next dev --webpack` / `next build --webpack`. |
| React / React DOM | 19 | UI. |
| TypeScript | 5.7.3 | Tipado estricto. Alias `@/*` → raíz. |
| Node.js | — | Entorno local. |

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
```

### 3.2 Interfaz

| Herramienta | Uso |
| --- | --- |
| Tailwind CSS 4 | Estilos. Tokens y utilidades en `app/globals.css` (`container-pro`, `section-pad`, etc.). |
| `@tailwindcss/postcss` + PostCSS | Pipeline CSS. |
| `tw-animate-css` | Animaciones base. |
| Radix UI | Primitivos en `components/ui/`. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variantes; `cn()` en `lib/utils.ts`. |
| `lucide-react` | Iconos. |
| `next-themes` | Tema claro/oscuro (`components/theme-provider.tsx`). |
| `next/font` | Plus Jakarta Sans, Inter, JetBrains Mono en `app/layout.tsx`. |
| `motion` | Microinteracciones y springs. |
| `gsap` + `@gsap/react` | Entradas y ScrollTrigger en secciones seleccionadas. |
| `sonner` | Toasts. |

### 3.3 3D y escenas

| Herramienta | Uso |
| --- | --- |
| `@splinetool/react-spline` + `@splinetool/runtime` | Escenas Spline (p. ej. `hero-spline-bg.tsx`). Transpilado en `next.config.mjs`. |
| `@react-three/fiber` + `@react-three/drei` + `three` | Canvas WebGL (p. ej. `hero-3d-ecosystem.tsx`, `hero-server-canvas.tsx`, `scene-3d.tsx`). |
| `TiltCard` | Perspectiva CSS 3D en tarjetas; intensidad vía `/api/design` (`hooks/use-design.ts`). |

Hay un prototipo Vue + TresJS en `vue/` (no montado en el sitio Next). Sirve de referencia, no de runtime de producción.

### 3.4 Formularios, validación y correo

| Herramienta | Uso |
| --- | --- |
| Zod | Esquemas de contacto y agentes. |
| React Hook Form + resolvers | Disponibles; el contacto de la landing usa estado local + fetch. |
| Nodemailer | Correo de contacto (credenciales por entorno, no en el repo). |

### 3.5 Asistente y contenido

No hay un LLM externo cableado. El chatbot es **local**:

- Enrutamiento en `lib/agents.ts` (orquestador, cotización, soporte, técnico, B2G).
- Recuperación por palabras clave en `lib/knowledge.ts`.
- Respuesta JSON o stream SSE desde `app/api/agents/route.ts`.

### 3.6 Calidad

- TypeScript (`npx tsc --noEmit`).
- Skills de Cursor en `.cursor/skills/`.
- Git para versiones. No hay suite de tests en `package.json`.

---

## 4. Cómo está dividido el repositorio

```text
Findtec/
├── app/                     # App Router: páginas, layout y APIs
│   ├── page.tsx             # Home
│   ├── layout.tsx           # Fuentes, metadatos, SiteFrame, tema
│   ├── globals.css
│   ├── servicios/page.tsx
│   ├── nosotros/page.tsx
│   ├── sector-publico/page.tsx
│   ├── contacto/page.tsx
│   └── api/                 # Endpoints JSON / SSE
├── components/
│   ├── site-frame.tsx       # Navbar + children + Footer + SmartChatbot
│   ├── sections/            # Bloques de página
│   ├── ui/                  # Primitivos Radix + Tailwind
│   ├── navbar.tsx
│   ├── page-header.tsx      # Cabecera de páginas internas
│   ├── smart-chatbot.tsx
│   ├── hero-*.tsx / scene-3d.tsx / tilt-card.tsx / reveal.tsx
│   └── ...
├── hooks/                   # useSiteStatus, useDesign, ...
├── lib/                     # Datos y reglas (sin JSX)
├── public/                  # Estáticos (/icon.svg, /images, /models)
├── vue/                     # Prototipo TresJS (fuera del runtime Next)
└── .cursor/skills/          # Guías de copy, auditoría y mejora
```

### 4.1 Rutas de página

| Ruta | Archivo | Contenido principal |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero, clients, software showcase, home services, trust, testimonials, CTA. |
| `/servicios` | `app/servicios/page.tsx` | `PageHeader` + `ServicesSection` (catálogo). |
| `/nosotros` | `app/nosotros/page.tsx` | `PageHeader` + `AboutSection` + `TrustSection`. |
| `/sector-publico` | `app/sector-publico/page.tsx` | `PageHeader` + `B2GSection`. |
| `/contacto` | `app/contacto/page.tsx` | `PageHeader` + `ContactSection` (lee `searchParams`). |

El layout (`app/layout.tsx`) envuelve todo con `ThemeProvider`, `SiteFrame` y `Toaster`.

### 4.2 Home montada en `app/page.tsx` (orden)

| Orden | Componente | Rol |
| --- | --- | --- |
| 1 | `hero-section.tsx` | Marca, oferta, CTAs, escena 3D (`Hero3DEcosystem`). |
| 2 | `clients-section.tsx` | Cinta de tecnologías / estándares. |
| 3 | `software-showcase.tsx` | Showcase interactivo de software. |
| 4 | `home-services.tsx` | Tres frentes destacados del catálogo. |
| 5 | `trust-section.tsx` | Metodología / fases. |
| 6 | `testimonials-section.tsx` | Respaldo y testimonios. |
| 7 | `cta-section.tsx` | Cierre a cotización / WhatsApp. |

### 4.3 `app/api/` — contratos HTTP

| Ruta | Método | Qué entrega |
| --- | --- | --- |
| `/api/company` | GET | Marca, RUC, contacto, capacidades, stack. |
| `/api/services` | GET | Catálogo con imagen y metadatos. |
| `/api/site` | GET | Horario Lima, `responseHint`, stack, canales. |
| `/api/design` | GET | Tokens de marca, motion, escena 3D / tilt. |
| `/api/contact` | POST | Valida el lead y envía correo. |
| `/api/agents` | GET, POST | Agentes y respuesta (JSON o stream). |
| `/api/knowledge` | GET | Consulta el corpus local. |
| `/api/assist` | POST | Atajo de asistencia ligado al conocimiento. |

### 4.4 `lib/` — fuente de verdad

| Archivo | Rol |
| --- | --- |
| `lib/company.ts` | Nombre, RUC, contacto, WhatsApp, `serviceOptions`. |
| `lib/media.ts` | Fotos / mapa `servicio → imagen`. |
| `lib/quote.ts` | `startQuote`, evento `findtec-quote`, deep-link a contacto. |
| `lib/agents.ts` | Perfiles y redacción del asistente. |
| `lib/knowledge.ts` | Hechos recuperables por palabras clave. |
| `lib/experience.ts` | Capacidades (secciones de proyectos pueden no estar montadas). |
| `lib/utils.ts` | `cn()`. |

### 4.5 Shell y componentes clave

| Pieza | Rol |
| --- | --- |
| `site-frame.tsx` | Navbar + página + Footer + SmartChatbot + scroll progress. |
| `navbar.tsx` | Navegación multipágina, tema, Cotizar, abrir chatbot. |
| `page-header.tsx` | Intro de páginas internas (kicker, título, descripción). |
| `smart-chatbot.tsx` | Asistente flotante; aparece tras scroll; tema claro/oscuro. |
| `sections/footer.tsx` | Marca legal, enlaces y contacto. |

### 4.6 Hooks

| Hook | Rol |
| --- | --- |
| `hooks/use-site-status.ts` | `GET /api/site`. |
| `hooks/use-design.ts` | `GET /api/design` (parallax, tilt, escena). |
| `hooks/use-mobile.ts`, `hooks/use-toast.ts` | Utilidades. |

### 4.7 `public/`

| Ruta | Rol |
| --- | --- |
| `public/icon.svg` | Favicon. |
| `public/images/*` | Logos y assets estáticos. |
| `public/models/` | Modelos GLTF/GLB opcionales para escenas 3D. |

---

## 5. Qué está en disco y no se monta (o es opcional)

Archivos de sección que pueden existir sin estar en la home actual (revisar imports antes de asumir que se ven):

- `experience-section.tsx`, `features-section.tsx`, `decision-section.tsx`
- `presentation-section.tsx`, `catalog-section.tsx`, `solutions-section.tsx`
- `additional-services-section.tsx`, `rnp-status-section.tsx`, `process-section.tsx`, `tech-stack-section.tsx` (esta última sí se usó en páginas de servicios en versiones previas; hoy `/servicios` monta `ServicesSection`)
- Gran parte de `components/ui/*` (kit listo para reutilizar)
- `vue/*` — prototipo TresJS, no forma parte del bundle Next

Para mostrar una sección: importarla en la `page.tsx` correspondiente y, si hace falta, enlace en `navbar.tsx` / footer.

---

## 6. Flujos que cruzan carpetas

### Cotización desde un servicio

```text
ServicesSection / HomeServices / Hero (clic Cotizar)
  → lib/quote.ts startQuote()
  → evento findtec-quote
  → navegación a /contacto?servicio=...
  → ContactSection precarga el formulario
  → POST /api/contact
  → Nodemailer
```

### Chatbot

```text
navbar / evento open-findtec-chatbot
  → smart-chatbot.tsx
  → POST /api/agents  (stream o JSON)
  → lib/agents.ts + lib/knowledge.ts
  → puede llamar startQuote()
```

### Hero / diseño 3D

```text
hero-section
  → dynamic Hero3DEcosystem (R3F) u otras capas (Spline / canvas)
  → opcionalmente useSiteStatus (/api/site) y useDesign (/api/design)
```

---

## 7. Convenciones para seguir el mismo estilo

- Datos de empresa: editar `lib/company.ts`, no duplicar teléfono o RUC en cada sección.
- Nueva página: `app/<ruta>/page.tsx` + enlace en `navbar.tsx` (y footer si aplica).
- Nueva sección en home: importar en `app/page.tsx` en el orden narrativo correcto.
- Nueva imagen remota: host en `next.config.mjs` → `images.remotePatterns`, o archivo en `public/`.
- Preferir utilidades existentes (`container-pro`, `section-pad`, `font-display`) antes de inventar otra escala.
- No inventar métricas, clientes ni certificaciones que no estén en el código o en `company.ts`.
- Escenas Spline: URL en `NEXT_PUBLIC_SPLINE_SCENE` cuando se deje de usar el placeholder.
- Modelo GLB opcional: `NEXT_PUBLIC_HERO_MODEL=/models/server.glb` si el archivo está en `public/models/`.

---

## 8. Cómo previsualizar

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Comprobar:

1. Home: hero 3D, cinta tecnológica, showcase, servicios, trust, testimonios, CTA.
2. `/servicios` → cotizar un ítem (debe llegar a `/contacto` con servicio).
3. `/contacto` con correo configurado (variables de entorno Nodemailer).
4. Chatbot tras hacer scroll y tema claro/oscuro en navbar.
