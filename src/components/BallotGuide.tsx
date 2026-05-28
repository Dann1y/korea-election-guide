import {
  Building,
  Building2,
  GraduationCap,
  Landmark,
  Users,
  Vote,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";

// 9회 지방선거에서 유권자가 받는 투표용지.
// 광역시(서울/부산/대구/인천/광주/대전/울산)·세종은 4~6장,
// 도(경기/강원/충북/충남/전북/전남/경북/경남/제주)는 7장.
// 교육감은 정당 공천 없는 별도 투표.

interface Ballot {
  icon: typeof Vote;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  count: string;
}

const BALLOTS: Ballot[] = [
  {
    icon: Landmark,
    title: "광역단체장",
    subtitle: "시·도지사",
    description: "서울시장·부산시장 등 17개 시·도 행정의 수장",
    color: "#8b5cf6",
    count: "17명 선출",
  },
  {
    icon: Building2,
    title: "기초단체장",
    subtitle: "시장·군수·구청장",
    description: "시·군·자치구의 행정 책임자 (세종·제주 제외)",
    color: "#22d3ee",
    count: "226명 선출",
  },
  {
    icon: Users,
    title: "광역의원",
    subtitle: "시·도의원 (지역구)",
    description: "광역의회 지역구 의원",
    color: "#e879f9",
    count: "약 779명",
  },
  {
    icon: Vote,
    title: "광역의원 비례",
    subtitle: "시·도의원 (비례대표)",
    description: "정당 득표율에 따른 비례 배분",
    color: "#f472b6",
    count: "약 93명",
  },
  {
    icon: Building,
    title: "기초의원",
    subtitle: "시·군·구의원 (지역구)",
    description: "기초의회 지역구 의원 (세종·제주 제외)",
    color: "#a3e635",
    count: "약 2,602명",
  },
  {
    icon: Vote,
    title: "기초의원 비례",
    subtitle: "시·군·구의원 (비례대표)",
    description: "기초 비례대표 (세종·제주 제외)",
    color: "#84cc16",
    count: "약 386명",
  },
  {
    icon: GraduationCap,
    title: "교육감",
    subtitle: "시·도 교육감",
    description: "정당 공천 없음. 진보/보수 진영 후보 경쟁",
    color: "#fbbf24",
    count: "17명 선출",
  },
];

export function BallotGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Vote className="w-3.5 h-3.5 text-accent-violet" />
          6·3 지방선거 투표용지 7장
          <span className="ml-2 text-[10px] font-normal text-ink-300">
            광역시 4~6장 · 도 7장
          </span>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-3">
          {BALLOTS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-3 md:p-4 hover:border-white/15 transition overflow-hidden"
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition"
                  style={{ background: b.color }}
                />
                <div
                  className="relative w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: `${b.color}1a`,
                    border: `1px solid ${b.color}33`,
                    color: b.color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="relative">
                  <div className="text-sm font-semibold tracking-tight">
                    {b.title}
                  </div>
                  <div className="text-[11px] text-ink-300 mb-2">
                    {b.subtitle}
                  </div>
                  <p className="text-xs text-ink-200 leading-relaxed min-h-[2.5rem]">
                    {b.description}
                  </p>
                  <div className="mt-2 text-[10px] tabular-nums font-medium text-ink-300">
                    {b.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-ink-300 leading-relaxed">
          <span className="text-ink-100 font-medium">참고</span> · 세종특별자치시·제주특별자치도는
          기초자치단체가 없어 기초단체장·기초의원 투표가 없습니다. 광역시(서울/부산
          등)는 광역의원·기초의원·교육감 등 4~6장, 도 지역은 7장의 투표용지를 받습니다.
        </div>
      </CardBody>
    </Card>
  );
}
