# Architecture

## Stack

- React + TypeScript (strict mode): React builds the UI from reusable components and agents know it extremely well; TypeScript catches bugs before running and enforces the data model; strict mode makes sloppy agent-written types fail to compile
- Vite: fast dev server and simple setup, no server needed for v1
- Tailwind CSS: styles live next to the markup, and theme tokens keep the RPG look consistent
- shadcn/ui for interactive primitives: accessible dialogs, tabs and dropdowns that live in our repo, so they can be restyled freely
- Zustand for app state: tiny, less boilerplate than Redux, and works with async storage
- Vitest + React Testing Library for tests: Vitest reuses Vite's config and is fast; Testing Library tests components the way a user uses them

## UI rules

- All colours and fonts come from theme tokens; no hard-coded colours in components
- Game-specific components (XP bar, quest card, character sheet) are hand-built in src/components/game/
- Components stay small: one job each, split anything over ~150 lines

## Storage

- v1 saves everything in the browser using IndexedDB, via idb-keyval
- The app shows a loading state until saved data has loaded
- Only src/lib/storage.ts reads or writes storage; nothing else touches it directly
- Saved data has a version number so old saves can be upgraded, not broken

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
    steps: Step[];
    status: "active" | "done" | "archived";
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
    stepId: string;
    startedAt: string;
    endedAt?: string;
}
// A quest's actual time = total of its focus sessions (computed, not stored)

interface Character {
    level: number;
    xp: number;
    gold: number;
}

interface ShopItem {
    id: string;
    name: string;
    cost: number;
    kind: "avatar" | "real-reward";
}
```

## Folder structure

```
src/
  components/
    ui/        # shadcn components
    game/      # XP bar, quest card, character sheet
  pages/       # Dashboard, Quests, Character, Inventory
  store/       # Zustand stores
  lib/
    storage.ts # the only file that touches browser storage
    xp.ts      # XP and level formulas (must have tests)
  tests/
```

## Testing

- Must always have tests: XP and level formulas, gold and shop logic, saving and loading

## Deploy

- Vercel, deployed from the CLI

## v2 notes (not built yet)

- Accounts: Supabase; storage.ts gets swapped to talk to the database
- AI: LLM API called only from a Vercel serverless function, never from browser code
