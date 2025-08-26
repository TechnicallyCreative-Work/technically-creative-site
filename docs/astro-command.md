# Astro Commands Cheat Sheet

A quick reference for building, testing, and shipping Astro projects.

---

## Development

- **Start dev server**
  ```bash
  npm run dev
  ```
  Runs the project locally with hot reloading at [http://localhost:4321](http://localhost:4321).

- **Preview built site**
  ```bash
  npm run preview
  ```
  Runs a local server of the final `dist/` build. Good for testing production behavior.

---

## Building

- **Build the site**
  ```bash
  npm run build
  ```
  Creates static output in the `dist/` folder.

- **Direct CLI build**
  ```bash
  astro build
  ```
  Same as above, but runs directly with the Astro CLI (if installed globally).

---

## Linting & Formatting

*(Only if you’ve set these up in `package.json`)*

- **Lint**
  ```bash
  npm run lint
  ```

- **Format**
  ```bash
  npm run format
  ```

---

## Type & Content Checks

- **Type check (TS projects)**
  ```bash
  astro check
  ```

- **Sync content collections**
  ```bash
  astro sync
  ```
  Updates `src/content/config.ts` when you add new content folders.

---

## Integrations

- **Add official integration**
  ```bash
  astro add <integration>
  ```
  Example:  
  ```bash
  astro add tailwind
  astro add react
  ```

---

## Pro Tips

- Always run `npm run preview` before deploying to catch path or image errors.  
- `astro check` is your safety net if you’re mixing in TypeScript.  
- Keep this doc in sync with your `package.json` so future you (and teammates) don’t get lost.

---
