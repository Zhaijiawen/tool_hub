# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ToolHub is an online developer toolbox deployed at `toolhubs.org`, offering 60+ client-side tools (formatting, encryption, encoding, converters, image tools, text tools, QR code, UUID generator, HTTP client, etc.). All tools run entirely in the browser on client side.

**Monorepo structure:**
- `toolhub/` — Vue 3 SPA frontend (pure static, deployed on Cloudflare Pages)
- `notepad/` — planning docs (not part of the app)

## Commands

```bash
# Install all dependencies (root + frontend + backend)
npm run install-all --legacy-peer-deps

# Development (runs both frontend dev server on :5173 and backend on :3000)
npm start

# Run only the backend
npm run server

# Run only the Vite dev server
npm run client

# Production build (outputs to toolhub/dist/)
npm run build:prod

# Start production (runs backend + vite preview on :4173)
npm run start:prod
```

There are **no tests, no linters, no TypeScript type-checking** configured in this project.

## Requirements

- Node.js >= 22, npm >= 10
- Backend requires Ruby + `syntax_tree` gem (for Prettier's Ruby plugin)
- `npm install --legacy-peer-deps` is required (peer dependency conflicts)

## Architecture

### Frontend (Vue 3 + Naive UI)

**Tech stack:** Vue 3 Composition API (`<script setup>`, JS not TypeScript), Naive UI 2.x (auto-imported via `unplugin-vue-components`), Pinia, Vue Router 4 (history mode), Vue I18n 9 (zh/en lazy-loaded), Vite 5.

**Key architectural patterns:**

- **Nested routing with shared layout:** `AppLayout` is the top-level route wrapping `BaseView` (which wraps individual tool components). This means the header, nav menu, favorites bar, and footer are rendered once and all tools render inside `<router-view>` — they don't need to import layout themselves.

- **Tool catalog is static data in `toolhub/src/api/tools.js`:** Every tool is registered as a plain object `{ id, name, path, description, category }`. There is no dynamic plugin system. Search and filter operate over this static array.

- **Dual code formatting strategy (`toolhub/src/utils/formatUtils.js`):** JS/HTML/CSS/JSON are formatted client-side with `js-beautify`. All other languages (PHP, Ruby, Java, Shell, SQL, XML, Vue, Markdown, YAML) are sent to `POST /api/format` on the backend. The decision is made by checking if any Prettier plugin required for the language is in the `BACKEND_REQUIRED_PLUGINS` list — those plugins are NOT shipped to the browser.

- **Module-level reactive state composables:** `useTheme.js` and `useFavorites.js` declare `ref()` at module scope (outside the exported function), making the state shared across all components that call the composable — no Pinia store needed for cross-component state. Pinia is installed but largely unused.

- **SEO via `useSeo.js`:** Dynamically manipulates `<title>`, `<meta>`, OpenGraph/Twitter tags, and JSON-LD structured data based on the current route and locale. Each tool page gets unique SEO tags derived from `locales/seo.js`. The home page uses `WebSite` schema with `SearchAction`.

- **Dark/light theming:** Naive UI `darkTheme` + CSS custom properties (`--card-color`, `--border-color`, `--text-color` etc.) toggled via `.dark` class on `<html>`. Persisted to localStorage key `theme`. **All custom CSS must use these variables — never hardcode background or border colors.**

- **Language switching:** Two languages (zh/en) with messages in `toolhub/src/locales/{zh,en}.js`. Language packs are loaded lazily via `setLocale()`. Browser language auto-detection on first visit; preference persisted to `localStorage('language')`.

- **Vite dev proxy:** `/api` requests are proxied to `http://localhost:3000` in development.

### Backend (Express 5)

Single-purpose server at `toolhub-server/src/app.js`: `POST /api/format` accepts `{ code, language }`, runs it through Prettier with the appropriate plugin, returns `{ code: 0, data: { formattedCode }, message: 'success' }`. Errors return HTTP 200 with `{ code: 1, data: null, message: error.message }` — errors are never returned as HTTP 4xx/5xx.

Prettier plugins are loaded via `createRequire(import.meta.url)` since the server uses ES modules but Prettier plugins are CommonJS.

### Build optimization

`vite.config.js` defines 15 `manualChunks` to split dependencies: `vue`, `vue-i18n`, `locales`, `ui` (Naive UI), `icons`, `utils`, `crypto`, `argon2`, `bcrypt`, `editor` (CodeMirror), `markdown`, `mathjs`, `formatter` (Prettier/js-beautify), `qrcode`. `.gz` and `.br` pre-compressed variants are generated for assets > 10KB during build.

## Adding a new tool

When adding a new tool, you must update ALL of the following files. See `notepad/new_features_plan_v3.md` for the full checklist:

| File | Action |
|------|--------|
| `toolhub/src/components/{category}/{ToolName}.vue` | Create the component |
| `toolhub/src/router/index.js` | Add route with lazy import `() => import(...)` in the correct `children` array |
| `toolhub/src/api/tools.js` | Register tool entry in the `tools` array |
| `toolhub/src/locales/zh.js` | Add i18n keys under the correct category |
| `toolhub/src/locales/en.js` | Add matching i18n keys (same structure as zh) |
| `toolhub/src/locales/toolDescriptions.js` | Add features/useCases/usageSteps/bestPractices |
| `toolhub/src/locales/seo.js` | Add name, description, keywords in zh/en |
| `toolhub/src/locales/about.js` | Update feature description for the category |
| `toolhub/src/components/layout/AppLayout.vue` | Add menu entry in `menuOptions` computed |
| `toolhub/public/docs/` | Create 6 markdown files: `{toolKey}_{background,tutorial,examples}_{zh,en}.md` |

**Component requirements:**
- Each tool component must include `<TutorialAndDocs :toolKey="'xxx'" />` at the end of its template
- Tool inputs must be persisted to localStorage with key format `toolhub_{toolKey}_input`
- Heavy dependencies (>50KB) must use dynamic `import()` — don't statically import them at the top level
- All custom CSS must use `var(--card-color)` / `var(--border-color)` / `var(--text-color)` for backgrounds and borders — never hardcode color values (breaks dark mode)

