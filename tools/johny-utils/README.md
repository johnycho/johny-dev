# johny-utils — johny-dev 유틸 서버리스 함수 (Vercel)

johny-dev 전용으로 **독립**된 Vercel 서버리스 함수 모음입니다(Cusdis App ID·Slack 앱·Vercel 프로젝트·Upstash를 전용으로 사용). 프로덕션 별칭: `https://johny-utils.vercel.app`.

| 엔드포인트 | 역할 |
|---|---|
| `POST /api/webhook` | 새 댓글 → 자동 승인 + Slack 알림([답글]/[삭제] 버튼) |
| `POST /api/slack-action` | Slack 버튼/모달 → 삭제·답글 처리 → Cusdis |
| `GET·POST /api/view-count` | 게시글 조회수 카운터(Upstash `INCR`/`MGET`) |

## 1) Cusdis → Slack 중계

새 댓글이 달리면 ① **자동 승인(공개)** 하고 ② Slack 채널로 알림 + **[답글]/[삭제] 버튼**을 보냅니다.

```
새 댓글 → Cusdis Webhook → api/webhook → ①자동승인 + ②Slack 알림([답글][삭제] 버튼)
Slack 버튼 클릭 → api/slack-action → 삭제 / 답글(모달) 처리 → Cusdis
```

- **[🗑 삭제]**: 확인 후 해당 댓글 삭제 (원본 메시지 갱신, 하위 대댓글 연쇄 삭제)
- **[↩︎ 답글]**: 모달에 답글 입력 → 관리자 답글로 등록

## 2) 게시글 조회수 (`api/view-count`)

- `POST /api/view-count { id: "/blog/..." }` → 해당 글 +1, 최신값 반환
- `GET  /api/view-count?ids=/blog/a,/blog/b` → 여러 글 일괄 조회
- 저장소는 webhook 과 **같은 Upstash Redis**(`KV_REST_API_URL`/`KV_REST_API_TOKEN`). 키는 `views:<permalink>`.
- 중복 방지(기기당 하루 1회)는 프런트(`src/viewCount.ts`, localStorage)에서 판단. 프런트 표시는 `src/components/ViewCount.tsx`(상세) + `BlogBoard`(목록).

## 환경변수

| 이름 | 용도 | 필수 |
|---|---|---|
| `SLACK_BOT_TOKEN` | chat.postMessage(알림·스레드) + 모달(views.open)용 봇 토큰 `xoxb-...` | ✅ |
| `SLACK_CHANNEL_ID` | 알림 보낼 채널 ID (스레드 중첩에 필요) | ✅ |
| `SLACK_SIGNING_SECRET` | Slack 인터랙션 서명 검증(버튼/모달) | ✅ |
| `CUSDIS_APP_ID` | 루트 댓글 조회·연쇄 삭제·답글 id 조회용 App ID (**johny-dev 것**: `50a7e943-2931-424e-ac08-0c02d6d44309`) | ✅ |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` (또는 `UPSTASH_REDIS_REST_URL` / `_TOKEN`) | Upstash Redis — 댓글ID→슬랙 메시지 매핑(스레드 중첩) | 스레드 중첩 시 |
| `SLACK_WEBHOOK_URL` | 봇 토큰·채널이 없을 때 폴백(Incoming Webhook, 스레드 불가) | 선택 |
| `SITE_URL` | 게시글 링크 도메인 (기본 `https://johnycho.dev`) | 선택 |

## 1. Slack 앱 만들기

1. https://api.slack.com/apps → **Create New App** → *From scratch* → 앱 이름(예: `johny-dev comments`) / 워크스페이스 선택.
2. **Basic Information → App Credentials → Signing Secret** 복사 = `SLACK_SIGNING_SECRET`.
3. **OAuth & Permissions → Bot Token Scopes** 에 `chat:write`, `chat:write.public` 추가 → 상단 **Install to Workspace** → **Bot User OAuth Token**(`xoxb-...`) 복사 = `SLACK_BOT_TOKEN`.
4. 알림 받을 채널의 **Channel ID** 확인(채널 우클릭 → 채널 세부정보 하단) = `SLACK_CHANNEL_ID`. (비공개 채널이면 `/invite @앱이름` 으로 봇 초대)
5. (배포 후) **Interactivity & Shortcuts → Interactivity ON → Request URL** 에 `https://<프로젝트>.vercel.app/api/slack-action` 입력 → 저장.

## 2. 이 폴더만 Vercel 에 배포

```bash
cd tools/johny-cusdis-slack-relay
npx vercel                               # 최초 배포 (Vercel 로그인 · 새 프로젝트로 생성)
npx vercel env add SLACK_BOT_TOKEN       # (Production)
npx vercel env add SLACK_CHANNEL_ID      # (Production)
npx vercel env add SLACK_SIGNING_SECRET  # (Production)
npx vercel env add CUSDIS_APP_ID         # (Production) → 50a7e943-2931-424e-ac08-0c02d6d44309
npx vercel --prod                        # env 추가/변경 후에는 반드시 재배포!
```

배포 후 함수 주소(**프로덕션 별칭** 사용):

```
https://<프로젝트이름>.vercel.app/api/webhook
```

> ⚠️ **반드시 프로덕션 URL 사용** — `npx vercel` 이 출력하는 `...-<해시>-<계정>.vercel.app` **프리뷰 URL 은 로그인 보호(Deployment Protection)** 때문에 웹훅이 302 로 막힙니다.
> 확인: `curl -s -o /dev/null -w "%{http_code}" https://<프로젝트이름>.vercel.app/api/webhook` → **405** 면 정상(공개), **302** 면 보호된 URL.

## 3. Cusdis 에 Webhook 연결

Cusdis 대시보드 → **johny-dev website** → **Settings** → **Webhook URL** 에 `https://<프로젝트이름>.vercel.app/api/webhook` 입력 → 스위치 ON → 저장.

## 테스트

블로그 글에 댓글 → ① 즉시 공개 + ② Slack 알림([답글][삭제] 버튼) 도착 확인.
처리 결과는 원본 알림의 **스레드**에 남습니다.

---

### 참고 — Vercel 없이 개인 DM (Telegram)

Slack 대신 개인 DM 이면 중계 함수 없이 됩니다: https://t.me/CusdisBot → `/gethook` → 나온 URL 을 Cusdis Settings 의 Webhook URL 에 붙여넣기.
