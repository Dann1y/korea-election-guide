// 시민 통합 뷰 — "내 선거구"가 저장되면 모든 직책을 탭으로 분리해 표시.
// 흐름: 첫 진입 → DistrictPicker 위저드 → 저장 → 직책 탭 + 후보 카드.

import { useMemo, useState } from "react";
import {
  Building,
  Building2,
  GraduationCap,
  Landmark,
  MapPin,
  Pencil,
  Users,
  Vote,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  DistrictPicker,
  DistrictPickerModal,
} from "@/components/DistrictPicker";
import { CandidatesSection } from "@/components/CandidatesSection";
import { useMyDistrict } from "@/hooks/useMyDistrict";
import { getRegion } from "@/data/regions";
import { daysUntil } from "@/lib/format";
import { cn } from "@/lib/cn";

const NO_BASIC_REGIONS = new Set(["KR-50", "KR-49"]);

interface Tab {
  key: string;
  label: string;
  subtitle: string;
  icon: typeof Landmark;
  sgTypecode: string;
  matchMode: "none" | "basic" | "exact";
  groupBySgg?: boolean;
  excludeIfNoBasic?: boolean;
}

const TABS: Tab[] = [
  {
    key: "metro",
    label: "광역단체장",
    subtitle: "시·도지사",
    icon: Landmark,
    sgTypecode: "3",
    matchMode: "none",
  },
  {
    key: "basic",
    label: "기초단체장",
    subtitle: "시장·군수·구청장",
    icon: Building2,
    sgTypecode: "4",
    matchMode: "basic",
    excludeIfNoBasic: true,
  },
  {
    key: "metroCouncil",
    label: "광역의원",
    subtitle: "시·도의원 (지역구)",
    icon: Users,
    sgTypecode: "5",
    matchMode: "exact",
    groupBySgg: true,
  },
  {
    key: "basicCouncil",
    label: "기초의원",
    subtitle: "시·군·구의원 (지역구)",
    icon: Building,
    sgTypecode: "6",
    matchMode: "exact",
    groupBySgg: true,
    excludeIfNoBasic: true,
  },
  {
    key: "edu",
    label: "교육감",
    subtitle: "시·도 교육감",
    icon: GraduationCap,
    sgTypecode: "11",
    matchMode: "none",
  },
];

