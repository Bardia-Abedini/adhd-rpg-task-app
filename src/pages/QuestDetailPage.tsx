import { useState } from "react";
import { Link, useParams } from "react-router";
import CharacterCard from "../components/game/CharacterCard";
import StepEditor from "../components/game/StepEditor";
import { useQuestStore } from "../store/quests";

export default function QuestDetailPage() {
  const { id } = useParams();
  const quest = useQuestStore(state => state.quests.find(q => q.id === id));
  const toggleStep = useQuestStore(state => state.toggleStep);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const back = (
    <Link to="/" className="inline-flex min-h-11 items-center text-primary">
      ← Dashboard
    </Link>
  );

  // shortcut: nothing is saved yet, so a refresh or old link loses the quest; fixed by saving in Block 2
  if (!quest) {
    return (
      <main>
        {back}
        <h1>Quest not found</h1>
      </main>
    );
  }

  return (
    <main>
      {back}
      <h1>{quest.title}</h1>
      <p className="text-muted">
        <span className="capitalize">{quest.priority}</span> · {quest.difficulty}
        {quest.status === "done" && " · Done"}
      </p>

      <CharacterCard />

      <div className="mt-6 flex items-center justify-between">
        <h2>Steps</h2>
        <button type="button" onClick={() => setEditing(!editing)} className="min-h-11 px-2 text-primary">
          {editing ? "Done" : "Edit steps"}
        </button>
      </div>
      {message && (
        <p role="alert" className="text-accent">
          {message}
        </p>
      )}
      {editing ? (
        <StepEditor quest={quest} onMessage={setMessage} />
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {quest.steps.map(step => (
            <li key={step.id}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded bg-surface px-4">
                <input
                  type="checkbox"
                  checked={step.done}
                  onChange={() => setMessage(toggleStep(quest.id, step.id) ?? "")}
                  className="size-5 accent-primary"
                />
                <span className={step.done ? "text-muted line-through" : ""}>{step.title}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
