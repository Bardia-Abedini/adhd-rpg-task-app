import { Outlet } from "react-router";
import TabBar from "./TabBar";

// Pages with the tab bar. Bottom padding keeps content clear of the fixed bar.
export default function AppLayout() {
  return (
    <div className="min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
