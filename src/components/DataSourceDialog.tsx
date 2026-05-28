// 데이터 출처·정치 중립성·1차 자료·면책을 한 곳에 모은 모달.
// AppShell 상단의 "데이터 출처" 버튼으로 진입.

import { useEffect } from "react";
import { ExternalLink, Info, Shield, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DataSourceDialog({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl glass-strong rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-card max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-ink-900/80 border-b border-white/5 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-accent-violet" />
            <h2 className="text-sm font-semibold tracking-tight">
              이 서비스에 대하여
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-300 hover:text-ink-100 hover:bg-white/5"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* 정치 중립성 */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-accent-violet" />
              <h3 className="text-sm font-semibold">정치적 중립성</h3>
            </div>
            <p className="text-xs leading-relaxed text-ink-200">
              본 사이트는{" "}
              <span className="text-ink-100 font-medium">
                특정 정당·후보를 지지하거나 반대하지 않습니다
              </span>
              . 중앙선거관리위원회 공개 데이터를 가공 없이 그대로 표시하며,
              시민의 알권리와 정치적 참여를 돕는 정보 제공 목적으로만
              운영됩니다. 모든 평가와 선택은 시민 본인의 판단에 따릅니다.
            </p>
          </section>

          <div className="h-px bg-white/5" />

          {/* 사용 데이터 */}
          <section>
            <h3 className="text-sm font-semibold mb-2">사용 데이터</h3>
            <ul className="text-xs text-ink-300 space-y-1.5 leading-relaxed">
              <li>
                · <span className="text-ink-100">후보자 정보</span> (이름·정당·기호·학력·경력) —
                중앙선거관리위원회
              </li>
              <li>
                · <span className="text-ink-100">후보 공약</span> — 중앙선거관리위원회 정책공약마당
                (6·3 이전: 모든 후보 / 이후: 당선자만 제공)
              </li>
              <li>
                · <span className="text-ink-100">직전(2022) 당선자</span> — 중앙선거관리위원회
              </li>
              <li>
                · <span className="text-ink-100">역대 투표율</span> — 중앙선거관리위원회
              </li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* 표시하지 않는 정보 */}
          <section>
            <h3 className="text-sm font-semibold mb-2">표시하지 않는 정보</h3>
            <ul className="text-xs text-ink-300 space-y-1.5 leading-relaxed">
              <li>
                · <span className="text-ink-100">후보자 논란·사건</span> — 공식 1차 자료가 없어 표시하지 않습니다.
                후보 카드의 "관련 뉴스 직접 검색" 링크로 직접 확인해주세요.
              </li>
              <li>
                · <span className="text-ink-100">공약 이행률 점수</span> — 표준화된 1차 자료가 없어 표시하지 않습니다.
                한국매니페스토실천본부 평가 보고서를 직접 참고해주세요.
              </li>
            </ul>
          </section>

          <div className="h-px bg-white/5" />

          {/* 1차 자료 */}
          <section>
            <h3 className="text-sm font-semibold mb-2">1차 자료 직접 확인</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Source
                href="https://info.nec.go.kr/"
                title="NEC 후보자 정보 시스템"
                desc="전과·재산·납세 등 공식 신고 정보"
              />
              <Source
                href="https://policy.nec.go.kr/"
                title="NEC 정책공약마당"
                desc="후보가 공식 등록한 공약 원문 PDF"
              />
              <Source
                href="http://www.manifesto.or.kr/"
                title="한국매니페스토실천본부"
                desc="현역의 임기 공약 이행 평가 보고서"
              />
              <Source
                href="https://www.nec.go.kr/"
                title="중앙선거관리위원회"
                desc="투표 안내·선거 일정·법규"
              />
            </div>
          </section>

          <div className="h-px bg-white/5" />

          {/* 면책 */}
          <section>
            <h3 className="text-sm font-semibold mb-2">면책</h3>
            <p className="text-[11px] leading-relaxed text-ink-400">
              본 도구는 중앙선거관리위원회 공공데이터를 활용한 비영리 시민
              정보 서비스입니다. 후보 등록·사퇴, 공약 변경 등은 NEC 시스템
              갱신에 따라 자동 반영되며, 일시적 데이터 누락이 있을 수 있습니다.
              중요한 의사결정 시 위 1차 자료를 직접 확인해주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Source({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 hover:border-white/15 transition"
    >
      <div className="flex items-center gap-1 text-xs text-ink-100 font-medium mb-0.5">
        {title}
        <ExternalLink className="w-3 h-3" />
      </div>
      <div className="text-[11px] text-ink-300 leading-relaxed">{desc}</div>
    </a>
  );
}
