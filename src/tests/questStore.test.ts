import { beforeEach, describe, expect, it } from "vitest";
import { activeQuests, backlogQuests } from "../lib/quests";
import type { Quest } from "../lib/types";
import { characterStats } from "../lib/xp";
import { REOPENED_TO_BACKLOG, TOO_MANY_ACTIVE, useQuestStore } from "../store/quests";

const store = () => useQuestStore.getState();

beforeEach(() => {
  useQuestStore.setState({ quests: [] });
});

describe("addQuest", () => {
  it("creates a quest from only a title, with the defaults, in the Backlog", () => {
    const quest = store().addQuest({ title: "  Write essay  " });
    expect(quest).toMatchObject({
      title: "Write essay",
      priority: "medium",
      difficulty: "D",
      estimateMin: 25,
      dueDate: undefined,
      active: false,
      status: "open",
    });
    expect(backlogQuests(store().quests)).toEqual([quest]);
  });

  it("gives a quest with no steps one step named after the quest", () => {
    const quest = store().addQuest({ title: "Write essay", steps: ["", "  "] });
    expect(quest.steps.map(step => step.title)).toEqual(["Write essay"]);
  });

  it("keeps the given steps in order", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["Open doc", " Write intro "] });
    expect(quest.steps.map(step => step.title)).toEqual(["Open doc", "Write intro"]);
  });

  it("refuses a blank title", () => {
    expect(() => store().addQuest({ title: "   " })).toThrow();
    expect(store().quests).toEqual([]);
  });
});

describe("startQuest and pauseQuest", () => {
  it("allows 3 active quests and blocks a 4th with a message", () => {
    const ids = ["A", "B", "C", "D"].map(title => store().addQuest({ title }).id);
    expect(ids.slice(0, 3).map(id => store().startQuest(id))).toEqual([undefined, undefined, undefined]);
    expect(store().startQuest(ids[3])).toBe(TOO_MANY_ACTIVE);
    expect(activeQuests(store().quests)).toHaveLength(3);
    expect(backlogQuests(store().quests).map(quest => quest.id)).toEqual([ids[3]]);
  });

  it("moves a paused quest back to the Backlog with its progress kept", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["One", "Two"] });
    store().startQuest(quest.id);
    useQuestStore.setState(state => ({
      quests: state.quests.map(q => ({ ...q, steps: q.steps.map((s, i) => ({ ...s, done: i === 0 })) })),
    }));
    store().pauseQuest(quest.id);
    const paused = backlogQuests(store().quests)[0];
    expect(paused.steps.map(step => step.done)).toEqual([true, false]);
  });
});

describe("activeQuests", () => {
  const make = (id: string, fields: Partial<Quest>): Quest => ({
    id,
    title: id,
    priority: "medium",
    difficulty: "D",
    estimateMin: 25,
    active: true,
    steps: [],
    status: "open",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...fields,
  });

  it("sorts by priority, then due date (none last), then creation date", () => {
    const quests = [
      make("low", { priority: "low" }),
      make("medium-no-due", {}),
      make("medium-due-later", { dueDate: "2026-03-01" }),
      make("medium-due-soon", { dueDate: "2026-02-01" }),
      make("high-newer", { priority: "high", createdAt: "2026-01-02T00:00:00.000Z" }),
      make("high-older", { priority: "high" }),
      make("done", { status: "done" }),
      make("paused", { active: false }),
    ];
    expect(activeQuests(quests).map(quest => quest.id)).toEqual([
      "high-older",
      "high-newer",
      "medium-due-soon",
      "medium-due-later",
      "medium-no-due",
      "low",
    ]);
  });
});

describe("toggleStep", () => {
  const tickAll = (id: string) => {
    for (const step of store().quests.find(q => q.id === id)!.steps) store().toggleStep(id, step.id);
  };
  const find = (id: string) => store().quests.find(q => q.id === id)!;

  it("finishes a quest on the last tick, pays exactly 20 XP and 10 gold for D, and frees its slot", () => {
    const ids = ["A", "B", "C"].map(title => store().addQuest({ title, steps: ["1", "2", "3"] }).id);
    ids.forEach(id => store().startQuest(id));
    tickAll(ids[0]);

    expect(find(ids[0])).toMatchObject({ status: "done", active: false });
    expect(find(ids[0]).completedAt).toBeDefined();
    expect(characterStats(store().quests)).toMatchObject({ xp: 20, gold: 10 });
    expect(store().startQuest(store().addQuest({ title: "D" }).id)).toBeUndefined();
  });

  it("unticking after the bonus takes it back and returns the quest to Active", () => {
    const id = store().addQuest({ title: "Essay", steps: ["1", "2", "3"] }).id;
    store().startQuest(id);
    tickAll(id);
    expect(store().toggleStep(id, find(id).steps[0].id)).toBeUndefined();

    expect(find(id)).toMatchObject({ status: "open", active: true, completedAt: undefined });
    expect(characterStats(store().quests)).toMatchObject({ xp: 8, gold: 4 });
  });

  it("sends a reopened quest to the Backlog with a message when 3 are already active", () => {
    const id = store().addQuest({ title: "Essay" }).id;
    tickAll(id);
    ["A", "B", "C"].forEach(title => store().startQuest(store().addQuest({ title }).id));

    expect(store().toggleStep(id, find(id).steps[0].id)).toBe(REOPENED_TO_BACKLOG);
    expect(find(id)).toMatchObject({ status: "open", active: false });
    expect(backlogQuests(store().quests).map(q => q.id)).toEqual([id]);
  });
});

describe("editing steps", () => {
  const find = (id: string) => store().quests.find(q => q.id === id)!;
  const titles = (id: string) => find(id).steps.map(step => step.title);

  it("adds a step at the end and ignores a blank one", () => {
    const id = store().addQuest({ title: "Essay", steps: ["One"] }).id;
    store().addStep(id, " Two ");
    store().addStep(id, "   ");
    expect(titles(id)).toEqual(["One", "Two"]);
  });

  it("renames a step and keeps the old name when the new one is blank", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["One"] });
    store().renameStep(quest.id, quest.steps[0].id, " First ");
    store().renameStep(quest.id, quest.steps[0].id, "  ");
    expect(titles(quest.id)).toEqual(["First"]);
  });

  it("moves steps up and down, and does nothing past either end", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["A", "B", "C"] });
    const [a, , c] = quest.steps;
    store().moveStep(quest.id, c.id, -1);
    expect(titles(quest.id)).toEqual(["A", "C", "B"]);
    store().moveStep(quest.id, a.id, -1);
    store().moveStep(quest.id, c.id, 1);
    store().moveStep(quest.id, c.id, 1);
    expect(titles(quest.id)).toEqual(["A", "B", "C"]);
  });

  it("deletes a step but never the last one", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["A", "B"] });
    store().deleteStep(quest.id, quest.steps[0].id);
    store().deleteStep(quest.id, quest.steps[1].id);
    expect(titles(quest.id)).toEqual(["B"]);
  });

  it("reopens a finished quest when a step is added", () => {
    const quest = store().addQuest({ title: "Essay" });
    store().startQuest(quest.id);
    store().toggleStep(quest.id, quest.steps[0].id);
    expect(find(quest.id).status).toBe("done");
    store().addStep(quest.id, "One more");
    expect(find(quest.id)).toMatchObject({ status: "open", active: true });
  });

  it("finishes a quest when its only unticked step is deleted", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["A", "B"] });
    store().toggleStep(quest.id, quest.steps[0].id);
    store().deleteStep(quest.id, quest.steps[1].id);
    expect(find(quest.id).status).toBe("done");
  });
});
