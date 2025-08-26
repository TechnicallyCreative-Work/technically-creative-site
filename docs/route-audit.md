# Technically Creative — Route Audit (Keep / Hide / Archive)

**Goal:** ship a lean, testable site this week.  
**Definitions**
- **Keep** = public, in nav, indexed.
- **Hide** = still buildable but *unlisted* (remove from nav) and `noindex`.
- **Archive** = moved out of `src/pages` so it doesn’t build (easy rollback).

---

## A. Top-level pages
- [ ] `/` (index.astro) — **Keep**
- [ ] `/about` — **Keep**
- [ ] `/services` — **Keep**
- [ ] `/contact` — **Keep**
- [ ] `/blog` — **Hide**
- [ ] `/404` — **Keep
- [ ] `/home/personal` — **Keep**

**

## B. Blog posts (if any)
> If not launching the blog yet, mark **Archive** and we’ll move posts out of build.

- [ ] `/blog/<post-1>` — **Hide**
- [ ] `/blog/<post-2>` — **Hide**

## C. Extra/demo pages (template leftovers)
- [ ] `/pricing` — **Hide**
- [ ] `/portfolio` — **Keep**
- [ ] `/faq` — **Keep**
- [ ] `/demo/*` — **Archive**
- [ ] any others: __________________ — **Keep | Hide | Archive**

---

## Actions

### If **Keep**
- Add to nav in `src/config.yaml`:
  ```yaml
  ui:
    nav:
      items:
        - label: "About"
          href: "/about"
        - label: "Services"
          href: "/services"
        - label: "Contact"
          href: "/contact"
