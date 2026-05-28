// 슬림한 푸터. 자세한 안내는 상단 "이 서비스 안내" 버튼의 모달에서 한 곳에 표시.

interface Props {
  onOpenInfo: () => void;
}

export function Footer({ onOpenInfo }: Props) {
  return (
    <footer className="mt-10 md:mt-16 border-t border-white/5 px-4 py-5 md:px-6">
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-400">
        <div>
          중앙선거관리위원회 공개 데이터 기반 · 비영리 시민 정보 서비스
        </div>
        <div className="flex items-center gap-3 tabular-nums">
          <button
            onClick={onOpenInfo}
            className="text-ink-300 hover:text-ink-100 underline-offset-2 hover:underline"
          >
            이 서비스 안내
          </button>
          <span>© 2026 한국 선거 안내</span>
        </div>
      </div>
    </footer>
  );
}
