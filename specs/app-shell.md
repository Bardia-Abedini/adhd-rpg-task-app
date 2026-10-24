# Spec: App shell and navigation

## Goal

The app runs, has every v1 page reachable on any screen size from phone to desktop, and uses the RPG theme everywhere — with placeholder content only.

## User story

As a student with ADHD, I want to open the app on my phone or computer and reach any screen in one or two taps, so I never get lost before I've even started a task.

## Screens

All pages show a title and placeholder text saying what will go there.

- Dashboard: will show Active Quests (open quests that are started or pinned, ordered by priority) and character level/XP — the screen the app opens on
- Quests: will show every other open quest and a button to add a quest
- Focus: full-screen focus mode for one step; opened by tapping a step, not from the tab bar. Shows only the timer and the task info
- Character: level, XP, gold; links to History
- History: past focus sessions and stats
- Inventory: the reward shop (buy rewards with gold) and purchased items

## Navigation

- Bottom tab bar with 4 tabs: Dashboard, Quests, Inventory, Character
- History opens from the Character page and has a back button
- Focus mode hides everything else, including the tab bar, with only an exit button
- Uses React Router; every page has its own URL so the browser back button works
- The active tab is clearly highlighted

## Look

- Theme tokens for colours and fonts: background, surface, text, muted text, primary, accent, XP, gold
- Style: clean fantasy
- Dark theme only for v1
- Fonts: Cinzel for headings, Atkinson Hyperlegible for body text, loaded from Google Fonts
- Styles written mobile-first, working from 360px wide up to desktop
- Tap targets at least 44px

## Acceptance criteria

- [ ] `npm run dev` starts with no errors or warnings in the terminal or browser console
- [ ] `npm test` and `npm run build` both pass
- [ ] The app opens on Dashboard
- [ ] On a 360px-wide screen, all 4 tabs are visible and each opens its page in one tap
- [ ] Every page also works on a desktop-width screen
- [ ] History opens from Character, and back returns to Character
- [ ] Opening Focus hides the tab bar; exiting brings it back
- [ ] Refreshing on any page stays on that page
- [ ] No hard-coded colours outside the theme token file
- [ ] TypeScript strict mode is on, with no `any` types and no `@ts-ignore`

## Out of scope

- Any quest, XP, shop or timer logic
- Saving data
- Animations and sounds
- Light theme
