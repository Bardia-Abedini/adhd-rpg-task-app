import { characterStats } from "../../lib/xp";
import { useQuestStore } from "../../store/quests";
import XpBar from "./XpBar";

export default function CharacterCard() {
  const stats = characterStats(useQuestStore(state => state.quests));

  return (
    <section aria-label="Character" className="mt-4 rounded bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-xl">Level {stats.level}</p>
        <p className="text-gold">{stats.gold} gold</p>
      </div>
      <div className="mt-2">
        <XpBar xp={stats.xp} level={stats.level} />
      </div>
    </section>
  );
}
