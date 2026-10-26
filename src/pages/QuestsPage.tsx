import { Link } from "react-router";

export default function QuestsPage() {
  return (
    <main>
      <h1>Quests</h1>
      <p>All your other open quests and an "Add quest" button</p>
      <Link to="/focus" state={{ from: "/quests" }} className="mt-4 flex min-h-11 items-center rounded bg-surface px-4">
        Placeholder step
      </Link>
    </main>
  );
}
