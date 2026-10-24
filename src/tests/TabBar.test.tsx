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

function tab(name: string) {
    return screen.getByRole("link", { name });
}

describe("tab bar", () => {
    it("shows all 4 tabs", () => {
        renderAt("/");
        for (const name of ["Dashboard", "Quests", "Inventory", "Character"]) {
            expect(tab(name)).toBeInTheDocument();
        }
    });

    it.each(["Quests", "Inventory", "Character", "Dashboard"])("opens %s in one tap", async name => {
        renderAt("/quests");
        await userEvent.click(tab(name));
        expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    });

    it("highlights only the current tab", async () => {
        renderAt("/");
        await userEvent.click(tab("Inventory"));
        expect(tab("Inventory")).toHaveAttribute("aria-current", "page");
        expect(tab("Dashboard")).not.toHaveAttribute("aria-current");
    });

    it("keeps Character highlighted on History", () => {
        renderAt("/character/history");
        expect(tab("Character")).toHaveAttribute("aria-current", "page");
    });
});
