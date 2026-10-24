# ADHD Quest RPG

## Pitch

An RPG that replaces the real life tasks with in game quests. It breaks tasks that are hard to start into tiny steps and rewards the user instantly, so starting these tasks gets easier and feels like playing a game instead of a chore

## Target user

- Primary: Students with ADHD who have assignments but can't make themselves start
- Also: Adults with ADHD who already tried every to-do app but it didn't work for them

## Core problems

- A big task feels impossible to start, so I do nothing instead
- I get pulled away and forget what I was in the middle of
- I think something is going to take 10 minutes, but it takes 2 hours, or the reverse
- Rewards are too far away
- Todo apps feel like a list of my failures, so I keep stacking new tasks but the old ones never get done

## Core loop

- Add a task -> user can break it into small steps -> the user taps the first one -> 25-minute focus timer -> step done, +XP and a sound -> pick the next step or stop
- Steps are optional: a quest with no steps can be started and finished directly

## Principles

- Starting a quest should only take 2 taps, because starting needs to be fast and easy
- Every first step should take less than 5 minutes, so starting a task feels easy
- Instant rewards, so user gets a quick dopamine boost
- Never punish a missed task. When a task becomes overdue, ask the user once whether it can still be done. If yes, it stays in the list; if no, it's archived

## v1 scope

- Web app only, with layouts designed for desktop browsers
- Quests with small steps
- Priority (high / medium / low): decides the order in the Active Quests list
- Difficulty (E to S): decides how much XP and gold the quest gives; half is paid across the steps as they're done, half as a bonus for finishing the quest
- XP, level, gold, reward shop
- Focus timer and history
- Active quests section so user doesn't forget which tasks they are supposed to be doing right now: only quests that are started or pinned, so it never turns into the full backlog
- If the app is closed mid-timer, reopening it brings the user back to what they were working on
- Data is saved locally in the browser
- While doing a task there should be no distractions, so everything else hides and only the timer and the task info is clearly visible
- When adding a task, user enters their guess for how long the task will take, and when the task is done, the actual time is shown to the user

## Not in v1

- Distraction alerts
- Accounts for syncing data between devices
- AI breakdown and sorting tasks
- Friends, parties, leaderboards
- Native mobile app
- Calendar sync

## Success

- I use it for 5 days a week for 2 weeks straight
- 3 beta testers with ADHD use it for a week, and at least 2 keep using it after
- I finish my untouched tasks that have been sitting in my todo list for a long time
