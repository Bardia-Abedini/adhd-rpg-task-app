import { Link } from "react-router";

export default function CharacterPage() {
  return (
    <main>
      <h1>Character</h1>
      <p>Your level, XP and gold</p>
      <Link to="/character/history" className="inline-flex min-h-11 items-center text-primary">
        History
      </Link>
    </main>
  );
}
