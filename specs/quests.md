# Spec: Quests and rewards

## Goal

Users can create quests with steps, move up to 3 into Active, complete steps, and get XP, gold and level-ups with instant feedback. No saving yet.

## User story

As a student with ADHD, I want to turn a scary task into tiny steps and get rewarded the moment I finish each one, so starting feels like playing instead of forcing myself.

## Screens

- Quests page: Backlog list + "New quest" button
- New quest page (`/quests/new`): title, priority, difficulty, time guess, due date, steps
- Dashboard: Active Quests (max 3) and the character's level, XP bar and gold
- Quest detail (`/quests/:id`): the quest's steps with checkboxes

## Creating a quest

- Only the title is required
- Defaults: priority medium, difficulty D, time guess 25 min, no due date
- Steps are optional; a quest saved with no steps gets one step named after the quest
- Steps can be added, renamed, reordered and deleted later from Quest detail
- New quests go to the Backlog

## Backlog and Active

- "Start" on a backlog quest moves it to Active
- At most 3 active quests; trying to add a 4th shows a message and asks the user to finish or pause one
- "Pause" moves an active quest back to the Backlog with its progress kept
- Active Quests are sorted by priority, then due date, then creation date
- Ticking the last step makes the quest done and frees its Active slot
- Starting a quest from opening the app takes at most 2 taps

## Rewards

- Each difficulty has a base reward:
  E 10 XP / 5 gold, D 20/10, C 35/15, B 50/25, A 75/35, S 100/50
- 60% of the base is split evenly across the quest's steps; 40% is a bonus paid when the last step is done
- Level is calculated from total XP, never stored:
  a new character is level 1; level n (2 and up) needs 50 × n² total XP
- All reward maths lives in src/lib/xp.ts

## Undo

- Unticking a step takes back that step's XP and gold
- If the quest bonus was paid, unticking any step also takes back the bonus and the quest returns to Active (or to the Backlog with a message if 3 are already active)
- XP and gold never go below 0; losing a level by undo is allowed and shows no popup

## Feedback

- Within 1 second of ticking a step: XP bar fills, gold number updates, a short sound plays
- Finishing a quest: bigger sound and a "Quest complete" message
- Level-up: a popup with the new level
- Sounds are short tones made with the browser's Web Audio, so no sound files
- A speaker toggle in the tab bar mutes sounds; reduced motion follows the operating system setting
- With sound muted, no sounds; with reduced motion on, no bar animation or popup motion

## Acceptance criteria

- [ ] A quest can be created with only a title, and appears in the Backlog
- [ ] A quest created with no steps has exactly one step with the quest's title
- [ ] Starting a 4th active quest is blocked with a clear message
- [ ] Active Quests are sorted by priority, then due date, then creation date
- [ ] Ticking every step of a D quest gives exactly 20 XP and 10 gold in total
- [ ] Unticking a step after the bonus was paid returns XP and gold to the right values and the quest to Active
- [ ] Level updates immediately when XP crosses a threshold, and the popup shows
- [ ] Feedback appears within 1 second of ticking a step
- [ ] Mute and reduced motion are respected
- [ ] Unit tests cover the reward split, rounding, bonus, undo and level formula
- [ ] Starting a quest from opening the app takes at most 2 taps

## Out of scope

- Saving data (Block 2): everything resets on reload for now
- Focus timer and focus mode (Block 3)
- Shop and spending gold (Block 2)
- Due-date overdue handling (Reschedule/Archive) (Block 3)
