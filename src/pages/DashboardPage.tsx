import { Link } from "react-router";
import CharacterCard from "../components/game/CharacterCard";
import { activeQuests } from "../lib/quests";
import { useQuestStore } from "../store/quests";

export default function DashboardPage() {
  const quests = useQuestStore(state => state.quests);
  const pauseQuest = useQuestStore(state => state.pauseQuest);
  const active = activeQuests(quests);

  return (
    <main>
      <h1>Dashboard</h1>

      <CharacterCard />

      <h2 className="mt-6">Active Quests</h2>
      {active.length === 0 ? (
        <p className="text-muted">
          No active quests. Start one from your{" "}
          <Link to="/quests" className="text-primary">
            Backlog
          </Link>
          .
        </p>
      ) : (
        <ul aria-label="Active Quests" className="mt-2 flex flex-col gap-2">
          {active.map(quest => (
            <li key={quest.id} className="flex items-center justify-between gap-4 rounded bg-surface px-4 py-2">
              <Link to={`/quests/${quest.id}`} className="flex min-h-11 flex-col justify-center">
                <span>{quest.title}</span>
                <span className="text-sm text-muted">
                  <span className="capitalize">{quest.priority}</span> · {quest.difficulty} ·{" "}
                  {quest.steps.filter(step => step.done).length}/{quest.steps.length} steps
                </span>
              </Link>
              <button
                type="button"
                onClick={() => pauseQuest(quest.id)}
                aria-label={`Pause ${quest.title}`}
                className="min-h-11 shrink-0 px-4 text-muted"
              >
                Pause
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
