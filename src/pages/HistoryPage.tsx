import { Link } from "react-router";

export default function HistoryPage() {
  return (
    <main>
      {/* goes to character, not previous page, so a direct visit doesn't leave the app */}
      <Link to="/character" className="inline-flex min-h-11 items-center text-primary">
        ← Back
      </Link>
      <h1>History</h1>
      <p>Your past focus sessions and stats</p>
    </main>
  );
}
