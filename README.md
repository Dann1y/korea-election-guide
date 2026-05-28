# 한국 선거 안내

내 선거구에서 6·3에 뽑는 모든 후보·공약을 한 페이지에서.
중앙선거관리위원회 공공데이터 기반 비영리 시민 정보 서비스.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Data: NEC](https://img.shields.io/badge/data-NEC%20OpenAPI-blue)](https://www.data.go.kr/)
[![Stack: Vite+React+TS](https://img.shields.io/badge/stack-Vite%20%2B%20React%20%2B%20TS-646cff)](https://vitejs.dev/)

> **참고** — 본 프로젝트는 중앙선거관리위원회의 **공식 사이트가 아닙니다.**
> 공공데이터포털에 공개된 OpenAPI를 시민이 보기 좋게 재구성한 정보 도구입니다.

## 주요 기능

- **내 선거구 검색** — 시·도 → 자치구 선택, localStorage에 저장
- **5종 직책 통합** — 광역단체장 · 기초단체장 · 광역의원 · 기초의원 · 교육감 탭
- **선거구별 그룹핑** — 한 자치구에 여러 선거구가 있는 경우 명확히 분리
- **현역/신규 자동 판별** — 2022 NEC 당선자 명단 매칭으로 현역 표시
- **공약 lazy load** — 카드 클릭 시 NEC 공약 API 호출, sessionStorage 캐시
- **모바일 우선 UI** — 햄버거 드로어, 가로 스크롤 0, Pretendard 폰트

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. NEC API 키 발급 (필수)

[공공데이터포털](https://www.data.go.kr)에서 회원가입 후 아래 7개 데이터셋에
"활용신청" (자동 승인):

| 데이터셋 | 용도 |
| --- | --- |
| [15125467 역대 지방선거 실시상황](https://www.data.go.kr/data/15125467/openapi.do) | 회차별 투표율 |
| [15000897 코드 정보](https://www.data.go.kr/data/15000897/openapi.do) | 선거 ID·선거구 코드 |
| [15000908 후보자 정보](https://www.data.go.kr/data/15000908/openapi.do) | 후보자 인적사항 |
| [15040587 선거공약 정보](https://www.data.go.kr/data/15040587/openapi.do) | 후보별 공약 |
| [15000900 투·개표 정보](https://www.data.go.kr/data/15000900/openapi.do) | 직전 결과 |
| [15000864 당선인 정보](https://www.data.go.kr/data/15000864/openapi.do) | 역대 당선자 |
| [15140045 후보자 통합검색](https://www.data.go.kr/data/15140045/openapi.do) | 이름 검색 |

`.env.example`을 복사해 키 입력:

```bash
cp .env.example .env
```

> data.go.kr은 사용자당 마스터 키 1개를 발급하므로 7개 슬롯에 같은 값을 넣어도 됩니다.

### 3. 개발 서버

```bash
pnpm dev
```

http://localhost:5173 (또는 다른 포트)

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm preview
```

## 기술 스택

- **Vite** + **React 18** + **TypeScript 5**
- **Tailwind CSS** v3 (다크 모드 기반, 글래스모피즘)
- **react-router-dom** v6 SPA 라우팅
- **lucide-react** 아이콘
- **recharts** 차트
- **framer-motion** 인터랙션
- **Pretendard Variable** CDN 폰트

## 디렉토리 구조

```
src/
├── components/         # 재사용 UI
│   ├── ui/             # Card, Pill, Stat, ProgressBar
│   ├── candidate/      # LiveCandidateCard, IncumbentBadge
│   ├── map/            # KoreaTileMap
│   ├── layout/         # AppShell, Footer
│   ├── CandidatesSection.tsx
│   ├── DistrictPicker.tsx
│   ├── DataSourceDialog.tsx
│   └── ...
├── pages/              # MyDistrict, Election2026, History, Home
├── hooks/              # useMyDistrict, useLiveCandidates, useLiveWinners
├── lib/                # nec/ API 클라이언트, district 매칭, cn, format
├── data/               # 정당·지역 마스터, (deprecated) 시드
└── types/              # 도메인 타입
```

## NEC API 클라이언트

`src/lib/nec/` 디렉토리에 데이터셋별로 모듈 분리:

```
src/lib/nec/
├── client.ts       # 공통 fetch wrapper + 에러 처리
├── code.ts         # 코드 정보 (선거 ID, 선거구 코드)
├── candidate.ts    # 후보자 정보 (시·도별 자동 분할 fetch)
├── pledge.ts       # 선거공약 (lazy load, 동시성 제한 4)
├── vote.ts         # 투·개표 정보
├── winner.ts       # 당선인 정보
├── search.ts       # 후보자 통합검색
└── status.ts       # 역대 지방선거 실시상황
```

응답 캐시는 `sessionStorage`에 저장되어 페이지 새로고침 간 NEC 호출 횟수를 줄입니다.

## 정치적 중립성

본 도구는 **특정 정당·후보를 지지하거나 반대하지 않습니다.** 모든 데이터는
NEC OpenAPI에서 가공 없이 받아 표시하며, 검증되지 않은 LLM 시드 데이터는
모두 제거했습니다(`#19`).

**표시하지 않는 정보**:

- 후보자 논란·사건 — 공식 1차 자료 부재
- 공약 이행률 점수 — 표준화된 1차 자료 부재

위 정보는 외부 검색 링크(Google News·NEC info)·매니페스토실천본부 보고서를
직접 확인하도록 안내합니다.

## 기여

기여 방법은 [CONTRIBUTING.md](./CONTRIBUTING.md) 참고. 보안 취약점은
공개 이슈 대신 [SECURITY.md](./SECURITY.md)의 절차를 따라주세요.

## 라이선스

[MIT](./LICENSE). 표시되는 데이터는 중앙선거관리위원회 소유로, 공공데이터
이용약관을 따릅니다.

## 관련 자료

- [중앙선거관리위원회](https://www.nec.go.kr/)
- [NEC 후보자 정보 시스템](https://info.nec.go.kr/)
- [NEC 정책공약마당](https://policy.nec.go.kr/)
- [한국매니페스토실천본부](http://www.manifesto.or.kr/)
- [공공데이터포털](https://www.data.go.kr/)
