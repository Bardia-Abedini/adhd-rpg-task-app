export default function LevelUpPopup({ level, onClose }: { level: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-up-title"
        className="rounded bg-surface p-6 text-center"
      >
        <h2 id="level-up-title" className="text-gold">
          Level up!
        </h2>
        <p className="mt-2">You're now level {level}</p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-4 min-h-11 rounded bg-primary px-6 font-bold text-background"
        >
          OK
        </button>
      </div>
    </div>
  );
}
