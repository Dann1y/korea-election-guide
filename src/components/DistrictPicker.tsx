// 시·도 → 자치구 선택 위저드.
// 시·도는 정적 17개 dropdown, 자치구는 NEC 기초단체장 API 응답에서
// unique wiwName 추출해 검색 가능한 콤보박스로 표시.

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import { getCandidates } from "@/hooks/useLiveCandidates";
import { metroRegions, getRegion } from "@/data/regions";
import { cn } from "@/lib/cn";

const SG_ID_9TH = "20260603";
// 광역의원(5)은 행정구별로 wiwName이 정확히 분리되어 있음.
// 기초단체장(4)은 시 단위 1명이라 도 지역(고양시·성남시 등)에서 행정구 누락 발생.
const SG_TC_DISTRICT_SOURCE = "5";

// 세종·제주는 기초자치단체 없음
const NO_BASIC_REGIONS = new Set(["KR-50", "KR-49"]);

interface Props {
  initialRegionCode?: string;
  initialWiwName?: string;
  onConfirm: (regionCode: string, wiwName: string) => void;
  onCancel?: () => void;
}

export function DistrictPicker({
  initialRegionCode,
  initialWiwName,
  onConfirm,
  onCancel,
}: Props) {
  const [regionCode, setRegionCode] = useState<string | undefined>(
    initialRegionCode,
  );
  const [wiwName, setWiwName] = useState<string>(initialWiwName ?? "");
  const [wiwList, setWiwList] = useState<string[]>([]);
  const [loadingWiw, setLoadingWiw] = useState(false);
  const [query, setQuery] = useState("");

  const region = regionCode ? getRegion(regionCode) : undefined;
  const noBasic = regionCode ? NO_BASIC_REGIONS.has(regionCode) : false;

  // 시·도 변경 시 자치구 목록 fetch
  useEffect(() => {
    if (!region || noBasic || !region.necSdName) {
      setWiwList([]);
      return;
    }
    let cancelled = false;
    setLoadingWiw(true);
    getCandidates(SG_ID_9TH, SG_TC_DISTRICT_SOURCE, region.necSdName)
      .then((list) => {
        if (cancelled) return;
        const set = new Set<string>();
        for (const c of list) if (c.wiwName) set.add(c.wiwName);
        setWiwList(Array.from(set).sort());
        setLoadingWiw(false);
      })
      .catch(() => {
        if (cancelled) return;
        setWiwList([]);
        setLoadingWiw(false);
      });
    return () => {
      cancelled = true;
    };
  }, [region, noBasic]);

  const filteredWiw = useMemo(() => {
    if (!query.trim()) return wiwList;
    const q = query.trim();
    return wiwList.filter((w) => w.includes(q));
  }, [wiwList, query]);

  const canConfirm = !!regionCode && (noBasic || !!wiwName);

  return (
    <div className="space-y-5">
      {/* Step 1: 시·도 */}
      <div>
        <div className="text-xs text-ink-300 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          시·도 선택
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5">
          {metroRegions.map((r) => (
            <button
              key={r.code}
              onClick={() => {
                setRegionCode(r.code);
                setWiwName("");
                setQuery("");
              }}
              className={cn(
                "px-2 py-2 rounded-lg text-xs sm:text-sm font-medium border transition",
                r.code === regionCode
                  ? "bg-accent-violet/20 border-accent-violet/50 text-white"
                  : "bg-white/[0.02] border-white/5 text-ink-200 hover:border-white/15",
              )}
            >
              {r.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: 자치구 */}
      {regionCode ? (
        <div>
          <div className="text-xs text-ink-300 mb-2">
            {noBasic
              ? "자치구 단위 투표가 없습니다 (세종·제주)"
              : "시·군·구 선택"}
          </div>
          {noBasic ? (
            <p className="text-xs text-ink-300 italic">
              {region?.name}은 기초자치단체가 없어 광역단체장·광역의원·교육감
              투표만 진행됩니다.
            </p>
          ) : loadingWiw ? (
            <div className="text-xs text-ink-300 py-3">자치구 목록 로딩...</div>
          ) : (
            <>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="구·시·군 검색 (예: 성동, 강남)"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-ink-900 border border-white/10 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:border-accent-violet/50"
                />
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-white/5 bg-white/[0.02]">
                {filteredWiw.length === 0 ? (
                  <div className="text-xs text-ink-300 px-3 py-3 italic">
                    매칭되는 자치구가 없습니다.
                  </div>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {filteredWiw.map((w) => (
                      <li key={w}>
                        <button
                          onClick={() => setWiwName(w)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-white/[0.04]",
                            w === wiwName && "bg-accent-violet/10",
                          )}
                        >
                          <span className="text-ink-100">{w}</span>
                          {w === wiwName ? (
                            <Check className="w-3.5 h-3.5 text-accent-violet" />
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel ? (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-ink-300 hover:text-ink-100 hover:bg-white/5 transition"
          >
            취소
          </button>
        ) : null}
        <button
          disabled={!canConfirm}
          onClick={() => {
            if (!regionCode) return;
            onConfirm(regionCode, noBasic ? "" : wiwName);
          }}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition inline-flex items-center gap-1.5",
            canConfirm
              ? "bg-white text-ink-950 hover:bg-ink-100"
              : "bg-white/5 text-ink-400 cursor-not-allowed",
          )}
        >
          <Check className="w-3.5 h-3.5" />
          이 선거구로 저장
        </button>
      </div>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  initialRegionCode?: string;
  initialWiwName?: string;
  onConfirm: (regionCode: string, wiwName: string) => void;
  onClose: () => void;
}

export function DistrictPickerModal({
  open,
  initialRegionCode,
  initialWiwName,
  onConfirm,
  onClose,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={ref}
        className="w-full max-w-xl glass-strong rounded-2xl border border-white/10 shadow-card p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">내 선거구 설정</h2>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-100 p-1"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <DistrictPicker
          initialRegionCode={initialRegionCode}
          initialWiwName={initialWiwName}
          onConfirm={(r, w) => {
            onConfirm(r, w);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
