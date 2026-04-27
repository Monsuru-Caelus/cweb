# Caelus Industries Website — Handoff Document

Last updated: April 26, 2026. Written for Claude Code sessions picking up from here.

---

## Project Overview

Marketing website for **Caelus Industries**, a defense-tech startup building autonomous maritime and counter-UAS platforms. Founded by **Monsuru Anifowose** (CEO). The site is fully built, deployed to GitHub (`stygmatic/cweb`, branch `main`), and ready to deploy on Vercel.

**Live target domain:** `caelusindustries.com`  
**Contact email:** `contact@caelusindustries.com`

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 6.x (`output: 'static'`) | Static-first, no JS framework needed; server endpoint for contact form |
| Adapter | `@astrojs/vercel` | Vercel deployment |
| Email | Resend JS SDK | Contact form sends via `src/pages/api/contact.ts` |
| Sitemap | `@astrojs/sitemap` | Auto-generates `/sitemap-index.xml` at build |
| Styles | Single global CSS file | No scoped styles, no CSS modules — everything in `src/styles/global.css` |
| Fonts | Google Fonts (preconnected) | 4 typefaces — see Design System below |
| JS | None (except one inline tab switcher) | No framework, no bundled scripts |

**Key config — `astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://caelusindustries.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});
```

> `output: 'static'` is correct for Astro 5+. The old `'hybrid'` mode was removed.  
> The contact API endpoint (`src/pages/api/contact.ts`) uses `export const prerender = false` implicitly — it works as a server function on Vercel even in static mode.

---

## Environment Variables

One env var required:

```
RESEND_API_KEY=re_PCq5pvSb_77CKCy32BoBJCuCuf4DBra58
```

- Stored in `.env` locally (gitignored)
- Must be added to **Vercel project settings → Environment Variables** before deploying
- Used in `src/pages/api/contact.ts`

---

## File Structure & Routing

```
src/
  layouts/
    Layout.astro          # Shared HTML shell — nav, footer, all head meta
  styles/
    global.css            # Single stylesheet for entire site
  pages/
    index.astro           → /
    about.astro           → /about
    careers.astro         → /careers
    contact.astro         → /contact
    journal.astro         → /journal  (listing page)
    journal/
      three-souls.astro             → /journal/three-souls
      some-missions-choose-you.astro → /journal/some-missions-choose-you
      command-the-sea.astro         → /journal/command-the-sea
    products/
      index.astro         → /products  (listing page)
      mukagen.astro       → /products/mukagen
      yemoja-susv.astro   → /products/yemoja-susv
      condor.astro        → /products/condor
    api/
      contact.ts          → POST /api/contact  (Resend email endpoint)

public/
  favicon.svg             # Geometric "C" mark, black rounded square
  robots.txt              # Allows all crawlers, points to sitemap
  images/
    mukagen_preview.png   # Homepage card
    yemoja_preview.jpeg   # Homepage card
    condor_preview.jpeg   # Homepage card
    mukagen.png           # Product page hero + listing
    yemoja.jpeg           # Product page hero + listing
    condor.jpeg           # Product page hero + listing
    og-default.jpeg       # Default Open Graph social share image (copy of condor_preview)
    journal/
      command-the-sea.png # Article cover for "Command the Sea" article
```

---

## Design System

### Colors
All defined as CSS variables in `:root`:

| Variable | Value | Usage |
|---|---|---|
| `--black` | `#000` | Page background |
| `--white` | `#fff` | Primary text, borders |
| `--off-white` | `#f6f8fb` | CTA section background |
| `--gray` | `#dbe0ec` | Section label rule line |
| `--muted` | `rgba(255,255,255,0.5)` | Secondary text, tags, meta |
| `--max` | `1240px` | Max content width |

### Typography — 4 Fonts
| Variable | Font | Usage |
|---|---|---|
| `--font-serif` | Source Serif 4 | Hero headings, body copy in principle cards, feature bodies |
| `--font-sans` | Radio Canada Big | Nav logo, section labels, product names, principle titles |
| `--font-body` | Inter | General body text, form inputs, article prose |
| `--font-mono` | Geist Mono | Tags, labels, buttons, dates, metadata, tab buttons |

> **Rule:** All `h1–h6` and `p` tags have `font-size: inherit; font-weight: inherit` reset. Font family, size, and weight are always applied via class or explicit style — never assumed from the tag.

