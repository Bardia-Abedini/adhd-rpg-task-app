import { render, screen } from "@testing-library/react";
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

    it("sends unknown URLs to the Dashboard", () => {
        renderAt("/not-a-page");
        expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    });
});
