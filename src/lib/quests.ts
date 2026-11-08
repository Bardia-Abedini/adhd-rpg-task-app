import type { Priority, Quest } from "./types";

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// Priority, then due date (none last), then oldest first. ISO dates sort as strings.
function compareActive(a: Quest, b: Quest): number {
  return (
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
    (a.dueDate ?? "￿").localeCompare(b.dueDate ?? "￿") ||
    a.createdAt.localeCompare(b.createdAt)
  );
}

export function activeQuests(quests: Quest[]): Quest[] {
  return quests.filter(quest => quest.status === "open" && quest.active).sort(compareActive);
}

export function backlogQuests(quests: Quest[]): Quest[] {
  return quests.filter(quest => quest.status === "open" && !quest.active);
}