### Key UI Patterns
- **Borders:** `1px solid rgba(255,255,255,0.08)` — consistent throughout
- **Hover state:** Usually `opacity: 0.7` on cards/links, or `border-color` bump on buttons
- **Buttons:**
  - `.btn-primary` — transparent with white border, monospace font, inline-flex with dot icon
  - `.btn-dark` — black background, white text, used in CTA sections
  - `.nav-cta` — same as btn-primary but in nav
- **Animations:** `fadeUp` keyframe (opacity + translateY) used on product cards and principles. `heroReveal` on homepage hero. `slideDown` on nav.
- **Dividers:** `<div class="divider">` = `1px solid rgba(255,255,255,0.08)` with `margin: 0 40px`

---

## Layout.astro — How It Works

Every page wraps its content in `<Layout>`. Props:

```ts
interface Props {
  title: string;           // Required — page <title>
  description?: string;    // Defaults to site-wide description
  ogImage?: string;        // Defaults to /images/og-default.jpeg
}
```

**Named slot `head`:** Pages can inject additional `<head>` content (JSON-LD schema, etc.) using:
```astro
<Layout title="...">
  <script slot="head" type="application/ld+json" set:html={JSON.stringify({...})}/>
</Layout>
```

**What Layout provides automatically:**
- Favicon (`/favicon.svg`)
- Google Fonts preconnect
- Canonical URL (computed from `Astro.site` + `Astro.url.pathname`)
- Meta description
- `robots: index, follow`
- Full Open Graph tags (`og:locale`, `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image`)
- Twitter Card tags
- Organization JSON-LD schema
- Fixed nav (blurred glass, 60px height, slides down on load)
- Footer (product links + LinkedIn/X/email)

---

## Page Design Decisions

### Homepage (`index.astro`)
- Full-viewport hero with `aspect-ratio: 1280/824`, CSS-only background (no image — gradient + subtle grid pattern)
- H1 uses `--font-serif` at `clamp(36px, 6vw, 90px)`, weight 300
- 3-column product card grid (flex-wrap) with `loading="lazy"` images
- Principles section on dark purple-tinted background with white cards
- CTA aside on `--off-white` (light section)
- Page title: `"Caelus Industries — Autonomous Maritime & Counter-UAS Defense Systems"` (keyword-optimized)

### Product Pages (MUKAGEN, YEMOJA sUSV, Condor)
**Hero pattern:** Full-width image with title overlaid at the bottom using absolute positioning + gradient:
```html
<div style="position:relative;width:100%;margin-top:60px;">
  <img src="..." style="width:100%;height:auto;display:block;"/>
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.1) 100%);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;padding:48px 40px;">
    <!-- breadcrumb + h1 + subtitle -->
  </div>
</div>
```

> **MUKAGEN** uses this gradient. **Condor** hero is the same but the overlay is fully transparent (you can see the image through the title bar) — because the image has strong contrast at the bottom. **YEMOJA** uses the gradient like MUKAGEN.

**Tab switcher:** Each product page has 5 tabs. The JS function is `showTab(tabId, btn)` defined via `<script is:inline>` at the bottom of each page. It's `is:inline` so `showTab` is available globally as `onclick="showTab('features',this)"`. Do NOT put this in a regular `<script>` — it won't be accessible from `onclick` attributes.

**Tab IDs:** `features`, `specs`, `configs`, `deployment`, then either `mounting` (MUKAGEN), `addons` (YEMOJA), or `payload` (Condor).

### Journal Pages
- Listing at `/journal` — 3 article cards, each links to internal pages
- Article pages under `src/pages/journal/` follow consistent structure:
  - Page hero with breadcrumb (Journal > Article Title)
  - `class="article-body"` div: `font-size: 17px; line-height: 1.8` with `margin-bottom: 1.5em` on paragraphs
  - Author byline (Monsuru Anifowose, CEO)
  - "Explore Our Products" internal link section
  - "← Back to Journal" link
- All articles written by Monsuru Anifowose (CEO). He owns the content — safe to republish.

### Contact Page
- Form submits via `fetch` to `POST /api/contact`
- Uses `FormData` — no JSON serialization needed
- Inline success/error messages (`id="form-success"`, `id="form-error"`)
- The API endpoint validates required fields, sends via Resend SDK
- **Current `from:` address:** `onboarding@resend.dev` (Resend sandbox) — must update to `contact@caelusindustries.com` once domain is verified in Resend dashboard

---

## SEO Implementation

Everything lives in `Layout.astro` (sitewide) and per-page via the `head` slot.

### Sitewide (Layout.astro)
- Canonical URL
- Meta description (with fallback default)
- `robots: index, follow`
- Open Graph (locale, type, site_name, url, title, description, image)
- Twitter Card (summary_large_image)
- Organization JSON-LD schema

