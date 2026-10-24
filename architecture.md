# Architecture

## Stack

- React + TypeScript (strict mode): React builds the UI from reusable components; TypeScript catches bugs before running and enforces the data model; strict mode makes sloppy agent-written types fail to compile
- Vite: fast dev server and simple setup, no server needed for v1
- Tailwind CSS: styles live next to the markup, and theme tokens keep the RPG look consistent
- shadcn/ui for interactive primitives: accessible dialogs, tabs and dropdowns that live in our repo, so they can be restyled freely
- React Router for pages: every page has its own URL, so refresh and the browser back button work
- Zustand for app state: tiny, less boilerplate than Redux, and works with async storage
- Vitest + React Testing Library for tests: Vitest reuses Vite's config and is fast; Testing Library tests components the way a user uses them

## UI rules

- All colours and fonts come from theme tokens; no hard-coded colours in components
- Game-specific components (XP bar, quest card, character sheet) are hand-built in src/components/game/
- Components stay small: one job each, split anything over ~150 lines
- Responsive: every screen works from phone width (360px) up to desktop. Write Tailwind classes mobile-first (base styles for phones, `md:`/`lg:` for bigger screens) and keep tap targets at least 44px

## Storage

- v1 saves everything in the browser using IndexedDB, via idb-keyval
- The app shows a loading state until saved data has loaded
- Only src/lib/storage.ts reads or writes storage; nothing else touches it directly
- Saved data has a version number so old saves can be upgraded, not broken
- v1 storage is temporary and gets replaced by cloud storage when accounts arrive. Known limits we accept for now: Safari can wipe data after 7 days without a visit, and two open tabs can overwrite each other

## Data model

```ts
type Priority = "high" | "medium" | "low"; // sets order in Active Quests
type Difficulty = "E" | "D" | "C" | "B" | "A" | "S"; // sets XP and gold reward

interface Quest {
    id: string;
    title: string;
    priority: Priority;
    difficulty: Difficulty;
    estimateMin: number; // the user's time guess for the whole task
    dueDate?: string; // ISO date
    overdueConfirmed?: boolean; // true = user said it's still doable after the due date
    pinned?: boolean; // true = show in Active Quests even before it's started
    steps: Step[]; // array order is step order; can be empty
    status: "open" | "done" | "archived";
    createdAt: string;
    completedAt?: string;
}

interface Step {
    id: string;
    title: string;
    done: boolean;
}

interface FocusSession {
    id: string;
    questId: string;
    stepId?: string; // empty when the quest has no steps
    plannedMin: number; // timer length, 25 by default
    startedAt: string;
    endedAt?: string; // empty while the session is running
    endReason?: "completed" | "stopped" | "recovered";
}
// A quest's actual time = total of its focus sessions (computed, not stored)

interface Character {
    xp: number; // total XP ever earned; level is computed from this in xp.ts
    gold: number;
}

interface ShopItem {
    id: string;
    name: string;
    cost: number;
    kind: "avatar" | "real-reward";
}

interface Purchase {
    id: string;
    itemId: string;
    boughtAt: string;
    used?: boolean; // for real-world rewards like "30 min gaming"
}
```

## Rewards

- Each difficulty has a total XP and gold reward; the numbers and the level curve live in specs/rewards.md
- Half the reward is split evenly across the steps and paid as each step is done; the other half is a bonus paid when the quest is finished
- Each step's share is rounded down and the remainder goes into the bonus, so a quest always pays exactly its total
- A quest with no steps pays the whole reward when it's finished

## Active Quests

- Active Quests shows open quests that are started (at least one step done or one focus session) or pinned
- Every other open quest lives in the main quest list
- A quest with no steps can be started directly and has a "Finish quest" action

## Focus sessions

- Remaining time is always computed as startedAt + plannedMin - now; the UI only re-renders, it never counts ticks, so background tabs can't make it drift
- A session is saved as soon as it starts, so closing the tab leaves an unfinished session behind
- Only one unfinished session can exist at a time
- When the app loads and finds an unfinished session:
    - Time left: go straight back to focus mode with the remaining time and show "Welcome back, you were on [quest]: [step]"
    - Time ran out while away: close it with endedAt = startedAt + plannedMin and endReason "recovered" (so time away isn't counted), then ask "You were working on [step]. Did you finish it?" with Done (tick the step and pay its XP), Keep going (start a new session) or Not now (back to the dashboard)
- Starting a new session while one is unfinished shows the same prompt first
- A session's time is endedAt - startedAt; an unfinished one counts up to now, capped at plannedMin
- No pause in v1 (it would need a pausedMs field later)

## Folder structure

```
src/
  components/
    ui/        # shadcn components
    game/      # XP bar, quest card, character sheet
  pages/       # Dashboard, Quests, Character, Inventory, Focus, History
  store/       # Zustand stores
  lib/
    storage.ts # the only file that touches browser storage
    xp.ts      # XP and level formulas (must have tests)
    focus.ts   # timer maths and unfinished-session recovery, as plain functions that take `now`
  tests/
specs/         # one spec per feature, written before building it
```

## Testing

- Must always have tests: XP and level formulas, gold and shop logic, saving and loading
- Also test the timer maths and session recovery in focus.ts

## Deploy

- Vercel, deployed from the CLI

## v2 notes (not built yet)

- Accounts: Supabase; storage.ts gets swapped to talk to the database
- AI: LLM API called only from a Vercel serverless function, never from browser code
- Desktop and mobile: wrap the same web app instead of rewriting it (Capacitor for mobile, Tauri or Electron for desktop). To keep that possible, game logic stays in plain TypeScript in lib/ with no React or browser APIs
