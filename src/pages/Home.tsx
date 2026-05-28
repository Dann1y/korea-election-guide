import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Stat } from "@/components/ui/Stat";
import { KoreaTileMap } from "@/components/map/KoreaTileMap";
import { TurnoutTrend } from "@/components/TurnoutTrend";
import {
  allCurrentCandidates,
  allHistoricalCandidates,
  getRegionWinner,
} from "@/data";
import { getParty, parties } from "@/data/parties";
import { metroRegions, getRegion } from "@/data/regions";
import { daysUntil, formatPercent } from "@/lib/format";
import type { PartyCode } from "@/types";

export function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("KR-11");

  const winners2022 = useMemo(() => {
    const map: Record<string, PartyCode | undefined> = {};
    for (const r of metroRegions) {
      map[r.code] = getRegionWinner(r.code, 2022)?.party;
    }
    return map;
  }, []);

  const partyShareByYear = useMemo(() => {
    return [2014, 2018, 2022].map((year) => {
      const winners = allHistoricalCandidates.filter(
        (c) => c.electionYear === year && c.isWinner,
      );
      const counts: Record<string, number> = {};
      for (const w of winners) {
        counts[w.party] = (counts[w.party] ?? 0) + 1;
      }
      return {
        year,
        ...counts,
      } as Record<string, number | string>;
    });
  }, []);

  const candidates2026ByParty = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of allCurrentCandidates) {
      counts[c.party] = (counts[c.party] ?? 0) + 1;
    }
    return Object.entries(counts).map(([party, count]) => ({
      party,
      count,
      color: parties[party as PartyCode].color,
      name: parties[party as PartyCode].shortName,
    }));
  }, []);

  const selected = getRegion(selectedRegion);
  const selectedWinner2022 = getRegionWinner(selectedRegion, 2022);
  const dday = daysUntil("2026-06-03");

  const swingRegions = useMemo(() => {
    return metroRegions
      .map((r) => {
        const w2018 = getRegionWinner(r.code, 2018);
        const w2022 = getRegionWinner(r.code, 2022);
        if (!w2018 || !w2022) return null;
        if (w2018.party === w2022.party) return null;
        return { region: r, from: w2018.party, to: w2022.party };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-800/70 p-8">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent-violet/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-accent-cyan/10 blur-3xl" />
        <div className="relative">
          <Pill className="mb-4 border-accent-violet/40 bg-accent-violet/10 text-accent-violet">
            <Sparkles className="w-3 h-3" />
            제9회 전국동시지방선거
          </Pill>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            한국 지방선거를
            <br />
            <span className="text-gradient">데이터로 들여다보다</span>
          </h1>
          <p className="mt-4 text-ink-300 max-w-2xl">
            2014·2018·2022 광역·기초단체장 당선자의 공약과 이행률, 논란을
            한눈에. 2026 6·3 지방선거 후보자별 공약과 직전 임기 성과까지
            교차분석합니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/election-2026"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-ink-950 text-sm font-semibold hover:bg-ink-100 transition focus-ring"
            >
              6·3 선거 보기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-strong text-sm font-semibold hover:bg-white/10 transition focus-ring"
            >
              역대 분석 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat
          label="D-DAY"
          value={`D-${dday}`}
          hint={
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 2026-06-03
            </span>
          }
        />
        <Stat
          label="6.3 후보자 수"
          value={allCurrentCandidates.length}
          hint="주요 광역 후보 (시드 기준)"
        />
        <Stat
          label="역대 분석 회차"
          value="3개"
          hint="2014 · 2018 · 2022"
        />
        <Stat
          label="추적 광역단체"
          value={metroRegions.length}
          hint="시·도 전체"
        />
      </section>

      {/* Map + Selected */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
              2022 광역단체장 정당 분포
            </CardTitle>
          </CardHeader>
          <CardBody>
            <KoreaTileMap
              winnersByRegion={winners2022}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: selectedWinner2022
                        ? getParty(selectedWinner2022.party).color
                        : "#5b5b76",
                    }}
                  />
                  {selected.name}
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                {selectedWinner2022 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold tracking-tight">
                          {selectedWinner2022.name}
                        </div>
                        <div className="text-xs text-ink-300">
                          {getParty(selectedWinner2022.party).name} · 2022
                          당선
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold tabular-nums">
                          {formatPercent(selectedWinner2022.voteShare)}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-ink-400">
                          득표율
                        </div>
                      </div>
                    </div>
                    {selectedWinner2022.termAssessment ? (
                      <p className="text-xs text-ink-300 leading-relaxed">
                        {selectedWinner2022.termAssessment.summary}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-ink-300">
                    데이터가 아직 시드되지 않은 지역입니다.
                  </p>
                )}
                <Link
                  to={`/region/${selectedRegion}`}
                  className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:underline"
                >
                  지역 상세 보기 <ArrowRight className="w-3 h-3" />
                </Link>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>2026 후보자 정당별 분포</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={candidates2026ByParty}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      stroke="none"
                    >
                      {candidates2026ByParty.map((entry) => (
                        <Cell key={entry.party} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#14141d",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 11, color: "#bdbdd2" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Live NEC API */}
      <section>
        <TurnoutTrend />
      </section>

      {/* Trends */}
      <section className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>회차별 광역단체장 정당 분포</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partyShareByYear}>
                  <XAxis
                    dataKey="year"
                    stroke="#8b8ba8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#8b8ba8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#14141d",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#bdbdd2" }} />
                  <Bar dataKey="dp" stackId="a" fill={parties.dp.color} name="민주" />
                  <Bar dataKey="ppp" stackId="a" fill={parties.ppp.color} name="국힘" />
                  <Bar dataKey="ind" stackId="a" fill={parties.ind.color} name="무소속" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2018→2022 정당 전환 지역</CardTitle>
          </CardHeader>
          <CardBody>
            {swingRegions.length === 0 ? (
              <p className="text-sm text-ink-300">변동 지역이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {swingRegions.map((s) => {
                  const fromColor = getParty(s.from).color;
                  const toColor = getParty(s.to).color;
                  const isPPPGain = s.to === "ppp" && s.from !== "ppp";
                  return (
                    <li
                      key={s.region.code}
                      className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-12">
                          {s.region.shortName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{
                              background: `${fromColor}33`,
                              color: fromColor,
                              border: `1px solid ${fromColor}55`,
                            }}
                          >
                            {getParty(s.from).shortName}
                          </span>
                          <ArrowRight className="w-3 h-3 text-ink-400" />
                          <span
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{
                              background: `${toColor}33`,
                              color: toColor,
                              border: `1px solid ${toColor}55`,
                            }}
                          >
                            {getParty(s.to).shortName}
                          </span>
                        </div>
                      </div>
                      <span
                        className={
                          isPPPGain
                            ? "text-rose-400 text-xs flex items-center gap-1"
                            : "text-blue-400 text-xs flex items-center gap-1"
                        }
                      >
                        {isPPPGain ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        스윙
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
