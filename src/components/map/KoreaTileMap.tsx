import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { metroRegions } from "@/data/regions";
import { getParty, parties } from "@/data/parties";
import { cn } from "@/lib/cn";
import type { PartyCode } from "@/types";

// 17개 광역을 헥사 그리드 위에 배치. (q, r) 축 좌표 (offset coords).
// 한반도 모양을 단순화해 시각화 강조. 5행 6열 컴팩트 레이아웃.
const HEX_LAYOUT: Record<string, { q: number; r: number }> = {
  // 0행: 북부
  "KR-28": { q: 0, r: 0 }, // 인천
  "KR-11": { q: 1, r: 0 }, // 서울
  "KR-41": { q: 2, r: 0 }, // 경기
  "KR-42": { q: 4, r: 0 }, // 강원
  // 1행: 중부
  "KR-44": { q: 1, r: 1 }, // 충남
  "KR-50": { q: 2, r: 1 }, // 세종
  "KR-43": { q: 3, r: 1 }, // 충북
  "KR-47": { q: 4, r: 1 }, // 경북
  // 2행: 중남부
  "KR-45": { q: 1, r: 2 }, // 전북
  "KR-30": { q: 2, r: 2 }, // 대전
  "KR-27": { q: 3, r: 2 }, // 대구
  "KR-31": { q: 4, r: 2 }, // 울산
  // 3행: 남부
  "KR-29": { q: 1, r: 3 }, // 광주
  "KR-46": { q: 2, r: 3 }, // 전남
  "KR-48": { q: 3, r: 3 }, // 경남
  "KR-26": { q: 4, r: 3 }, // 부산
  // 4행: 제주
  "KR-49": { q: 2, r: 4 }, // 제주
};

interface Props {
  // 지역 코드 → 정당 코드 (색상 칠하기 용)
  winnersByRegion: Record<string, PartyCode | undefined>;
  selectedRegion?: string;
  onSelectRegion: (code: string) => void;
  // 후보가 등록된 지역 마커
  highlightedRegions?: Set<string>;
}

export function KoreaTileMap({
  winnersByRegion,
  selectedRegion,
  onSelectRegion,
  highlightedRegions,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const positions = useMemo(() => {
    const size = 40; // hex radius
    const w = Math.sqrt(3) * size;
    const h = 1.5 * size;
    return metroRegions
      .map((r) => {
        const layout = HEX_LAYOUT[r.code];
        if (!layout) return null;
        const x = w * (layout.q + (layout.r % 2 === 1 ? 0.5 : 0));
        const y = h * layout.r;
        return { region: r, x, y, size };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, []);

  const minX = Math.min(...positions.map((p) => p.x)) - 50;
  const maxX = Math.max(...positions.map((p) => p.x)) + 50;
  const minY = Math.min(...positions.map((p) => p.y)) - 50;
  const maxY = Math.max(...positions.map((p) => p.y)) + 50;
  const viewW = maxX - minX;
  const viewH = maxY - minY;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`${minX} ${minY} ${viewW} ${viewH}`}
        className="w-full h-auto"
        role="img"
        aria-label="대한민국 광역시도 타일 지도"
      >
        <defs>
          <radialGradient id="hex-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {positions.map((p, i) => {
          const party = winnersByRegion[p.region.code];
          const color = party ? getParty(party).color : "#1c1c28";
          const isHover = hovered === p.region.code;
          const isSelected = selectedRegion === p.region.code;
          const isHighlighted = highlightedRegions?.has(p.region.code);
          const hex = hexPath(p.x, p.y, p.size * 0.94);
          return (
            <motion.g
              key={p.region.code}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: i * 0.015,
                duration: 0.25,
                ease: "easeOut",
              }}
              onMouseEnter={() => setHovered(p.region.code)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectRegion(p.region.code)}
              className="cursor-pointer focus:outline-none"
              tabIndex={0}
              role="button"
              aria-label={p.region.name}
            >
              {isSelected ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.size * 1.4}
                  fill="url(#hex-glow)"
                />
              ) : null}
              <path
                d={hex}
                fill={color}
                fillOpacity={isHover || isSelected ? 0.95 : 0.78}
                stroke={
                  isSelected
                    ? "#fff"
                    : isHighlighted
                      ? "#a3e635"
                      : "rgba(255,255,255,0.12)"
                }
                strokeWidth={isSelected ? 2 : isHighlighted ? 1.5 : 1}
                style={{
                  filter: isHover
                    ? "drop-shadow(0 0 12px rgba(139,92,246,0.55))"
                    : undefined,
                  transition: "all 0.18s ease",
                }}
              />
              <text
                x={p.x}
                y={p.y - 2}
                textAnchor="middle"
                fontSize={p.size * 0.34}
                fontWeight={700}
                fill="#fff"
                style={{ pointerEvents: "none" }}
              >
                {p.region.shortName}
              </text>
              <text
                x={p.x}
                y={p.y + p.size * 0.36}
                textAnchor="middle"
                fontSize={p.size * 0.22}
                fill="rgba(255,255,255,0.7)"
                fontWeight={500}
                style={{ pointerEvents: "none" }}
              >
                {party ? getParty(party).shortName : ""}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-2 flex flex-wrap gap-1.5 text-[10px]">
        {(["dp", "ppp", "rp", "jp", "ind"] as PartyCode[]).map((p) => (
          <span
            key={p}
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-white/10 bg-ink-900/60",
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: parties[p].color }}
            />
            <span className="text-ink-200">{parties[p].shortName}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function hexPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${points.join(" L")} Z`;
}
