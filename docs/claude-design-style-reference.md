# Technically Creative — Style Reference for Claude Design

Paste this into Claude Design as a style reference / design brief. Source of truth: `tailwind.config.js`, `src/components/CustomStyles.astro`, `src/assets/styles/tailwind.css`, `src/components/ui/*`.

**Vibe:** futuristic, techy, high-contrast. Orbitron display type, electric cyan primary, violet and hot-pink accents, pill buttons, rounded glass-like cards, dark mode that goes true black.

## Color tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--tc-primary` | rgb(0 200 255) cyan | same | Primary buttons, links, nav hover/active, focus ring |
| `--tc-secondary` | rgb(155 48 255) violet | same | Button hover, taglines, secondary emphasis |
| `--tc-accent` | rgb(255 51 153) pink | same | Sparing highlights |
| `--tc-text-heading` | rgb(0 0 0) | rgb(247 248 248) | Headings |
| `--tc-text-default` | rgb(16 16 16) | rgb(229 236 246) | Body |
| `--tc-text-muted` | rgb(16 16 16 / 85%) | rgb(160 170 190 / 66%) | Subtitles, descriptions, footer links |
| `--tc-bg-page` | rgb(255 255 255) | rgb(0 0 0) | Page background |
| selection | lavender bg / near-black text | rgb(10 10 20) bg / snow text | `::selection` |

Neutrals for borders/cards come from Tailwind slate/gray (`border-slate-200/80` light, `border-slate-700/60` dark). Sticky header in dark mode: `#030621` at ~90% with blur.

Dark mode is class-based (`.dark` on `<html>`); brand colors don't change between modes, only text and background do.

## Typography

- **Headings, labels, nav, buttons:** Orbitron (weights 500–900), always UPPERCASE, `letter-spacing: 0.02em` (buttons and nav use 0.04em).
- **Body:** Inter Variable (also used as the serif fallback).
- Section headline pattern: small tagline (Orbitron, bold, uppercase, tracking-wide, violet `text-secondary`) → H2 (`text-3xl md:text-4xl`, bold, tight tracking/leading) → subtitle (`text-xl`, muted). Centered, `max-w-3xl`, `mb-8 md:mb-12`.
- Item titles: `text-xl font-bold`; descriptions muted with `mt-3`.

## Layout and spacing

- Content width: `max-w-7xl mx-auto px-4 sm:px-6` (also `.container` = 1280px, 24px side padding).
- Section rhythm: `py-12 md:py-16 lg:py-20`; hero `py-12 md:py-20`.
- Grids: 12-column in footer (`gap-4 gap-y-8 sm:gap-8`); feature grids 2–4 columns with generous gaps.
- Header is transparent over the hero, then becomes solid with blur and a soft shadow on scroll. Hero pulls up behind it (`md:-mt-[76px]`).

## Shape, elevation, motion

- **Buttons:** fully rounded pills. **Cards:** `rounded-2xl` / `rounded-3xl`, 1px slate border, `shadow-lg` / `shadow-xl` in light mode, no shadow in dark.
- Glass panels: `bg-white/80 dark:bg-slate-900/70 backdrop-blur-md`.
- Sections animate in on scroll: `fadeInUp` (opacity 0→1, translateY 2rem→0, 1s), desktop only and respecting reduced motion.
- Hover transitions about 150–200ms ease.

## Components

**Button**
- Primary: pill, cyan fill, white text, Orbitron uppercase semibold; hover turns violet (fill and border).
- Secondary: pill, transparent, 1px gray-400 border, hover `gray-100` bg (dark: slate-800).
- Tertiary: no border, muted text, brightens on hover.
- Link: plain text, cyan on hover.
- Size: `py-3.5 px-6 md:px-8`, base text. Optional trailing 20px icon.

**Header nav link:** Orbitron uppercase, `px-4 py-3`; on hover/focus/active the text turns cyan and a 2px rounded cyan underline fades in. Focus-visible shows a 2px cyan pill ring.

**Hero:** left-aligned glass card (`rounded-3xl`, blurred translucent white or slate-900, border, shadow-xl) over a full-bleed background image with a `slate-900/60` overlay; tagline, title, subtitle, action buttons, optional inline image beside the text.

**Feature / item grid:** icon (28px) beside title and muted description, optional call-to-action link; items fade in on scroll.

**Testimonials:** horizontal scroll-snap carousel of cards (`rounded-2xl`, `p-6 md:p-8`, near-white / slate-900 bg, thin border); quote in slate-700 (dark: slate-300), name `text-lg font-semibold`.

**Footer:** top border, 12-col grid (brand block spans 4, link columns span 2–3), small muted links that underline on hover, bottom bar with copyright and social icons.

**Other widgets in the site:** Announcement banner, Brands strip, Call to Action, Contact form, FAQs, Pricing, Stats, Steps, Timeline, Blog latest/highlighted posts, Note.

## Do / Don't

- Do use cyan for the primary action, once per view where possible; violet only for hover and tagline emphasis.
- Do keep every heading, label, and button in uppercase Orbitron.
- Do design every screen in both light and dark; dark should be true black, not gray.
- Don't use square corners or heavy drop shadows.
- Don't mix in other display fonts or add new brand colors.
