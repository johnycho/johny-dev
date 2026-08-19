# Vercel 배포 정책 (johny-utils)

## 규칙
**Vercel 배포는 실행 전 반드시 사용자에게 물어보고, 승인받은 뒤에만 진행한다.**
사용자가 명시적으로 "배포해줘"라고 요청한 경우가 아니면 임의로 배포하지 않는다.

해당 명령(예):
- `vercel`, `vercel --prod`, `npx vercel …`
- 환경변수 변경 후 재배포(`vercel --prod`)

## 왜
- Vercel 배포는 **즉시 운영에 반영**되는 외부 공개 작업이라, 되돌리기 전 영향이 생길 수 있다.
- 커밋/푸시와 마찬가지로 사용자 확인을 거친다(→ [git-account.md](git-account.md) 커밋·푸시 정책과 동일한 취지).

## 대상 프로젝트
- `tools/johny-utils` — johny-dev 전용 유틸 서버리스 함수 (Vercel, 독립 관리)
  - 프로덕션 별칭: `https://johny-utils.vercel.app`
  - 엔드포인트:
    - `/api/webhook` — Cusdis 웹훅(새 댓글 → 자동승인 + Slack 알림)
    - `/api/slack-action` — Slack 인터랙션(버튼/모달)
    - `/api/view-count` — 게시글 조회수 카운터(Upstash Redis)

## 환경변수 (Production)
- `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID`, `SLACK_SIGNING_SECRET`, `CUSDIS_APP_ID` — 중계용
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` (또는 `UPSTASH_REDIS_REST_URL` / `_TOKEN`) — 스레드 중첩 + **조회수** 공용 Upstash Redis
- env 는 배포 시점에 주입되므로 **값 변경 후에는 반드시 `vercel --prod` 재배포**(이 재배포도 사용자 확인 후).

## 프로덕션 URL만 사용
- `npx vercel` 이 출력하는 프리뷰(해시) URL(`...-<해시>-<계정>.vercel.app`)은 **쓰지 않는다** — Deployment Protection 로그인(302)에 막힌다.
- 항상 프로덕션 별칭 `https://johny-utils.vercel.app` 사용. 확인: `curl -s -o /dev/null -w "%{http_code}"` → **405**면 공개(정상), **302**면 보호된 URL.

## 참고
- **홈페이지(Docusaurus)** 배포는 GitHub Pages 파이프라인으로 별개다. Vercel 배포는 위 유틸 함수 전용.