### Per-Page Schema (via `slot="head"`)
| Page type | Schema added |
|---|---|
| Homepage | `WebSite` |
| Product pages | `BreadcrumbList` + `Product` |
| Journal articles | `BreadcrumbList` + `Article` (with author, datePublished) |
| Careers | `BreadcrumbList` + `JobPosting` × 3 (shows in Google Jobs) |

### Other SEO
- `robots.txt` at `/public/robots.txt` — allows all, points to sitemap
- Sitemap auto-generated by `@astrojs/sitemap` at build → `/sitemap-index.xml`
- `loading="lazy"` on all non-hero images
- Font preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
- Internal links: journal articles → product pages via "Explore Our Products" section
- Google Search Console: sitemap submitted

---

## Contact Form — API Endpoint

**File:** `src/pages/api/contact.ts`

```ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  // Validates: firstName, lastName, email, message (required)
  // Optional: organization
  // Sends to: contact@caelusindustries.com
  // Reply-to: sender's email
};
```

**To fully activate:** Verify `caelusindustries.com` in the Resend dashboard, then change the `from` field from:
```
'Caelus Contact Form <onboarding@resend.dev>'
```
to:
```
'Caelus Contact Form <contact@caelusindustries.com>'
```

---

## Deployment

**Repo:** `https://github.com/stygmatic/cweb` (branch: `main`)  
**Target host:** Vercel

**To deploy on Vercel:**
1. Import `stygmatic/cweb` on Vercel
2. Framework auto-detected as Astro — no build settings to change
3. Add environment variable: `RESEND_API_KEY` = key from `.env`
4. Deploy

**Build command:** `npm run build`  
**Output directory:** `.vercel/output` (handled by adapter automatically)

**`.gitignore` excludes:** `node_modules/`, `dist/`, `.astro/`, `.vercel/`, `.env`, `.env.*`

---

## Adding New Content

### New Product Page
1. Create `src/pages/products/<name>.astro` — copy structure from `mukagen.astro`
2. Add hero image to `public/images/<name>.jpeg` and `public/images/<name>_preview.jpeg`
3. Add card to homepage grid in `src/pages/index.astro`
4. Add row to `src/pages/products/index.astro`
5. Add footer link in `src/layouts/Layout.astro`
6. Add Product + BreadcrumbList JSON-LD via `slot="head"`

### New Journal Article
1. Create `src/pages/journal/<slug>.astro` — copy structure from `three-souls.astro`
2. Add card to `src/pages/journal.astro` listing (link internally, not to Medium)
3. Add Article + BreadcrumbList JSON-LD via `slot="head"`
4. Add "Explore Our Products" links at bottom

---

## Pending Items

| Item | Notes |
|---|---|
| Resend domain verification | Verify `caelusindustries.com` in Resend dashboard, then update `from:` in `src/pages/api/contact.ts` |
| LinkedIn company page URL | Footer and JSON-LD currently point to generic `linkedin.com` — update when company page created |
| X (Twitter) company URL | Same — currently generic `x.com` |
| Google Search Console | Sitemap submitted. Use URL Inspection tool to request indexing on homepage for faster crawl. |
| Backlinks | Highest-impact SEO action remaining: link `caelusindustries.com` from Monsuru's Medium author bio and article footers; create LinkedIn company page linking to site |
| Job applications | Careers page job items have no `href` — they're currently static UI. Wire up to a form or email link if applications should actually work. |
| Subscribe bar | Journal listing has an email subscribe input — not wired to anything yet |
| Team photos | About page team cards have placeholder photo slots |

---

## Known Design Quirks

- **No `<h1>` on page hero inner pages** — The `.page-hero` component uses `.page-title` class which is not a semantic heading tag. Product and journal pages that use the image-overlay hero DO use `<h1 class="page-title">`. Consistent.
- **`margin-top: 60px` on product heroes** — This offsets the fixed 60px nav so the image isn't hidden behind it.
- **`product-hero-img` CSS class** — Still in global.css but no longer used by MUKAGEN, YEMOJA, or Condor (all three migrated to the overlay pattern). Only present as legacy CSS.
- **Tab JS is duplicated** — Each product page has its own `showTab` function in a `<script is:inline>` block. This is intentional — `is:inline` bypasses Astro's module deduplication, which is needed for `onclick=""` access.
- **Images are not WebP** — All product images are PNG or JPEG. Converting to WebP would improve Core Web Vitals but requires replacing the source files.
