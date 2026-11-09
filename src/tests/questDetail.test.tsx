import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppRoutes from "../AppRoutes";
import { activeQuests } from "../lib/quests";
import { playSound } from "../sound";
import { REOPENED_TO_BACKLOG, useQuestStore } from "../store/quests";

vi.mock("../sound", () => ({ playSound: vi.fn() }));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const store = () => useQuestStore.getState();

function startEssay() {
  const quest = store().addQuest({ title: "Essay", steps: ["Open doc", "Write intro", "Write ending"] });
  store().startQuest(quest.id);
  return quest;
}

beforeEach(() => {
  useQuestStore.setState({ quests: [] });
  vi.mocked(playSound).mockClear();
});

describe("quest detail", () => {
  it("is 2 taps from the Dashboard to a ticked step, and XP updates on the spot", async () => {
    startEssay();
    renderAt("/");
    await userEvent.click(screen.getByRole("link", { name: /Essay/ }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Open doc" }));

    expect(screen.getByRole("checkbox", { name: "Open doc" })).toBeChecked();
    expect(screen.getByText("4 / 200 XP")).toBeInTheDocument();
    expect(screen.getByText("2 gold")).toBeInTheDocument();
  });

  it("ticking every step of a D quest gives exactly 20 XP and 10 gold and finishes it", async () => {
    const quest = startEssay();
    renderAt(`/quests/${quest.id}`);
    for (const checkbox of screen.getAllByRole("checkbox")) await userEvent.click(checkbox);

    expect(screen.getByText("20 / 200 XP")).toBeInTheDocument();
    expect(screen.getByText("10 gold")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Quest complete!");
    expect(activeQuests(store().quests)).toEqual([]);
  });

  it("unticking after finishing takes back the bonus and returns the quest to Active", async () => {
    const quest = startEssay();
    renderAt(`/quests/${quest.id}`);
    for (const checkbox of screen.getAllByRole("checkbox")) await userEvent.click(checkbox);
    await userEvent.click(screen.getByRole("checkbox", { name: "Open doc" }));

    expect(screen.getByText("8 / 200 XP")).toBeInTheDocument();
    expect(screen.getByText("4 gold")).toBeInTheDocument();
    expect(activeQuests(store().quests).map(q => q.id)).toEqual([quest.id]);
  });

  it("shows a message when a reopened quest goes to the Backlog because 3 are active", async () => {
    const quest = store().addQuest({ title: "Essay" });
    store().toggleStep(quest.id, quest.steps[0].id);
    for (const title of ["A", "B", "C"]) store().startQuest(store().addQuest({ title }).id);
    renderAt(`/quests/${quest.id}`);
    await userEvent.click(screen.getByRole("checkbox", { name: "Essay" }));

    expect(screen.getByRole("alert")).toHaveTextContent(REOPENED_TO_BACKLOG);
  });

  it("says so when the quest doesn't exist", () => {
    renderAt("/quests/nope");
    expect(screen.getByRole("heading", { name: "Quest not found" })).toBeInTheDocument();
  });
});

describe("editing steps on the quest detail page", () => {
  it("adds, renames, moves and deletes steps", async () => {
    const quest = startEssay();
    renderAt(`/quests/${quest.id}`);
    await userEvent.click(screen.getByRole("button", { name: "Edit steps" }));

    await userEvent.type(screen.getByRole("textbox", { name: "New step" }), "Proofread{enter}");
    await userEvent.clear(screen.getByRole("textbox", { name: "Step 1 name" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Step 1 name" }), "Open the doc");
    await userEvent.tab();
    await userEvent.click(screen.getByRole("button", { name: "Move Proofread up" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete Write intro" }));

    const titles = () => useQuestStore.getState().quests[0].steps.map(step => step.title);
    expect(titles()).toEqual(["Open the doc", "Proofread", "Write ending"]);

    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getAllByRole("checkbox").map(box => box.closest("label")?.textContent)).toEqual(titles());
  });
});

describe("feedback", () => {
  it("plays a tone when a step is ticked, and nothing when it's unticked", async () => {
    const quest = startEssay();
    renderAt(`/quests/${quest.id}`);
    await userEvent.click(screen.getByRole("checkbox", { name: "Open doc" }));
    expect(playSound).toHaveBeenCalledExactlyOnceWith("step");
    await userEvent.click(screen.getByRole("checkbox", { name: "Open doc" }));
    expect(playSound).toHaveBeenCalledTimes(1);
  });

  it("plays the quest chime and shows Quest complete when the last step is ticked", async () => {
    const quest = store().addQuest({ title: "Essay" });
    store().startQuest(quest.id);
    renderAt(`/quests/${quest.id}`);
    await userEvent.click(screen.getByRole("checkbox", { name: "Essay" }));
    expect(playSound).toHaveBeenCalledExactlyOnceWith("quest");
    expect(screen.getByRole("status")).toHaveTextContent("Quest complete!");
  });

  it("shows a level-up popup when XP crosses 200, and none when undo lowers the level", async () => {
    const big = store().addQuest({ title: "Big", difficulty: "S" });
    store().toggleStep(big.id, big.steps[0].id);
    const boss = store().addQuest({ title: "Boss", difficulty: "S" });
    store().startQuest(boss.id);
    renderAt(`/quests/${boss.id}`);

    await userEvent.click(screen.getByRole("checkbox", { name: "Boss" }));
    expect(screen.getByRole("dialog", { name: "Level up!" })).toHaveTextContent("You're now level 2");
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox", { name: "Boss" }));
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
