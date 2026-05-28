import { useMemo, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { KoreaTileMap } from "@/components/map/KoreaTileMap";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import {
  getHistoricalByRegion,
  getHistoricalByYear,
  getRegionWinner,
} from "@/data";
import { metroRegions, getRegion } from "@/data/regions";
import { cn } from "@/lib/cn";
import type { ElectionYear, PartyCode } from "@/types";

const YEARS: ElectionYear[] = [2014, 2018, 2022];

const YEAR_META: Record<
  ElectionYear,
  { label: string; subtitle: string; tone: string }
> = {
  2014: {
    label: "제6회 지방선거",
    subtitle: "2014.06.04 · 박근혜 정부 2년차",
    tone: "from-rose-500/20 to-amber-500/10",
  },
  2018: {
    label: "제7회 지방선거",
    subtitle: "2018.06.13 · 문재인 정부 1년차",
    tone: "from-blue-500/20 to-emerald-500/10",
  },
  2022: {
    label: "제8회 지방선거",
    subtitle: "2022.06.01 · 윤석열 정부 출범 직후",
    tone: "from-rose-500/20 to-violet-500/10",
  },
  2026: { label: "", subtitle: "", tone: "" },
};

export function HistoryPage() {
  const [year, setYear] = useState<ElectionYear>(2022);
  const [selectedRegion, setSelectedRegion] = useState<string>("KR-11");

  const winners = useMemo(() => {
    const m: Record<string, PartyCode | undefined> = {};
    for (const r of metroRegions) {
      m[r.code] = getRegionWinner(r.code, year)?.party;
    }
    return m;
  }, [year]);

  const region = getRegion(selectedRegion);
  const candidates = getHistoricalByRegion(selectedRegion, year);
  const winner = candidates.find((c) => c.isWinner);

  const meta = YEAR_META[year];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <Pill className="mb-2">
          <HistoryIcon className="w-3 h-3" />
          역대 지방선거
        </Pill>
        <h1 className="text-3xl font-bold tracking-tight">역대 광역단체장 분석</h1>
        <p className="text-sm text-ink-300 mt-1">
          회차를 선택해 광역 당선자의 공약·이행률·논란을 살펴보세요.
        </p>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/5 p-5 bg-gradient-to-br",
          meta.tone,
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ink-300">
              {meta.subtitle}
            </div>
            <div className="text-3xl font-bold tracking-tight mt-1">
              {meta.label}
            </div>
          </div>
          <div className="flex bg-ink-900/60 border border-white/10 rounded-xl p-1">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition",
                  y === year
                    ? "bg-white text-ink-950 shadow"
                    : "text-ink-300 hover:text-ink-100",
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>광역 결과</CardTitle>
          </CardHeader>
          <CardBody>
            <KoreaTileMap
              winnersByRegion={winners}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {region?.name} · {year}
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {winner ? (
              <CandidateCard candidate={winner} variant="historical" />
            ) : (
              <p className="text-sm text-ink-300">
                해당 회차 데이터가 시드되지 않았습니다.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{year} 전국 광역단체장 일람</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {getHistoricalByYear(year)
              .filter((c) => c.isWinner)
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedRegion(c.regionCode)}
                  className={cn(
                    "text-left rounded-xl border p-3 transition",
                    c.regionCode === selectedRegion
                      ? "border-accent-violet/50 bg-accent-violet/5"
                      : "border-white/5 hover:border-white/15 bg-white/[0.02]",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-widest text-ink-300">
                      {getRegion(c.regionCode)?.shortName}
                    </span>
                    <span className="text-[11px] tabular-nums text-ink-300">
                      {((c.voteShare ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-ink-300 mt-0.5">
                    {c.partyNameRaw ?? c.party}
                  </div>
                  {c.termAssessment ? (
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${c.termAssessment.overallScore}%`,
                          background:
                            c.termAssessment.overallScore >= 65
                              ? "#a3e635"
                              : c.termAssessment.overallScore >= 50
                                ? "#fbbf24"
                                : "#f43f5e",
                        }}
                      />
                    </div>
                  ) : null}
                </button>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
