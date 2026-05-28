import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, Loader2, Vote } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { useElectionStatuses } from "@/hooks/useElectionStatuses";

export function TurnoutTrend() {
  const { data, loading, error, hasKey } = useElectionStatuses();

  // 지방선거 회차 (제1회 1995 이후) 위주로, 동시지방선거만 필터.
  // 데이터 형식이 다양해서 가장 보편적인 매핑만 적용.
  const chartData = useMemo(() => {
    const filtered = data.filter(
      (d) =>
        d.year >= 1995 &&
        d.turnout !== undefined &&
        (d.name.includes("지방선거") || d.name.includes("전국동시")),
    );
    return filtered.map((d) => ({
      year: d.year,
      turnout: Math.round((d.turnout ?? 0) * 1000) / 10,
      name: d.round ?? d.name,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Vote className="w-3.5 h-3.5 text-accent-cyan" />
          역대 지방선거 투표율 추이
          <span className="ml-2 text-[10px] font-normal text-ink-300">
            1995 — 2022
          </span>
        </CardTitle>
      </CardHeader>
      <CardBody>
        {!hasKey ? null : loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} />
        ) : chartData.length === 0 ? (
          <EmptyData />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="turnoutFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  stroke="#8b8ba8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8b8ba8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[40, 70]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#14141d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}%`, "투표율"]}
                  labelFormatter={(l) => `${l}년`}
                />
                <Area
                  type="monotone"
                  dataKey="turnout"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#turnoutFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}


function Loading() {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-300 py-6 justify-center">
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
      데이터 불러오는 중...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
      <div className="text-xs text-ink-300">
        <div className="text-rose-300 font-medium mb-0.5">
          데이터를 불러올 수 없습니다
        </div>
        {message}
      </div>
    </div>
  );
}

function EmptyData() {
  return (
    <div className="text-xs text-ink-300 py-6 text-center">
      조건에 맞는 데이터가 없습니다.
    </div>
  );
}
