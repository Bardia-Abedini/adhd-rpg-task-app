import { useState } from "react";
import { Link } from "react-router";
import { backlogQuests } from "../lib/quests";
import { useQuestStore } from "../store/quests";

export default function QuestsPage() {
  const quests = useQuestStore(state => state.quests);
  const startQuest = useQuestStore(state => state.startQuest);
  const [message, setMessage] = useState("");
  const backlog = backlogQuests(quests);

  return (
    <main>
      <h1>Quests</h1>
      <Link
        to="/quests/new"
        className="mt-4 inline-flex min-h-11 items-center rounded bg-primary px-6 font-bold text-background"
      >
        New quest
      </Link>

      <h2 className="mt-6">Backlog</h2>
      {message && (
        <p role="alert" className="text-accent">
          {message}
        </p>
      )}
      {backlog.length === 0 ? (
        <p className="text-muted">No quests in your Backlog. Add one to get started.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {backlog.map(quest => (
            <li key={quest.id} className="flex items-center justify-between gap-4 rounded bg-surface px-4 py-2">
              <div>
                <p>{quest.title}</p>
                <p className="text-sm text-muted">
                  <span className="capitalize">{quest.priority}</span> · {quest.difficulty}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMessage(startQuest(quest.id) ?? "")}
                aria-label={`Start ${quest.title}`}
                className="min-h-11 shrink-0 px-4 font-bold text-primary"
              >
                Start
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* shortcut: placeholder until the focus spec; tapping a real step will open Focus */}
      <Link to="/focus" state={{ from: "/quests" }} className="mt-6 flex min-h-11 items-center rounded bg-surface px-4">
        Placeholder step
      </Link>
    </main>
  );
}
