# Rename plan: NoteMapper → TechCre8 Midi to Tab

Searched case-insensitively for `notemapper`, `note-mapper`, `note_mapper`, `note mapper` (110 hits, 17 files; no dated blog/changelog entries or JSON-LD contain the name; navigation.ts and the sitemap config don't hardcode it — the sitemap is auto-generated from routes).
Redirect mechanism: `netlify.toml` (Netlify adapter, no `_redirects` file).

## 1. User-facing copy → change
- `src/pages/notemapper.astro` — header tagline, two "TechCre8 NoteMapper v4" footers, report-export brand line, signup gate copy ("keep using NoteMapper"), `<!-- aka -->` comment
- `src/pages/tools.astro` — meta description, card name
- `src/pages/membership.astro` — "Unlimited NoteMapper conversions"
- `src/pages/account.astro` — "View NoteMapper saves"
- `src/pages/account/notemapper-saves.astro` — page title, h1, body copy
- `src/components/Breadcrumbs.astro` — slug label map
- `README.md` — product mentions

## 2. Meta / SEO / OG → change
- `notemapper.astro`: `<title>`, description, canonical, `og:url`, `og:title`, `og:description`; add `twitter:title`/`twitter:description`
- No JSON-LD present. Sitemap is auto-generated (new URL appears on build).

## 3. URLs and filenames → move + 301
- `/notemapper` → `/midi-to-tab` (`src/pages/notemapper.astro`)
- `/notemapper/Midi.js` → `/midi-to-tab/Midi.js` (`public/notemapper/`)
- `/account/notemapper-saves` → `/account/midi-to-tab-saves`
- `/api/notemapper/{save,capture-email,check-and-increment}` → `/api/midi-to-tab/...` (308 so POST survives for cached clients)
- `/login?next=/notemapper` link inside the page

## 4. Code identifiers → rename
- `src/lib/notemapper-usage.ts` → `midi-to-tab-usage.ts`, `NotemapperUsageRow` → `MidiToTabUsageRow`
- `window.__NOTEMAPPER_STATE__`, `notemapperState`, console.error strings, code comments

## 5. Third-party / infra keys → DO NOT CHANGE (flag in report)
- Env var `MAILERLITE_GROUP_ID_NOTEMAPPER` (`.env.example`, `src/env.d.ts`, `capture-email.ts`)
- MailerLite group named "MidiNoteMapper WebApp" (comment in `.env.example`; group name lives in MailerLite)
- HubSpot custom property `notemapper_lead_source` (`src/lib/hubspot.ts`)
- HubSpot lead-source *value* `'NoteMapper'` (`capture-email.ts`) — left as-is so existing reporting/segments keep matching
- Supabase tables `notemapper_usage`, `notemapper_saves`, storage bucket `notemapper-saves`, RLS policy names (`supabase/schema.sql`)
- Anonymous-visitor cookie `nm_uid` (`middleware.ts`)
