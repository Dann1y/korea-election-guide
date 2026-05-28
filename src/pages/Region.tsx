import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import {
  getCurrentByRegion,
  getHistoricalByRegion,
} from "@/data";
import { getRegion } from "@/data/regions";

export function RegionPage() {
  const { code } = useParams<{ code: string }>();
  const region = code ? getRegion(code) : undefined;

  const historical = useMemo(
    () =>
      code
        ? getHistoricalByRegion(code).filter((c) => c.isWinner)
        : [],
    [code],
  );
  const current = useMemo(
    () => (code ? getCurrentByRegion(code) : []),
    [code],
  );

  if (!region) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="text-sm text-ink-300 hover:text-ink-100 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> 홈으로
        </Link>
        <p className="text-ink-200">존재하지 않는 지역입니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <Link
          to="/"
          className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3 h-3" /> 대시보드
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{region.name}</h1>
        <p className="text-sm text-ink-300 mt-1">
          {region.englishName} · {region.code}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>2026 등록 후보</CardTitle>
        </CardHeader>
        <CardBody>
          {current.length === 0 ? (
            <p className="text-sm text-ink-300">시드된 후보가 없습니다.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {current.map((c) => (
                <CandidateCard key={c.id} candidate={c} variant="current" />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>역대 당선자</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {historical
              .sort((a, b) => b.electionYear - a.electionYear)
              .map((c) => (
                <div key={c.id} className="relative">
                  <div className="absolute -top-2 left-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ink-700 border border-white/10">
                      {c.electionYear}
                    </span>
                  </div>
                  <CandidateCard candidate={c} variant="historical" />
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
