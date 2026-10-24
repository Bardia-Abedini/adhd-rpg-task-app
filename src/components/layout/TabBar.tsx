import { NavLink } from "react-router";

const tabs = [
  { to: "/", label: "Dashboard" },
  { to: "/quests", label: "Quests" },
  { to: "/inventory", label: "Inventory" },
  { to: "/character", label: "Character" },
];

export default function TabBar() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 bg-surface pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-3xl grid-cols-4">
        {tabs.map(tab => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              // "end" so Dashboard ("/") isn't highlighted on every page
              end={tab.to === "/"}
              className={({ isActive }) =>
                `flex h-14 items-center justify-center text-sm ${isActive ? "font-bold text-primary" : "text-muted"}`
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
