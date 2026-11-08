import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { Difficulty, Priority } from "../lib/types";
import { useQuestStore } from "../store/quests";

const field = "mt-1 min-h-11 w-full rounded bg-surface px-3";

export default function NewQuestPage() {
  const addQuest = useQuestStore(state => state.addQuest);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    if (!title) {
      setError("Give your quest a title");
      return;
    }
    addQuest({
      title,
      // Safe casts: the selects only offer valid values
      priority: form.get("priority") as Priority,
      difficulty: form.get("difficulty") as Difficulty,
      estimateMin: Number(form.get("estimateMin")) || undefined,
      dueDate: String(form.get("dueDate")) || undefined,
      steps: String(form.get("steps")).split("\n"),
    });
    navigate("/quests");
  }

  return (
    <main>
      <h1>New quest</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <label>
          Title
          <input name="title" required autoFocus className={field} />
        </label>
        {error && (
          <p role="alert" className="text-accent">
            {error}
          </p>
        )}
        <label>
          Priority
          <select name="priority" defaultValue="medium" className={field}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>
          Difficulty
          <select name="difficulty" defaultValue="D" className={field}>
            {["E", "D", "C", "B", "A", "S"].map(difficulty => (
              <option key={difficulty}>{difficulty}</option>
            ))}
          </select>
        </label>
        <label>
          Time guess (min)
          <input name="estimateMin" type="number" min={1} defaultValue={25} className={field} />
        </label>
        <label>
          Due date
          <input name="dueDate" type="date" className={field} />
        </label>
        <label>
          Steps (one per line)
          <textarea name="steps" rows={4} className={`${field} py-2`} />
        </label>
        <div className="flex gap-4">
          <button type="submit" className="min-h-11 rounded bg-primary px-6 font-bold text-background">
            Save
          </button>
          <Link to="/quests" className="inline-flex min-h-11 items-center text-primary">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
