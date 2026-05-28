import { useMemo, useState } from "react";
import {
  Building,
  Building2,
  ExternalLink,
  GraduationCap,
  Info,
  Landmark,
  Loader2,
  Users,
  Vote,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { KoreaTileMap } from "@/components/map/KoreaTileMap";
import { LiveCandidateCard } from "@/components/candidate/LiveCandidateCard";
import { BallotGuide } from "@/components/BallotGuide";
import { getRegionWinner } from "@/data";
import { metroRegions, getRegion } from "@/data/regions";
import { getParty, parties } from "@/data/parties";
import { useCandidates } from "@/hooks/useLiveCandidates";
import { useWinners } from "@/hooks/useLiveWinners";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import type { PartyCode } from "@/types";

const SG_ID_9TH = "20260603";
const SG_ID_8TH = "20220601";

// NEC 정당명 → 내부 PartyCode (색상용)
function mapParty(name: string | undefined): PartyCode {
  if (!name) return "etc";
  if (name.includes("더불어민주")) return "dp";
  if (name.includes("국민의힘")) return "ppp";
  if (name.includes("개혁")) return "rp";
  if (name.includes("정의")) return "jp";
  if (name.includes("진보")) return "npp";
  if (name.includes("무소속")) return "ind";
  return "etc";
}

interface BallotType {
  key: string;
  sgTypecode: string;
  label: string;
  icon: typeof Landmark;
  // 기초·의원처럼 같은 sdName 안에서 wiw/sgg로 더 잘게 나누는지
  groupBy?: "sgg" | "wiw";
  // 세종/제주는 기초자치단체가 없어 해당 투표 없음
  excludeRegions?: string[];
}

const BALLOTS: BallotType[] = [
  { key: "metro", sgTypecode: "3", label: "광역단체장", icon: Landmark },
  {
    key: "basic",
    sgTypecode: "4",
    label: "기초단체장",
    icon: Building2,
    groupBy: "wiw",
    excludeRegions: ["KR-50", "KR-49"],
  },
  {
    key: "metroCouncil",
    sgTypecode: "5",
    label: "광역의원",
    icon: Users,
    groupBy: "sgg",
  },
  {
    key: "basicCouncil",
    sgTypecode: "6",
    label: "기초의원",
    icon: Building,
    groupBy: "sgg",
    excludeRegions: ["KR-50", "KR-49"],
  },
  { key: "edu", sgTypecode: "11", label: "교육감", icon: GraduationCap },
];

export function Election2026Page() {
  const [selectedRegion, setSelectedRegion] = useState<string>("KR-11");
  const [tabKey, setTabKey] = useState<string>("metro");
  const [subRegion, setSubRegion] = useState<string>(""); // 시·군·구 또는 선거구

  const ballot = BALLOTS.find((b) => b.key === tabKey) ?? BALLOTS[0];
  const region = getRegion(selectedRegion);
  const sdName = region?.necSdName;
  const excluded = ballot.excludeRegions?.includes(selectedRegion) ?? false;

  const {
    candidates: liveCandidates,
    loading: liveLoading,
    error: liveError,
  } = useCandidates(SG_ID_9TH, ballot.sgTypecode, excluded ? undefined : sdName);

  // 8회(2022) 직전 당선자 — sgTypecode 동일, 같은 sdName으로 NEC 조회
  const { winners: liveWinners } = useWinners(
    SG_ID_8TH,
    ballot.sgTypecode,
    excluded ? undefined : sdName,
  );

  const winnersPrev = useMemo(() => {
    const m: Record<string, PartyCode | undefined> = {};
    for (const r of metroRegions) {
      m[r.code] = getRegionWinner(r.code, 2022)?.party;
    }
    return m;
  }, []);

  // 기초·의원처럼 그룹핑이 필요한 경우 sub region (시·군·구 또는 선거구) 목록
  const subRegions = useMemo(() => {
    if (!ballot.groupBy) return [];
    const set = new Set<string>();
    for (const c of liveCandidates) {
      const v = ballot.groupBy === "wiw" ? c.wiwName : c.sggName;
      if (v) set.add(v);
    }
    return Array.from(set).sort();
  }, [liveCandidates, ballot.groupBy]);

  // sub region 자동 선택 (탭 변경 시)
  const effectiveSubRegion = useMemo(() => {
    if (!ballot.groupBy) return "";
    if (subRegion && subRegions.includes(subRegion)) return subRegion;
    return subRegions[0] ?? "";
  }, [ballot.groupBy, subRegion, subRegions]);

  // 필터링된 후보
  const filteredCandidates = useMemo(() => {
    if (!ballot.groupBy) return liveCandidates;
    return liveCandidates.filter((c) => {
      const v = ballot.groupBy === "wiw" ? c.wiwName : c.sggName;
      return v === effectiveSubRegion;
    });
  }, [liveCandidates, ballot.groupBy, effectiveSubRegion]);

  // 직전 당선자 매칭. 광역장은 시·도 1명, 기초장은 wiwName, 의원은 sggName 기준.
  const prevWinnerLive = useMemo(() => {
    if (liveWinners.length === 0) return undefined;
    if (!ballot.groupBy) return liveWinners[0];
    return liveWinners.find((w) => {
      const v = ballot.groupBy === "wiw" ? w.wiwName : w.sggName;
      return v === effectiveSubRegion;
    });
  }, [liveWinners, ballot.groupBy, effectiveSubRegion]);

  const prevWinnerSeed = getRegionWinner(selectedRegion, 2022);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <Pill className="mb-2 border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan">
          <Vote className="w-3 h-3" />
          제9회 전국동시지방선거 · 2026.06.03
        </Pill>
        <h1 className="text-3xl font-bold tracking-tight">
          내 선거구 후보 찾기
        </h1>
        <p className="text-sm text-ink-300 mt-1">
          중앙선거관리위원회 OpenAPI 실시간 데이터. 시·도 선택 → 직책 탭 →
          (필요 시) 자치구·선거구 선택.
        </p>
      </div>

      <BallotGuide />

      {/* sgTypecode 탭 */}
      <div className="flex flex-wrap gap-1 bg-ink-900/60 border border-white/10 rounded-xl p-1 w-fit">
        {BALLOTS.map((b) => {
          const Icon = b.icon;
          const active = b.key === tabKey;
          return (
            <button
              key={b.key}
              onClick={() => {
                setTabKey(b.key);
                setSubRegion("");
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition inline-flex items-center gap-2",
                active
                  ? "bg-white text-ink-950 shadow"
                  : "text-ink-300 hover:text-ink-100",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {b.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              시·도 선택
            </CardTitle>
          </CardHeader>
          <CardBody>
            <KoreaTileMap
              winnersByRegion={winnersPrev}
              selectedRegion={selectedRegion}
              onSelectRegion={(c) => {
                setSelectedRegion(c);
                setSubRegion("");
              }}
              highlightedRegions={undefined}
            />
            <div className="mt-3 flex items-start gap-2 text-[11px] text-ink-300">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                헥사 색상은 2022 광역단체장 정당. 9회 후보 데이터는 NEC
                OpenAPI에서 실시간 수신합니다.
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-lime" />
              {region?.name} · {ballot.label}
              {ballot.groupBy && effectiveSubRegion ? (
                <span className="ml-1 text-ink-200">
                  · {effectiveSubRegion}
                </span>
              ) : null}
              {liveLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-300 ml-1" />
              ) : (
                <span className="ml-auto text-[11px] font-normal text-ink-300">
                  {filteredCandidates.length}명
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {prevWinnerLive ? (
              <PrevWinnerBanner
                name={prevWinnerLive.name}
                party={prevWinnerLive.party}
                voteShare={prevWinnerLive.voteShare}
                source="live"
              />
            ) : ballot.key === "metro" && prevWinnerSeed ? (
              <PrevWinnerBanner
                name={prevWinnerSeed.name}
                party={parties[prevWinnerSeed.party].name}
                voteShare={prevWinnerSeed.voteShare}
                source="seed"
              />
            ) : null}

            {/* Sub region selector (기초·의원 등) */}
            {ballot.groupBy && subRegions.length > 1 ? (
              <div className="flex flex-wrap gap-1.5">
                {subRegions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubRegion(s)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] border transition",
                      s === effectiveSubRegion
                        ? "bg-accent-violet/30 border-accent-violet/50 text-white"
                        : "bg-white/[0.02] border-white/5 text-ink-300 hover:border-white/15",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {excluded ? (
              <p className="text-sm text-ink-300">
                {region?.name}에는 해당 투표가 없습니다 (기초자치단체 없음).
              </p>
            ) : liveError ? (
              <ErrorState message={liveError} />
            ) : liveLoading ? (
              <Loading />
            ) : filteredCandidates.length === 0 ? (
              <p className="text-sm text-ink-300">
                등록된 후보가 없거나 데이터가 아직 반영되지 않았습니다.
              </p>
            ) : (
              <div className="grid gap-4">
                {filteredCandidates.map((c) => (
                  <LiveCandidateCard
                    key={c.huboid}
                    sgId={SG_ID_9TH}
                    sgTypecode={ballot.sgTypecode}
                    candidate={c}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

    </div>
  );
}

function PrevWinnerBanner({
  name,
  party,
  voteShare,
  source,
}: {
  name: string;
  party?: string;
  voteShare?: number;
  source: "live" | "seed";
}) {
  const code = mapParty(party);
  const color = getParty(code).color;
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <Users className="w-3.5 h-3.5 text-ink-300" />
        <span className="text-ink-300">2022 직전 당선</span>
        <span className="text-ink-100 font-semibold">{name}</span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
          style={{ background: `${color}33`, color }}
        >
          {party ?? "—"}
        </span>
        {voteShare !== undefined ? (
          <span className="text-[11px] tabular-nums text-ink-300">
            {formatPercent(voteShare)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-300 py-6 justify-center">
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
      후보 정보 불러오는 중...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-xs text-ink-300 leading-relaxed">
      <div className="text-rose-300 font-medium mb-1">
        데이터를 불러올 수 없습니다
      </div>
      {message}
    </div>
  );
}
