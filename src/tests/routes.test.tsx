import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import AppRoutes from "../AppRoutes";

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("routes", () => {
  it.each([
    ["/", "Dashboard"],
    ["/quests", "Quests"],
    ["/inventory", "Inventory"],
    ["/character", "Character"],
    ["/character/history", "History"],
    ["/focus", "Focus"],
  ])("%s shows the %s page", (path, title) => {
    renderAt(path);
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  });

  it("opens History from Character, and Back returns to Character", async () => {
    renderAt("/character");
    await userEvent.click(screen.getByRole("link", { name: "History" }));
    expect(screen.getByRole("heading", { name: "History" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: "← Back" }));
    expect(screen.getByRole("heading", { name: "Character" })).toBeInTheDocument();
  });

  it("opens Focus from a step without the tab bar, and Exit returns to Quests", async () => {
    renderAt("/quests");
    await userEvent.click(screen.getByRole("link", { name: "Placeholder step" }));
    expect(screen.getByRole("heading", { name: "Focus" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Main" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: "Exit" }));
    expect(screen.getByRole("heading", { name: "Quests" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("exits Focus to the Dashboard when opened directly", async () => {
    renderAt("/focus");
    await userEvent.click(screen.getByRole("link", { name: "Exit" }));
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("sends unknown URLs to the Dashboard", () => {
    renderAt("/not-a-page");
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
