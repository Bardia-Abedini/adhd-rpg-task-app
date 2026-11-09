# Tasks

Spec: specs/quests.md. One task = one commit. Do them in order.

- [x] 1. Reward maths in `src/lib/xp.ts`, with unit tests
  - Base reward per difficulty; each step's share (60% split evenly, rounded down); the bonus (40% plus the rounding remainder, paid when the last step is ticked); XP and gold earned by a quest from its ticked steps; level from total XP (starts at 1; level n needs 50 × n²)
  - Quest and Step types in `src/lib/types.ts`, matching architecture.md
  - check: `npm test` passes, with tests for the split, rounding, bonus, undo (unticking lowers the total, never below 0) and level formula; a D quest with 1, 3 and 7 steps all total exactly 20 XP and 10 gold

- [x] 2. Quest store: create, Start, Pause and sorting (in memory, no saving)
  - New dependency: zustand
  - Create: only title required; defaults priority medium, difficulty D, time guess 25 min, no due date; no steps → one step named after the quest; goes to the Backlog
  - Start blocks a 4th active quest with a message; Pause keeps progress; Active sorted by priority, then due date (none last), then creation date
  - check: `npm test` passes, with store tests for each rule above

- [x] 3. Quest store: ticking and unticking steps
  - Ticking the last step makes the quest done and frees its Active slot
  - Unticking returns a done quest to Active, or to the Backlog with a message if 3 are already active
  - Character XP, gold and level come from `xp.ts`, never stored
  - check: `npm test` passes; a store test ticks every step of a D quest (20 XP, 10 gold), unticks one (values drop by the right amount, quest back in Active) and covers the "3 already active" case

- [x] 4. New quest page (`/quests/new`)
  - Title, priority, difficulty, time guess, due date and steps (add as many as you like); saving goes to the Quests page
  - check: create a quest with only a title and it appears in the Backlog with one step named after it; test passes

- [x] 5. Quests page: Backlog list, "New quest" button, Start
  - Each backlog quest shows its title and a Start button; starting a 4th shows the blocking message
  - Keep the placeholder step that opens Focus until the focus spec
  - check: start 3 quests, then a 4th shows the message; tests pass

- [x] 6. Dashboard: Active Quests, level, XP bar and gold
  - Active Quests in sorted order, each with Pause and a link to its detail; level, XP bar (progress to the next level) and gold
  - check: start quests with different priorities and due dates and they show in the right order; Pause moves one back to the Backlog; tests pass

- [x] 7. Quest detail (`/quests/:id`): tick and untick steps
  - Steps with checkboxes; ticking updates XP and gold on the spot; ticking the last step finishes the quest
  - check: Dashboard → tap a quest → tick a step (2 taps from opening the app); tick all steps of a D quest for exactly 20 XP and 10 gold; untick one and the quest is back in Active with the right totals; tests pass

- [ ] 8. Quest detail: add, rename, reorder and delete steps
  - Reorder with up and down buttons (no drag-and-drop dependency); the last step can't be deleted, so a quest always has one
  - check: each action works on the page; tests pass

- [ ] 9. Feedback: XP bar animation, sounds, "Quest complete" and level-up popup
  - XP bar fills and gold updates on tick; a short Web Audio tone per step and a bigger one for finishing a quest; "Quest complete" message; level-up popup with the new level (none when undo lowers the level)
  - check: in the browser, ticking a step fills the bar and plays a tone within 1 second; finishing a quest shows the message; crossing 200 XP shows the level-up popup; tests for the message and popup pass

- [ ] 10. Mute toggle and reduced motion
  - Speaker toggle in the tab bar mutes all sounds; with the operating system's reduced motion on, the XP bar and popup don't animate
  - check: with mute on, ticking a step plays nothing; with reduced motion on (dev tools → Rendering → "prefers-reduced-motion: reduce"), the bar jumps instead of filling; tests pass

- [ ] 11. Acceptance pass: run every acceptance check in specs/quests.md and fix anything left
  - check: `npm test`, `npm run build` and `npm run format:check` pass; no hard-coded colours, `any` or `@ts-ignore` in `src/`; every criterion below is ticked

## Acceptance criteria → tasks

| Criterion (specs/quests.md)                                     | Task     |
| --------------------------------------------------------------- | -------- |
| A quest can be created with only a title and is in the Backlog  | 2, 4     |
| A quest created with no steps has one step with its title       | 2, 4     |
| Starting a 4th active quest is blocked with a clear message     | 2, 5     |
| Active Quests sorted by priority, then due date, then creation  | 2, 6     |
| Ticking every step of a D quest gives exactly 20 XP and 10 gold | 1, 3, 7  |
| Unticking after the bonus returns the right values and Active   | 1, 3, 7  |
| Level updates immediately at a threshold, and the popup shows   | 1, 9     |
| Feedback within 1 second of ticking a step                      | 9, 11    |
| Mute and reduced motion are respected                           | 10       |
| Unit tests cover split, rounding, bonus, undo and level         | 1        |
| Starting a quest from opening the app takes at most 2 taps      | 5, 7, 11 |
