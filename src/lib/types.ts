// Copied from architecture.md; keep the two in sync
export type Priority = "high" | "medium" | "low";
export type Difficulty = "E" | "D" | "C" | "B" | "A" | "S";

export interface Quest {
  id: string;
  title: string;
  priority: Priority;
  difficulty: Difficulty;
  estimateMin: number;
  dueDate?: string;
  overdueConfirmed?: boolean;
  active: boolean;
  steps: Step[];
  status: "open" | "done" | "archived";
  createdAt: string;
  completedAt?: string;
}

export interface Step {
  id: string;
  title: string;
  done: boolean;
}
