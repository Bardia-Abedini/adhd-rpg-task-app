import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import AppRoutes from "../AppRoutes";
import { backlogQuests } from "../lib/quests";
import { useQuestStore } from "../store/quests";

function renderDashboard() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const store = () => useQuestStore.getState();

beforeEach(() => {
  useQuestStore.setState({ quests: [] });
});

describe("dashboard", () => {
  it("says so when there are no active quests", () => {
    renderDashboard();
    expect(screen.getByText(/No active quests/)).toBeInTheDocument();
  });

  it("shows Active Quests by priority, then due date, then creation", () => {
    store().startQuest(store().addQuest({ title: "Low", priority: "low" }).id);
    store().startQuest(store().addQuest({ title: "Medium later", dueDate: "2026-12-20" }).id);
    store().startQuest(store().addQuest({ title: "Medium soon", dueDate: "2026-12-01" }).id);
    renderDashboard();

    const titles = within(screen.getByRole("list", { name: "Active Quests" }))
      .getAllByRole("link")
      .map(link => link.firstChild?.textContent);
    expect(titles).toEqual(["Medium soon", "Medium later", "Low"]);
  });

  it("Pause moves a quest back to the Backlog", async () => {
    store().startQuest(store().addQuest({ title: "Essay" }).id);
    renderDashboard();
    await userEvent.click(screen.getByRole("button", { name: "Pause Essay" }));
    expect(screen.getByText(/No active quests/)).toBeInTheDocument();
    expect(backlogQuests(store().quests)).toHaveLength(1);
  });

  it("shows level, XP and gold from ticked steps", () => {
    const quest = store().addQuest({ title: "Essay", steps: ["1", "2", "3"] });
    store().startQuest(quest.id);
    store().toggleStep(quest.id, quest.steps[0].id);
    renderDashboard();

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("2 gold")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "XP to next level" })).toHaveAttribute("aria-valuenow", "4");
    expect(screen.getByText("4 / 200 XP")).toBeInTheDocument();
  });
});
