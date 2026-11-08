import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import AppRoutes from "../AppRoutes";
import { TOO_MANY_ACTIVE, useQuestStore } from "../store/quests";

function renderQuests() {
  render(
    <MemoryRouter initialEntries={["/quests"]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const store = () => useQuestStore.getState();

beforeEach(() => {
  useQuestStore.setState({ quests: [] });
});

describe("quests page", () => {
  it("says so when the Backlog is empty", () => {
    renderQuests();
    expect(screen.getByText("No quests in your Backlog. Add one to get started.")).toBeInTheDocument();
  });

  it("lists Backlog quests with their priority and difficulty", () => {
    store().addQuest({ title: "Essay", priority: "high", difficulty: "B" });
    renderQuests();
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("opens the new quest form", async () => {
    renderQuests();
    await userEvent.click(screen.getByRole("link", { name: "New quest" }));
    expect(screen.getByRole("heading", { name: "New quest" })).toBeInTheDocument();
  });

  it("Start moves a quest out of the Backlog and makes it active", async () => {
    store().addQuest({ title: "Essay" });
    renderQuests();
    await userEvent.click(screen.getByRole("button", { name: "Start Essay" }));
    expect(screen.queryByText("Essay")).not.toBeInTheDocument();
    expect(store().quests[0].active).toBe(true);
  });

  it("blocks a 4th active quest with a message", async () => {
    for (const title of ["A", "B", "C"]) store().startQuest(store().addQuest({ title }).id);
    store().addQuest({ title: "Fourth" });
    renderQuests();
    await userEvent.click(screen.getByRole("button", { name: "Start Fourth" }));
    expect(screen.getByRole("alert")).toHaveTextContent(TOO_MANY_ACTIVE);
    expect(screen.getByText("Fourth")).toBeInTheDocument();
  });
});
