# Technically Creative — Official Site

Production website for [Technically Creative LLC](https://technicallycreative.work) — PMP-certified project management, n8n workflow automation, and professional mixing/mastering for creative teams and musicians. Indianapolis-based, remote-friendly.

Built with **[Astro 5](https://astro.build/)** + **[Tailwind CSS](https://tailwindcss.com/)**, deployed on **Netlify**.

## What's in here

- **Marketing site** — home, services, portfolio, about, credentials, local services, contact.
- **Blog** — MDX-powered posts with categories, tags, and RSS feed.
- **Free tools** — starting with [NoteMapper](https://technicallycreative.work/notemapper), a MIDI-to-guitar-tab converter.
- **Membership** — a free tier (email capture, unlimited tool access) and a paid Member tier (Stripe subscription, Discord access), with a Premier tier coming later.
- **Accounts** — Supabase-backed auth (sign up / log in / account management), gated by `src/middleware.ts`.

## Tech stack

| Concern         | Tool                                                                             |
| --------------- | -------------------------------------------------------------------------------- |
| Framework       | [Astro 5](https://astro.build/) (server-rendered where needed, static elsewhere) |
| Styling         | [Tailwind CSS](https://tailwindcss.com/)                                         |
| Auth & database | [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`)     |
| Payments        | [Stripe](https://stripe.com/) subscriptions + webhook                            |
| Email marketing | [MailerLite](https://www.mailerlite.com/)                                        |
| CRM             | [HubSpot](https://www.hubspot.com/) (private app, contacts only)                 |
| Hosting         | [Netlify](https://www.netlify.com/) (`@astrojs/netlify` adapter)                 |

## Project structure

```
/
├── public/                  # Static assets served as-is (incl. NoteMapper's vendored Midi.js)
├── scripts/                 # Internal tooling (daily-log append/ship scripts)
├── src/
│   ├── assets/               # Images, favicons, Tailwind entrypoint
│   ├── components/
│   │   ├── blog/             # Blog listing/post components
│   │   ├── common/
│   │   ├── ui/                # Button, Headline, WidgetWrapper, etc.
│   │   └── widgets/           # Header, Footer, Pricing, BrandBanner, etc.
│   ├── content/               # Blog post collection (see src/data/post/)
│   ├── data/post/             # Blog post markdown/MDX source files
│   ├── layouts/               # Layout.astro, PageLayout.astro, MarkdownLayout.astro
│   ├── lib/                   # Server-only clients: Supabase, Stripe, MailerLite, HubSpot
│   ├── pages/
│   │   ├── [...blog]/          # Blog index/category/tag routes
│   │   ├── api/                # Astro API routes (auth, Stripe, NoteMapper, newsletter)
│   │   ├── account/             # Signed-in member pages
│   │   ├── services/            # Individual service detail pages
│   │   ├── membership.astro     # Free / Member / Premier pricing tiers
│   │   ├── notemapper.astro     # Free NoteMapper tool
│   │   └── ...                  # index, about, contact, portfolio, etc.
│   ├── middleware.ts           # Auth gate + anonymous visitor cookie
│   ├── navigation.ts           # Header/footer nav data
│   └── config.yaml             # Site name, SEO defaults, blog settings
├── supabase/schema.sql         # Paste into the Supabase SQL editor to provision tables/policies
├── astro.config.ts
└── package.json
```

## Getting started

```shell
npm install
cp .env.example .env   # fill in real Supabase/Stripe/MailerLite/HubSpot values
npm run dev             # http://localhost:4321
```

See `.env.example` for the full list of required environment variables and where to find each one (Supabase dashboard, Stripe dashboard, MailerLite, HubSpot).

### Commands

| Command                                   | Action                                         |
| ----------------------------------------- | ---------------------------------------------- |
| `npm run dev`                             | Start the local dev server at `localhost:4321` |
| `npm run build`                           | Build the production site to `./dist/`         |
| `npm run preview`                         | Preview a production build locally             |
| `npm run check`                           | Run Astro, ESLint, and Prettier checks         |
| `npm run fix`                             | Auto-fix ESLint and Prettier issues            |
| `npm run log:append` / `npm run log:ship` | Internal daily-log tooling (see `scripts/`)    |

## Deployment

Pushes to `master` deploy to Netlify via `.github/workflows/deploy-netlify.yml`. GitHub Pages deployment (`deploy.yml`) is disabled — this site has server-rendered routes (auth, Stripe checkout, NoteMapper's usage gate) that static-only Pages hosting can't serve.

## Database

`supabase/schema.sql` is the source of truth for tables and row-level-security policies (`profiles`, `notemapper_usage`, `notemapper_saves`). Paste it into the Supabase SQL editor for a fresh project.

## License

Originally built on the [AstroWind](https://github.com/arthelokyo/astrowind) template (MIT) — see [LICENSE.md](./LICENSE.md).
