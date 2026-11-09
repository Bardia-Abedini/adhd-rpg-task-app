import type { FormEvent } from "react";
import type { Quest } from "../../lib/types";
import { useQuestStore } from "../../store/quests";

const button = "min-h-11 min-w-11 shrink-0 text-primary disabled:text-muted";

export default function StepEditor({ quest, onMessage }: { quest: Quest; onMessage: (message: string) => void }) {
  const addStep = useQuestStore(state => state.addStep);
  const renameStep = useQuestStore(state => state.renameStep);
  const moveStep = useQuestStore(state => state.moveStep);
  const deleteStep = useQuestStore(state => state.deleteStep);
  const { steps } = quest;

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("newStep") as HTMLInputElement;
    onMessage(addStep(quest.id, input.value) ?? "");
    input.value = "";
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center gap-1 rounded bg-surface px-2">
            <input
              aria-label={`Step ${index + 1} name`}
              defaultValue={step.title}
              onBlur={event => {
                renameStep(quest.id, step.id, event.target.value);
                // A blank name is ignored, so show the kept name again
                if (!event.target.value.trim()) event.target.value = step.title;
              }}
              className="min-h-11 min-w-0 flex-1 bg-surface px-2"
            />
            <button
              type="button"
              aria-label={`Move ${step.title} up`}
              disabled={index === 0}
              onClick={() => moveStep(quest.id, step.id, -1)}
              className={button}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move ${step.title} down`}
              disabled={index === steps.length - 1}
              onClick={() => moveStep(quest.id, step.id, 1)}
              className={button}
            >
              ↓
            </button>
            {steps.length > 1 && (
              <button
                type="button"
                aria-label={`Delete ${step.title}`}
                onClick={() => onMessage(deleteStep(quest.id, step.id) ?? "")}
                className={`${button} px-2`}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          name="newStep"
          aria-label="New step"
          placeholder="Add step"
          className="min-h-11 min-w-0 flex-1 rounded bg-surface px-3"
        />
        <button type="submit" className="min-h-11 rounded bg-primary px-4 font-bold text-background">
          Add
        </button>
      </form>
    </div>
  );
}
