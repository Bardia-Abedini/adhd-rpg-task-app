import { xpForLevel } from "../../lib/xp";

export default function XpBar({ xp, level }: { xp: number; level: number }) {
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const percent = ((xp - start) / (next - start)) * 100;

  return (
    <div>
      <div
        role="progressbar"
        aria-label="XP to next level"
        aria-valuemin={start}
        aria-valuemax={next}
        aria-valuenow={xp}
        className="h-3 overflow-hidden rounded bg-surface"
      >
        <div className="h-full bg-xp transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-sm text-muted">
        {xp} / {next} XP
      </p>
    </div>
  );
}
