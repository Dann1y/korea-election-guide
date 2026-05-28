import { useMemo } from "react";
import {
  AlertCircle,
  Building,
  Building2,
  ExternalLink,
  GraduationCap,
  Landmark,
  Loader2,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { LiveCandidateCard } from "@/components/candidate/LiveCandidateCard";
import { useCandidates } from "@/hooks/useLiveCandidates";
import { useWinners } from "@/hooks/useLiveWinners";
import { IncumbentBadge, NewcomerLinks } from "@/components/candidate/IncumbentBadge";
import { matchBasicHead, matchByWiwExact } from "@/lib/district";
import type { NECCandidate } from "@/lib/nec";

const SG_ID_9TH = "20260603";
const SG_ID_8TH = "20220601";

const ICON_BY_TC: Record<string, typeof Landmark> = {
  "3": Landmark,
  "4": Building2,
  "5": Users,
  "6": Building,
  "11": GraduationCap,
};

export interface SectionProps {
  sgTypecode: string;
  label: string;
  sdName: string;
  filterWiwName?: string;
  matchMode?: "basic" | "exact";
  // 한 자치구 안에 여러 선거구가 있는 경우(광역의원·기초의원),
  // sggName(예: "종로구제1선거구")으로 그룹핑해서 표시.
  groupBySgg?: boolean;
  emptyHint?: string;
}

export function CandidatesSection({
  sgTypecode,
  label,
  sdName,
  filterWiwName,
  matchMode,
  groupBySgg,
  emptyHint,
}: SectionProps) {
  const Icon = ICON_BY_TC[sgTypecode] ?? Landmark;
  const { candidates, loading, error } = useCandidates(
    SG_ID_9TH,
    sgTypecode,
    sdName,
  );
  const { winners } = useWinners(SG_ID_8TH, sgTypecode, sdName);

  const filtered = useMemo(() => {
    if (!filterWiwName || !matchMode) return candidates;
    if (matchMode === "basic") {
      return candidates.filter((c) => matchBasicHead(c, filterWiwName));
    }
    return candidates.filter((c) => matchByWiwExact(c, filterWiwName));
  }, [candidates, filterWiwName, matchMode]);

  // 선거구(sggName)별 그룹핑
  const groups = useMemo(() => {
    if (!groupBySgg) {
      return [{ sggName: "", candidates: filtered }];
    }
    const map = new Map<string, NECCandidate[]>();
    for (const c of filtered) {
      const key = c.sggName || "(선거구 미상)";
      const arr = map.get(key) ?? [];
      arr.push(c);
      map.set(key, arr);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([sggName, candidates]) => ({ sggName, candidates }));
  }, [filtered, groupBySgg]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Icon className="w-4 h-4 text-accent-violet" />
          {label}
          <span className="ml-auto text-[11px] font-normal text-ink-300 tabular-nums">
            {loading ? "로딩…" : `${filtered.length}명`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-ink-300 py-4 justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            후보 정보 불러오는 중...
          </div>
        ) : error ? (
          <div className="text-xs text-rose-300">데이터 오류: {error}</div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-ink-300 italic">
            {emptyHint ?? "등록된 후보가 없습니다."}
          </p>
        ) : (
          <>
            {groupBySgg && groups.length > 1 ? (
              <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] px-3 py-2 flex items-start gap-2 text-[11px] text-ink-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  이 자치구는{" "}
                  <span className="text-amber-300 font-medium">
                    {groups.length}개 선거구
                  </span>
                  로 나뉩니다. 본인이 속한 선거구만 골라서 확인하세요. 본인
                  선거구를 모르면{" "}
                  <a
                    href="https://info.nec.go.kr/main/main_load.xhtml"
                    target="_blank"
                    rel="noopener"
                    className="text-accent-cyan hover:underline inline-flex items-center gap-0.5"
                  >
                    NEC 후보자 정보 시스템
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  에서 주소로 조회하거나 선거공보를 참고하세요.
                </div>
              </div>
            ) : null}

            {groups.map((g) => (
              <div key={g.sggName} className="space-y-3">
                {groupBySgg ? (
                  <div className="sticky top-14 md:top-14 z-10 -mx-4 md:-mx-5 px-4 md:px-5 py-2 bg-ink-900/85 backdrop-blur-xl border-y border-white/5 flex items-center justify-between">
                    <div className="text-xs md:text-sm font-semibold text-ink-100">
                      {g.sggName}
                    </div>
                    <div className="text-[10px] tabular-nums text-ink-300">
                      후보 {g.candidates.length}명
                    </div>
                  </div>
                ) : null}
                <div className="grid gap-3">
                  {g.candidates.map((c) => (
                    <div key={c.huboid} className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <IncumbentBadge
                          candidate={c}
                          prevWinners={winners}
                        />
                        {!winners.some((w) => w.name === c.name) ? (
                          <NewcomerLinks name={c.name} />
                        ) : null}
                      </div>
                      <LiveCandidateCard
                        sgId={SG_ID_9TH}
                        sgTypecode={sgTypecode}
                        candidate={c}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </CardBody>
    </Card>
  );
}
