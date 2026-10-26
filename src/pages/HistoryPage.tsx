import { Link } from "react-router";

export default function HistoryPage() {
  return (
    <main>
      {/* Goes to Character, not "previous page", so a direct visit can't leave the app */}
      <Link to="/character" className="inline-flex min-h-11 items-center text-primary">
        ← Back
      </Link>
      <h1>History</h1>
      <p>Your past focus sessions and stats will appear here.</p>
    </main>
  );
}
