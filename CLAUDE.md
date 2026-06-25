# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:4321
npm run build    # build to dist/
npm run preview  # preview the production build
```

## Architecture

This is an **Astro static site** (no framework islands, no SSR). All pages render to plain HTML at build time.

### Routing

Astro uses file-based routing from `src/pages/`. URL mapping:

| File | URL |
|------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/products/index.astro` | `/products` |
| `src/pages/products/mukagen.astro` | `/products/mukagen` |
| `src/pages/products/yemoja-susv.astro` | `/products/yemoja-susv` |
| `src/pages/products/condor.astro` | `/products/condor` |

### Shared layout

Every page wraps its content in `src/layouts/Layout.astro`, which provides the `<html>` shell, global CSS import, nav, and footer. Pages pass `title` and optionally `description` as props.

### Styles

One global stylesheet: `src/styles/global.css`. It is imported once in `Layout.astro` and applies site-wide. No CSS modules or scoped styles are used. All CSS variables are defined in `:root` at the top of that file.

### JavaScript

The only client-side JS is the tab switcher on product detail pages. It uses `<script is:inline>` so the global `showTab()` function is accessible from `onclick` attributes on the tab buttons. No JS framework or bundled scripts otherwise.

### Adding a product page

1. Create `src/pages/products/<name>.astro` — copy the structure from `mukagen.astro`.
2. Add a card to the home page grid in `src/pages/index.astro`.
3. Add a row to the products listing in `src/pages/products/index.astro`.
4. Add a footer link in `src/layouts/Layout.astro`.

### Legacy files

The original static HTML files (`index.html`, `about.html`, `page.html`, etc.) and `style.css` in the repo root are the pre-migration source. They are not served by Astro and can be ignored or deleted.
