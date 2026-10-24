# Tasks

Spec: specs/app-shell.md. One task = one commit. Do them in order.

- [x] 1. Set up the project: Vite + React + TypeScript, strict mode on
  - New dependencies: vite, @vitejs/plugin-react, react, react-dom, typescript, @types/react, @types/react-dom
  - check: `npm run dev` opens the starter page with no errors or warnings in the terminal or browser console; `npm run build` passes; `tsconfig` has `"strict": true`

- [x] 2. Set up tests: Vitest + React Testing Library, with one test that the app renders
  - New dependencies: vitest, jsdom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
  - check: `npm test` passes and shows 1 passing test

- [x] 3. Theme: Tailwind, dark-only theme tokens and fonts
  - One token file for colours and fonts: background, surface, text, muted text, primary, accent, XP, gold. Tailwind's built-in colours turned off, so only tokens can be used
  - Cinzel for headings and Atkinson Hyperlegible for body, loaded from Google Fonts
  - New dependencies: tailwindcss, @tailwindcss/vite
  - check: the page has the dark background, headings show in Cinzel and body text in Atkinson Hyperlegible; searching `src/` for colour values (`#…`, `rgb(`, `hsl(`) finds them only in the token file

- [x] 4. Pages and routes: placeholder pages with their own URLs
  - Dashboard (`/`), Quests, Inventory, Character, History, Focus; each shows a title and placeholder text saying what will go there
  - `vercel.json` so every URL loads the app after deploy
  - New dependency: react-router
  - check: the app opens on Dashboard; typing each page's URL opens that page; refreshing on any page stays on it; tests for each route pass

- [x] 5. Bottom tab bar: Dashboard, Quests, Inventory, Character
  - Active tab clearly highlighted; tap targets at least 44px; styles mobile-first
  - check: in browser dev tools at 360px wide, all 4 tabs are visible and each opens its page in one tap; at desktop width every page still looks right; tests for tab clicks and the highlighted tab pass

- [ ] 6. History opens from Character, with a back button
  - check: Character → History → back returns to Character, using both the in-app back button and the browser back button; test passes

- [ ] 7. Focus mode: placeholder step opens a full-screen Focus page
  - Quests page shows one placeholder step; tapping it opens Focus with placeholder timer and task info, and an exit button
  - Focus hides everything else, including the tab bar
  - check: tapping the placeholder step hides the tab bar; exit brings it back and returns to the page you came from; test passes

- [ ] 8. Acceptance pass: run every acceptance check in specs/app-shell.md and fix anything left
  - check: `npm run dev` has no errors or warnings in the terminal or browser console; `npm test` and `npm run build` pass; searching `src/` for `any` types and `@ts-ignore` finds nothing; every criterion below is ticked

## Acceptance criteria → tasks

| Criterion (specs/app-shell.md)                  | Task    |
| ----------------------------------------------- | ------- |
| `npm run dev` starts with no errors or warnings | 1, 8    |
| `npm test` and `npm run build` pass             | 1, 2, 8 |
| App opens on Dashboard                          | 4       |
| 360px: all 4 tabs visible, one tap each         | 5       |
| Every page works at desktop width               | 5, 8    |
| History opens from Character, back returns      | 6       |
| Focus hides the tab bar, exit brings it back    | 7       |
| Refreshing stays on the page                    | 4       |
| No hard-coded colours outside the token file    | 3, 8    |
| Strict mode, no `any`, no `@ts-ignore`          | 1, 8    |
