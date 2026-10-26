import { Link, useLocation } from "react-router";

export default function FocusPage() {
  const state: unknown = useLocation().state;
  // goes back to where focus was opened from; a direct visit exits to the dashboard
  const exitTo =
    typeof state === "object" && state !== null && "from" in state && typeof state.from === "string" ? state.from : "/";

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-6">
      <Link to={exitTo} className="inline-flex min-h-11 items-center self-start text-primary">
        Exit
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1>Focus</h1>
        <p className="font-display text-6xl">25:00</p>
        <p className="text-muted">Placeholder quest · Placeholder step</p>
      </div>
    </main>
  );
}
