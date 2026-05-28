import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  CalendarClock,
  History,
  Info,
  LayoutDashboard,
  MapPin,
  Menu,
  Vote,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { daysUntil } from "@/lib/format";
import { Footer } from "./Footer";
import { DataSourceDialog } from "@/components/DataSourceDialog";

const NAV = [
  { to: "/", label: "내 선거구", icon: MapPin, end: true },
  { to: "/election-2026", label: "전체 후보 탐색", icon: Vote },
  { to: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { to: "/history", label: "역대 분석", icon: History },
];

export function AppShell() {
  const location = useLocation();
  const dday = daysUntil("2026-06-03");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // 경로 변경 시 드로어 자동 닫기
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // 드로어 열려있을 때 body 스크롤 잠금
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col gap-1 px-4 py-6 border-r border-white/5 bg-ink-950/60 backdrop-blur-xl">
        <SidebarContent dday={dday} />
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen ? (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-64 max-w-[85vw] bg-ink-950 border-r border-white/10 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-ink-300 hover:text-ink-100 hover:bg-white/5"
              aria-label="메뉴 닫기"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent dday={dday} />
          </aside>
        </div>
      ) : null}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-ink-950/70 border-b border-white/5 px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-1.5 rounded-lg border border-white/10 bg-white/5 text-ink-200 hover:text-ink-100"
            aria-label="메뉴 열기"
          >
            <Menu className="w-4 h-4" />
          </button>
          <BarChart3 className="w-4 h-4 text-accent-violet hidden sm:block" />
          <div className="text-xs md:text-sm text-ink-300 min-w-0">
            <span className="text-ink-100 font-semibold truncate block">
              {breadcrumbLabel(location.pathname)}
            </span>
          </div>
          <button
            onClick={() => setInfoOpen(true)}
            className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] md:text-xs text-ink-300 hover:text-ink-100 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition shrink-0"
          >
            <Info className="w-3 h-3" />
            <span className="hidden sm:inline">이 서비스 </span>안내
          </button>
        </header>
        <div className="px-4 py-5 md:px-6 md:py-8">
          <Outlet />
        </div>
        <Footer onOpenInfo={() => setInfoOpen(true)} />
      </main>
      <DataSourceDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

function SidebarContent({ dday }: { dday: number }) {
  return (
    <>
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet via-fuchsia-500 to-accent-cyan grid place-items-center shadow-glow">
          <svg
            viewBox="0 0 64 64"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              d="M17 33 L28 44 L48 22"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-sm tracking-tight">
            한국 지방선거 안내
          </div>
          <div className="text-[10px] text-ink-300 -mt-0.5">
            제9회 전국동시지방선거
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group",
                  isActive
                    ? "bg-white/[0.07] text-ink-100 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]"
                    : "text-ink-300 hover:text-ink-100 hover:bg-white/5",
                )
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-300">
            <CalendarClock className="w-3.5 h-3.5" />
            제9회 지방선거
          </div>
          <div className="mt-1 text-2xl font-bold text-gradient">D-{dday}</div>
          <div className="text-[11px] text-ink-300">2026년 6월 3일</div>
        </div>
      </div>
    </>
  );
}

function breadcrumbLabel(path: string) {
  if (path === "/" || path.startsWith("/my-district")) return "내 선거구";
  if (path.startsWith("/dashboard")) return "대시보드";
  if (path.startsWith("/election-2026")) return "2026 6·3 선거";
  if (path.startsWith("/history")) return "역대 분석";
  if (path.startsWith("/region")) return "지역 상세";
  return "한국 지방선거";
}
