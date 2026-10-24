# ADHD Quest RPG

An RPG-style task app that helps students with ADHD start and finish tasks. v1 runs entirely in the browser.

@product.md
@architecture.md

## Workflow

- Always plan before editing and wait for my approval
- Work on one task from tasks.md at a time; one task per commit
- New features start from a spec in specs/; if the spec is unclear, ask instead of guessing
- Stay inside v1 scope from product.md; suggest out-of-scope ideas, don't build them

## Code rules

- TypeScript strict mode; no `any`, no `@ts-ignore`
- Any change to XP, gold, shop or storage logic comes with tests, and all tests must pass before a commit
- Follow the UI rules in architecture.md: theme tokens only, no hard-coded colours
- Prefer small, readable code over clever code

## Never without asking

- Add or remove a dependency
- Change the saved data format (needs a version bump and a migration in storage.ts)
- Delete or rewrite working features outside the current task
- Touch files that I wrote by hand

## Communication

- After each change, list the files changed and explain why in plain English
- If you're unsure between two approaches, show both and let me pick
- Tell me when something in product.md or architecture.md seems wrong instead of working around it

## Commands

- `npm run dev`: start the dev server
- `npm test`: run tests (Vitest)
- `npm run build`: production build
