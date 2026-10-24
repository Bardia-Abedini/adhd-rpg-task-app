import { Navigate, Route, Routes } from "react-router";
import CharacterPage from "./pages/CharacterPage";
import DashboardPage from "./pages/DashboardPage";
import FocusPage from "./pages/FocusPage";
import HistoryPage from "./pages/HistoryPage";
import InventoryPage from "./pages/InventoryPage";
import QuestsPage from "./pages/QuestsPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/character/history" element={<HistoryPage />} />
            <Route path="/focus" element={<FocusPage />} />
            {/* Unknown URLs go to the Dashboard so nobody gets lost */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
