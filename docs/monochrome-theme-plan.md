## Monochrome Theme Rollout Plan (Black/White + optional Grays)

Goal: Make the entire site strictly black-and-white with optional neutral grays only, while introducing a centralized theme system so future theme changes require editing a single source of truth.

Scope: Next.js App Router with Tailwind v4 and existing CSS variables in `src/app/globals.css`.

---

### 1) Establish single source of truth for theme tokens

- Create/expand a small, centralized token map using CSS variables and Tailwind v4 `@theme` inline tokens in `src/app/globals.css`.
  - Define only neutral tokens: background, foreground, border, muted, muted-foreground, link, link-hover, primary, primary-foreground, accent, accent-foreground, success, warning, danger if needed — all mapped to grayscale.
- Add a named theme namespace using a `data-theme` attribute on the `html` element (e.g., `data-theme="mono-light"` / `data-theme="mono-dark"`).
- Keep the existing `prefers-color-scheme` as a sensible default; the `data-theme` attribute will override it if present.

Deliverable (no code here yet): Document exact token names and the two monochrome palettes (light/dark) inside this plan so they can be lifted directly into `globals.css`.

---

### 2) Inventory and replace non-neutral colors across the repo

Replace all non-neutral Tailwind utilities and hex values (e.g., `bg-blue-600`, `text-blue-600`, `hover:bg-blue-700`, etc.) with semantic classes that resolve to our tokens. Prioritize replacing by semantic intent rather than 1:1 color swaps.

Files to update (from repo scan):

- `src/app/layout.tsx`
  - `nav` and header use `bg-white`, `border-b`, `text-gray-900`. Replace with token-backed utility variants.
- `src/app/page.tsx`
  - Hero and CTA buttons use `bg-blue-600`, `hover:bg-blue-700`, `text-blue-600`, `hover:bg-blue-50`, `bg-white`, `text-gray-900`, `text-gray-600`, `bg-gray-50`.
  - Replace with token-backed variants for primary actions, links, background, and muted text.
- `src/components/auth/AuthButton.tsx`
  - Uses `text-blue-600`, `hover:text-blue-800`, `bg-blue-600`, `hover:bg-blue-700`, `text-gray-700`.
  - Replace with token-backed link and primary button variants.
- `src/components/ProtectedRoute.tsx`
  - Loading state uses `bg-gray-100`. Replace with token-backed muted background.
- `src/app/dashboard/page.tsx`
  - Review for any lingering color utilities (scan and replace similarly).
- Global styles: `src/app/globals.css`
  - Consolidate variables and ensure Tailwind tokens point to variables.

Notes:

- Also grep for any inline `style={{ color: ... }}` or hex codes and replace with semantic classes or CSS vars.

---

### 3) Add a theme switch mechanism (optional now, future-proof)

- Decide on policy: either auto-detect with `prefers-color-scheme` or provide an explicit toggle stored in `localStorage`.
- If toggle desired, set/remove `data-theme` on `document.documentElement` (`html` tag) and persist user preference.
- Keep the system monochrome-first; even if a toggle exists, both themes remain neutral-only.

Implementation notes (for later):

- Minimal client util: read saved theme, apply on hydration, fall back to system.
- Ensure it runs before paint to avoid FOUC (inline script or `next/script` with beforeInteractive).

---

### 4) Introduce semantic class conventions

- Adopt semantic utility patterns that map to tokens, e.g.:
  - Background: `bg-background`, `bg-muted`
  - Text: `text-foreground`, `text-muted-foreground`
  - Borders: `border-border`
  - Links: `text-link hover:text-link-hover`
  - Buttons: `bg-primary text-primary-foreground hover:bg-primary-hover` (all neutral grays)
- Where necessary, create minimal component-level wrappers (e.g., `Button`, `Link`) that centralize classes for consistency.

Outcome: UI elements no longer reference specific color names (blue/green/etc.). They use semantic classes that source from the monochrome token set.

---

### 5) Enforcement and guardrails