export function MyDistrictPage() {
  const { district, set, clear } = useMyDistrict();
  const [modalOpen, setModalOpen] = useState(false);
  const [tabKey, setTabKey] = useState<string>("metro");

  if (!district) {
    return <SetupHero onConfirm={set} />;
  }

  const region = getRegion(district.regionCode);
  const sdName = region?.necSdName;
  const noBasic = NO_BASIC_REGIONS.has(district.regionCode);
  const dday = daysUntil("2026-06-03");

  if (!sdName) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-ink-300">저장된 선거구 정보가 올바르지 않습니다.</p>
        <button
          onClick={clear}
          className="mt-3 text-sm text-accent-cyan hover:underline"
        >
          다시 설정하기
        </button>
      </div>
    );
  }

  const visibleTabs = TABS.filter((t) => !(noBasic && t.excludeIfNoBasic));
  const tab = visibleTabs.find((t) => t.key === tabKey) ?? visibleTabs[0];

  // 탭별 라벨 — 자치구 정보 보강
  const sectionLabel = useMemo(() => {
    const base = `${tab.label} (${tab.subtitle})`;
    if (tab.matchMode === "none") return base;
    if (!district.wiwName) return base;
    return `${base} · ${district.wiwName}`;
  }, [tab, district.wiwName]);

  return (
    <div className="space-y-4 md:space-y-5 max-w-[1200px] mx-auto">
      {/* 헤더 */}
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent-violet/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none" />
          <div className="relative px-4 py-4 md:px-6 md:py-5 flex flex-wrap items-start md:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Pill className="mb-2 border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan">
                <Vote className="w-3 h-3" />
                제9회 지방선거 · D-{dday}
              </Pill>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-accent-violet shrink-0" />
                <span>{region?.name}</span>
                {district.wiwName ? (
                  <>
                    <span className="text-ink-400">·</span>
                    <span>{district.wiwName}</span>
                  </>
                ) : null}
              </h1>
              <p className="text-xs md:text-sm text-ink-300 mt-1 leading-relaxed">
                내 선거구에서 6·3에 뽑는 모든 직책 후보를 한눈에.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/10 bg-white/[0.04] text-ink-200 hover:text-ink-100 hover:border-white/20 transition shrink-0"
            >
              <Pencil className="w-3 h-3" />
              <span className="hidden sm:inline">선거구 </span>변경
            </button>
          </div>
        </div>
      </Card>

      {/* 탭 바 — 모바일에서 가로 스크롤 */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="inline-flex gap-1 bg-ink-900/60 border border-white/10 rounded-xl p-1">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            const active = t.key === tabKey;
            return (
              <button
                key={t.key}
                onClick={() => setTabKey(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition inline-flex items-center gap-1.5 whitespace-nowrap",
                  active
                    ? "bg-white text-ink-950 shadow"
                    : "text-ink-300 hover:text-ink-100",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 현재 탭의 후보 섹션 */}
      <CandidatesSection
        sgTypecode={tab.sgTypecode}
        label={sectionLabel}
        sdName={sdName}
        filterWiwName={
          tab.matchMode === "none" ? undefined : district.wiwName || undefined
        }
        matchMode={tab.matchMode === "none" ? undefined : tab.matchMode}
        groupBySgg={tab.groupBySgg}
        emptyHint={
          tab.matchMode === "basic"
            ? "이 지역의 기초단체장 후보가 아직 등록되지 않았습니다."
            : tab.matchMode === "exact"
              ? "이 자치구에 등록된 후보가 없습니다."
              : "등록된 후보가 없습니다."
        }
      />

      <DistrictPickerModal
        open={modalOpen}
        initialRegionCode={district.regionCode}
        initialWiwName={district.wiwName}
        onConfirm={set}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

function SetupHero({
  onConfirm,
}: {
  onConfirm: (regionCode: string, wiwName: string) => void;
}) {
  const dday = daysUntil("2026-06-03");
  return (
    <div className="max-w-2xl mx-auto space-y-5 md:space-y-7">
      <div className="text-center space-y-2 md:space-y-3">
        <Pill className="border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan">
          <Vote className="w-3 h-3" />
          제9회 전국동시지방선거 · D-{dday}
        </Pill>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
          내 <span className="text-gradient">선거구</span>를 알려주세요
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-ink-300 max-w-md mx-auto leading-relaxed">
          6월 3일에 받는 투표용지 4~7장이 어떤 후보로 채워지는지, 직전 당선자는
          누구였는지 한 페이지에서 확인합니다.
        </p>
      </div>

      <Card>
        <CardBody>
          <DistrictPicker onConfirm={onConfirm} />
        </CardBody>
      </Card>

      {/* 시민 안내: 왜 / 어떻게 / 개인정보 */}
      <div className="grid sm:grid-cols-3 gap-2.5 md:gap-3">
        <InfoCard
          icon="📍"
          title="어디에 쓰이나요?"
          body="입력하신 선거구로 광역단체장·기초단체장·시·도의원·시·군·구의원·교육감 후보를 골라 보여드립니다."
        />
        <InfoCard
          icon="🔒"
          title="개인정보 보호"
          body="선거구 정보는 이 기기 안에만 저장됩니다. 다른 곳으로 전송되거나 누가 사용했는지 기록되지 않습니다."
        />
        <InfoCard
          icon="🔁"
          title="언제든 변경"
          body="이사 가시거나 잘못 입력했다면 상단의 '변경' 버튼을 눌러 다시 설정할 수 있습니다."
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 md:p-4">
      <div className="text-lg mb-1.5">{icon}</div>
      <div className="text-xs md:text-sm font-semibold text-ink-100 mb-1">
        {title}
      </div>
      <p className="text-[11px] md:text-xs text-ink-300 leading-relaxed">
        {body}
      </p>
    </div>
  );
}
