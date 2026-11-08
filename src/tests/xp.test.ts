import { describe, expect, it } from "vitest";
import { REWARDS, characterStats, levelFor, questReward } from "../lib/xp";
import type { Difficulty } from "../lib/types";

function quest(difficulty: Difficulty, stepCount: number, doneCount: number) {
  const steps = Array.from({ length: stepCount }, (_, i) => ({ id: `${i}`, title: `Step ${i}`, done: i < doneCount }));
  return { difficulty, steps };
}

describe("questReward", () => {
  it.each([1, 3, 7])("a fully ticked D quest with %i steps gives exactly 20 XP and 10 gold", steps => {
    expect(questReward(quest("D", steps, steps))).toEqual({ xp: 20, gold: 10 });
  });

  it.each(Object.keys(REWARDS) as Difficulty[])("a fully ticked %s quest gives exactly its base reward", difficulty => {
    expect(questReward(quest(difficulty, 4, 4))).toEqual(REWARDS[difficulty]);
  });

  it("rounds each step's share down and adds the remainder to the bonus", () => {
    // D, 7 steps: 12 XP / 7 = 1 per step, 6 gold / 7 = 0 per step
    expect(questReward(quest("D", 7, 6))).toEqual({ xp: 6, gold: 0 });
    expect(questReward(quest("D", 7, 7))).toEqual({ xp: 20, gold: 10 });
  });

  it("splits exactly 60% across steps, even when the maths isn't a round number", () => {
    // C: 60% of 35 XP is 21, so 7 per step; 60% of 15 gold is 9, so 3 per step
    expect(questReward(quest("C", 3, 2))).toEqual({ xp: 14, gold: 6 });
  });

  it("pays the bonus only when every step is ticked", () => {
    expect(questReward(quest("D", 3, 2))).toEqual({ xp: 8, gold: 4 });
    expect(questReward(quest("D", 3, 3))).toEqual({ xp: 20, gold: 10 });
  });

  it("takes back the step's share and the bonus when a step is unticked", () => {
    const finished = quest("D", 3, 3);
    finished.steps[0].done = false;
    expect(questReward(finished)).toEqual({ xp: 8, gold: 4 });
  });

  it("gives nothing when no steps are ticked", () => {
    expect(questReward(quest("S", 5, 0))).toEqual({ xp: 0, gold: 0 });
  });
});

describe("levelFor", () => {
  it.each([
    [0, 1],
    [199, 1],
    [200, 2],
    [449, 2],
    [450, 3],
  ])("%i XP is level %i", (xp, level) => {
    expect(levelFor(xp)).toBe(level);
  });
});

describe("characterStats", () => {
  it("adds up every quest's reward and works out the level", () => {
    // 2 finished S quests (200 XP, 100 gold) + 2 of 3 steps of a D quest (8 XP, 4 gold)
    expect(characterStats([quest("S", 2, 2), quest("S", 5, 5), quest("D", 3, 2)])).toEqual({
      xp: 208,
      gold: 104,
      level: 2,
    });
  });

  it("starts at 0 XP, 0 gold and level 1", () => {
    expect(characterStats([])).toEqual({ xp: 0, gold: 0, level: 1 });
  });
});
