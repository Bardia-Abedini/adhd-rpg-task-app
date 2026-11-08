import type { Difficulty, Quest } from "./types";

export const REWARDS: Record<Difficulty, { xp: number; gold: number }> = {
  E: { xp: 10, gold: 5 },
  D: { xp: 20, gold: 10 },
  C: { xp: 35, gold: 15 },
  B: { xp: 50, gold: 25 },
  A: { xp: 75, gold: 35 },
  S: { xp: 100, gold: 50 },
};

// 60% split across steps (rounded down), the rest is the bonus for ticking the last step
function earned(base: number, stepCount: number, doneCount: number): number {
  // Integer maths so floating-point error in 0.6 can never round a step down
  const share = Math.floor((base * 3) / (5 * stepCount));
  const bonus = base - share * stepCount;
  return share * doneCount + (doneCount === stepCount ? bonus : 0);
}

// Computed from the ticked steps right now, so unticking takes rewards back automatically
export function questReward(quest: Pick<Quest, "difficulty" | "steps">): { xp: number; gold: number } {
  const base = REWARDS[quest.difficulty];
  const done = quest.steps.filter(step => step.done).length;
  return {
    xp: earned(base.xp, quest.steps.length, done),
    gold: earned(base.gold, quest.steps.length, done),
  };
}

// Level 1 at 0 XP; level n (2 and up) needs 50 × n²
export function levelFor(totalXp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(totalXp / 50)));
}
