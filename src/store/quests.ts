import { create } from "zustand";
import type { Difficulty, Priority, Quest } from "../lib/types";

export const MAX_ACTIVE = 3;
export const TOO_MANY_ACTIVE = "You already have 3 active quests. Finish or pause one first.";

interface NewQuest {
  title: string;
  priority?: Priority;
  difficulty?: Difficulty;
  estimateMin?: number;
  dueDate?: string;
  steps?: string[];
}

interface QuestStore {
  quests: Quest[];
  addQuest: (input: NewQuest) => Quest;
  startQuest: (id: string) => string | undefined;
  pauseQuest: (id: string) => void;
}

function setActive(quests: Quest[], id: string, active: boolean): Quest[] {
  return quests.map(quest => (quest.id === id ? { ...quest, active } : quest));
}

// shortcut: in memory only, resets on reload; saving comes in Block 2
export const useQuestStore = create<QuestStore>()((set, get) => ({
  quests: [],

  addQuest: input => {
    const title = input.title.trim();
    if (!title) throw new Error("A quest needs a title");
    const stepTitles = (input.steps ?? []).map(step => step.trim()).filter(Boolean);
    const quest: Quest = {
      id: crypto.randomUUID(),
      title,
      priority: input.priority ?? "medium",
      difficulty: input.difficulty ?? "D",
      estimateMin: input.estimateMin ?? 25,
      dueDate: input.dueDate,
      active: false,
      steps: (stepTitles.length ? stepTitles : [title]).map(stepTitle => ({
        id: crypto.randomUUID(),
        title: stepTitle,
        done: false,
      })),
      status: "open",
      createdAt: new Date().toISOString(),
    };
    set(state => ({ quests: [...state.quests, quest] }));
    return quest;
  },

  startQuest: id => {
    const activeCount = get().quests.filter(quest => quest.status === "open" && quest.active).length;
    if (activeCount >= MAX_ACTIVE) return TOO_MANY_ACTIVE;
    set(state => ({ quests: setActive(state.quests, id, true) }));
  },

  pauseQuest: id => set(state => ({ quests: setActive(state.quests, id, false) })),
}));
