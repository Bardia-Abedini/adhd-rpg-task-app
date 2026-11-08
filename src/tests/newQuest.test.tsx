import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import AppRoutes from "../AppRoutes";
import { backlogQuests } from "../lib/quests";
import { useQuestStore } from "../store/quests";

function renderNewQuest() {
  render(
    <MemoryRouter initialEntries={["/quests/new"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const quests = () => useQuestStore.getState().quests;

beforeEach(() => {
  useQuestStore.setState({ quests: [] });
});

describe("new quest page", () => {
  it("saves a quest with only a title, with the defaults, into the Backlog", async () => {
    renderNewQuest();
    await userEvent.type(screen.getByLabelText("Title"), "Write essay");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("heading", { name: "Quests" })).toBeInTheDocument();
    expect(backlogQuests(quests())).toHaveLength(1);
    expect(quests()[0]).toMatchObject({
      title: "Write essay",
      priority: "medium",
      difficulty: "D",
      estimateMin: 25,
      dueDate: undefined,
    });
    expect(quests()[0].steps.map(step => step.title)).toEqual(["Write essay"]);
  });

  it("refuses a title of only spaces", async () => {
    renderNewQuest();
    await userEvent.type(screen.getByLabelText("Title"), "   ");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Give your quest a title");
    expect(quests()).toEqual([]);
  });

  it("saves every field that was filled in", async () => {
    renderNewQuest();
    await userEvent.type(screen.getByLabelText("Title"), "Essay");
    await userEvent.selectOptions(screen.getByLabelText("Priority"), "high");
    await userEvent.selectOptions(screen.getByLabelText("Difficulty"), "B");
    await userEvent.clear(screen.getByLabelText("Time guess (min)"));
    await userEvent.type(screen.getByLabelText("Time guess (min)"), "90");
    await userEvent.type(screen.getByLabelText("Due date"), "2026-12-01");
    await userEvent.type(screen.getByLabelText("Steps (one per line)"), "Open doc{enter}Write intro");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(quests()[0]).toMatchObject({
      title: "Essay",
      priority: "high",
      difficulty: "B",
      estimateMin: 90,
      dueDate: "2026-12-01",
    });
    expect(quests()[0].steps.map(step => step.title)).toEqual(["Open doc", "Write intro"]);
  });
});