- Add an ESLint or custom lint rule to forbid direct color hex codes and non-neutral Tailwind color utilities (e.g., `/\b(bg|text|border)-(red|green|blue|pink|purple|yellow|orange|indigo|emerald|teal|cyan|fuchsia)[-\d]+\b/`).
- Optionally add a CI step that greps for banned patterns and fails builds.
- Document how new components must consume tokens.

---

### 6) Accessibility checks (contrast)

- Validate contrast ratios in both `mono-light` and `mono-dark` using tooling (e.g., axe, Lighthouse, manual spot checks).
- Adjust gray steps if any text falls below WCAG AA for the given size/weight.

---

### 7) Rollout steps (sequenced)

1. Define token names and two monochrome palettes in this doc (light/dark).
2. Update `src/app/globals.css` to include the complete token set and `@theme` mappings.
3. Add optional `data-theme` support on `html` in `src/app/layout.tsx` (default from system, overridable).
4. Refactor shared UI (e.g., header/nav, buttons, links) to semantic classes first.
5. Replace colors in pages/components file-by-file (Home, Auth, Dashboard) using semantic classes.
6. Run accessibility checks and adjust gray scale tokens as needed.
7. Add lint/CI guardrails to prevent regressions.
8. Author a short README section in `SETUP.md` describing how to change theme by editing a single token file (`globals.css` token block).

---

### 8) Monochrome token catalog (to be implemented in `globals.css`)

Token names (no code here; values listed for clarity only):

- Light theme (`data-theme="mono-light"` or default):
  - `--background`: white (e.g., `#ffffff`)
  - `--foreground`: near-black (e.g., `#111111`)
  - `--muted`: very light gray background (e.g., `#f6f6f6`)
  - `--muted-foreground`: medium gray (e.g., `#6b6b6b`)
  - `--border`: light gray (e.g., `#e5e5e5`)
  - `--link`: near-black (e.g., `#111111`)
  - `--link-hover`: medium-dark gray (e.g., `#2d2d2d`)
  - `--primary`: near-black (used for primary buttons)
  - `--primary-foreground`: white
  - `--accent`: medium gray (used for secondary surfaces)
  - `--accent-foreground`: near-black

- Dark theme (`data-theme="mono-dark"`):
  - `--background`: near-black (e.g., `#0a0a0a`)
  - `--foreground`: very light gray (e.g., `#ededed`)
  - `--muted`: dark gray background (e.g., `#121212`)
  - `--muted-foreground`: mid-light gray (e.g., `#a3a3a3`)
  - `--border`: darker gray (e.g., `#262626`)
  - `--link`: very light gray
  - `--link-hover`: mid-light gray
  - `--primary`: very light gray (inverted primary)
  - `--primary-foreground`: near-black
  - `--accent`: mid-dark gray
  - `--accent-foreground`: very light gray

Map tokens to Tailwind v4 `@theme` custom properties so we can use `bg-background`, `text-foreground`, etc., across the app.

---

### 9) File-by-file checklist

- `src/app/globals.css`: centralize tokens, theme blocks (light/dark), and Tailwind `@theme` mappings; keep `prefers-color-scheme` fallback.
- `src/app/layout.tsx`: add `data-theme` handling on `html`; update header/nav classes to semantic tokens.
- `src/app/page.tsx`: convert all CTA/link/button/background/text colors to semantic classes.
- `src/components/auth/AuthButton.tsx`: switch link/button/text to semantic token classes.
- `src/components/ProtectedRoute.tsx`: replace loading background with token class.
- `src/app/dashboard/page.tsx`: replace any non-neutral colors with semantic token classes.
- Grep repository for `bg-*-*`, `text-*-*`, `border-*-*` non-neutral palettes and replace.

---

### 10) How to change theme in the future

- Edit the token values in one place (`src/app/globals.css` token blocks). No component changes required if semantic classes are followed.
- If introducing a brand color later, add a new semantic token (e.g., `--brand`) and map a specific component variant to it, while keeping core UI monochrome.

---

### 11) Acceptance criteria

- No non-neutral colors remain in code (excluding intentionally named brand token not used yet).
- All surfaces and texts use semantic classes backed by tokens.
- Optional theme toggle works; system preference respected by default.
- AA contrast met for text and interactive elements in light and dark.
