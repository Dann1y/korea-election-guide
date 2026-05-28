# 보안 정책

## 취약점 신고

보안 취약점을 발견하셨다면 **공개 이슈를 만들지 마시고** 다음 절차를 따라주세요.

1. GitHub의 [Private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
   기능으로 신고 (저장소 → Security 탭 → "Report a vulnerability")
2. 또는 메인테이너에게 직접 비공개 채널로 연락

응답 목표: **72시간 이내**. 심각도에 따라 패치 일정을 알려드립니다.

## 시크릿 관리

- **`.env` 파일은 절대 커밋하지 마세요.** `.gitignore`에 포함되어 있습니다.
- NEC API 키가 노출되면 즉시 [공공데이터포털](https://www.data.go.kr/) 마이페이지에서
  키를 재발급하세요.
- 빌드 결과물(`dist/`)에 키가 포함되지 않도록 — Vite는 `VITE_*` 환경변수를 빌드 시점에
  번들에 inline합니다. 이는 **퍼블릭 도구에 의도된 동작**이지만, 노출 가능성을 인지해주세요.

## 사용자 데이터

본 도구는 다음과 같이 사용자 데이터를 처리합니다.

- **localStorage** (`myDistrict.v1`) — 사용자가 입력한 "내 선거구"만 저장.
  외부 전송 없음. 사용자가 직접 삭제 가능.
- **sessionStorage** — NEC API 응답 캐시. 탭 닫으면 자동 삭제.
- **쿠키·트래커·analytics 없음** — 본 프로젝트는 사용자 추적 도구를 사용하지 않습니다.
- **백엔드 서버 없음** — 모든 NEC API 호출은 사용자 브라우저에서 직접 발생합니다.

## 알려진 한계

- NEC OpenAPI 응답은 NEC 서버에 의존하므로 일시적 가용성 문제가 발생할 수 있습니다.
- 행정동 → 선거구 매핑은 NEC가 공식 API로 제공하지 않아, 시민이 본인 선거구를
  직접 확인해야 합니다(NEC 후보자 정보 시스템 또는 선거공보).
