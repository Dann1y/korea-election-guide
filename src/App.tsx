import { Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/Home";
import { MyDistrictPage } from "@/pages/MyDistrict";
import { Election2026Page } from "@/pages/Election2026";
import { HistoryPage } from "@/pages/History";
import { RegionPage } from "@/pages/Region";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<MyDistrictPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/my-district" element={<MyDistrictPage />} />
        <Route path="/election-2026" element={<Election2026Page />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/region/:code" element={<RegionPage />} />
        <Route
          path="*"
          element={
            <div className="text-ink-300">존재하지 않는 페이지입니다.</div>
          }
        />
      </Route>
    </Routes>
  );
}
