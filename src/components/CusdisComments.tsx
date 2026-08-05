import React, {useEffect, useRef, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import {CUSDIS_HOST, CUSDIS_APP_ID} from '@site/src/cusdis';

const SCRIPT_ID = 'cusdis-embed-script';
const STYLE_ID = 'cusdis-brand-style';

// 위젯 UI 한국어화 (SDK 로드 전에 window.CUSDIS_LOCALE 설정)
const KO_LOCALE = {
  powered_by: 'Cusdis 제공',
  post_comment: '등록',
  loading: '로딩중...',
  email: '이메일 (선택)',
  nickname: '이름',
  reply_placeholder: '내용',
  reply_btn: '답글쓰기',
  sending: '전송중...',
  mod_badge: 'Admin',
  content_is_required: '내용이 필요합니다',
  nickname_is_required: '이름이 필요합니다',
  comment_has_been_sent: '댓글이 등록되었습니다.',
};

// 위 comment_has_been_sent 안에 포함된, 제출 완료 감지용 문구
const SENT_MARKER = '등록되었습니다';

// johny-dev 다크/라이트 팔레트 (틸 액센트 + 차콜)
type Theme = 'light' | 'dark';
const PALETTE: Record<Theme, Record<string, string>> = {
  light: {
    bg: '#fafbfb', fg: '#2b2f36', muted: '#6b7178', border: '#dfe1e4',
    inputBg: '#ffffff', accent: '#0e8aa8', accentHover: '#0b7189',
    reply: '#f1f3f4', cardBorder: '#e7eaec',
    adminBg: '#d7eff5', adminFg: '#0b6a82', adminBorder: '#a9dbe6', mention: '#0e8aa8',
    spinTrack: '#e3e6ea',
  },
  dark: {
    bg: '#32353a', fg: '#e5e9ee', muted: '#a2a7ae', border: '#43464d',
    inputBg: '#26282c', accent: '#38cfe6', accentHover: '#63dcee',
    reply: '#282b2f', cardBorder: '#3a3d43',
    adminBg: '#123a46', adminFg: '#7fe0f0', adminBorder: '#1d5566', mention: '#5bd8ec',
    spinTrack: '#3a3d43',
  },
};

// iframe 내부(동일 출처 srcdoc)에 주입할 브랜드 스타일 — 테마별로 생성
function brandCss(theme: Theme): string {
  const c = PALETTE[theme];
  return `
  /* iframe 내부에도 NanumSquareRound 로드 (부모 @font-face 는 상속되지 않음).
     굵기별 실제 폰트(400/700)를 로드해 라벨·버튼·이름 등의 볼드를 또렷하게(가짜볼드 방지) */
  @font-face {
    font-family: 'NanumSquareRound'; font-style: normal; font-weight: 400; font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/innks/NanumSquareRound/NanumSquareRoundR.woff2') format('woff2'),
         url('https://cdn.jsdelivr.net/gh/innks/NanumSquareRound/NanumSquareRoundR.woff') format('woff');
  }
  @font-face {
    font-family: 'NanumSquareRound'; font-style: normal; font-weight: 700; font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/innks/NanumSquareRound/NanumSquareRoundB.woff2') format('woff2'),
         url('https://cdn.jsdelivr.net/gh/innks/NanumSquareRound/NanumSquareRoundB.woff') format('woff');
  }
  /* display: flow-root 로 BFC 를 만들어 자식 상/하 여백이 body 밖으로 새는 것을 막는다
     (body.scrollHeight 로 측정한 높이가 실제 콘텐츠와 일치 → 내부 스크롤 방지) */
  /* 배경은 투명 — 위젯이 놓인 부모(데스크톱=본문 카드 / 모바일=페이지) 색을 그대로 따라 항상 일치 */
  html, body { overflow: hidden !important; background: transparent !important; }
  body {
    font-family: 'NanumSquareRound', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: ${c.fg}; background: transparent; margin: 0; display: flow-root;
  }

  /* 입력창 */
  input, textarea {
    border: 1px solid ${c.border} !important; border-radius: 10px !important;
    padding: 0.5rem 0.65rem !important; font-size: 0.82rem !important;
    background: ${c.inputBg} !important; color: ${c.fg} !important;
    transition: border-color .15s, box-shadow .15s;
  }
  input::placeholder, textarea::placeholder { color: ${c.muted} !important; }
  input:focus, textarea:focus {
    outline: none !important; border-color: ${c.accent} !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, ${c.accent} 22%, transparent) !important;
  }
  label { font-size: 0.8rem !important; color: ${c.muted} !important; font-weight: 700 !important; margin-bottom: .35rem !important; }

  /* 모바일: 닉네임/이메일을 한 줄(세로)로 */
  @media (max-width: 480px) { .grid-cols-2 { grid-template-columns: 1fr !important; } }

  /* 버튼 기본(대댓글 "댓글" 토글 등) — 테두리 있는 pill 버튼 */
  button {
    background: transparent !important; border: 1px solid ${c.border} !important; color: ${c.accent} !important;
    font-weight: 700 !important; font-size: 0.85rem !important;
    padding: .3rem .85rem !important; border-radius: 999px !important;
    cursor: pointer; transition: background .15s, color .15s, border-color .15s;
  }
  button:hover { background: ${c.accent} !important; color: ${c.bg} !important; border-color: ${c.accent} !important; }

  /* 주요 제출 버튼(등록/대댓글 등록) — 액센트 라운드 */
  button.bg-gray-200 {
    background: ${c.accent} !important; color: ${c.bg} !important;
    padding: .45rem 1.3rem !important; border-radius: 999px !important; font-size: 0.84rem !important;
  }
  button.bg-gray-200:hover { background: ${c.accentHover} !important; }
  /* 제출 중: 버튼을 감추고 스피너만 표시 */
  button.bg-gray-200.cusdis-sending {
    background: transparent !important; color: transparent !important; box-shadow: none !important;
    pointer-events: none !important; position: relative !important; min-width: 2.6rem !important;
  }
  button.bg-gray-200.cusdis-sending::after {
    content: '' !important; position: absolute !important; top: 50% !important; left: 50% !important;
    width: 1.15rem !important; height: 1.15rem !important; margin: -.575rem 0 0 -.575rem !important;
    border: 2px solid ${c.spinTrack} !important; border-top-color: ${c.accent} !important; border-radius: 50% !important;
    animation: cusdis-spin .7s linear infinite !important;
  }

  /* 최신 댓글이 아래로 오도록 최상위 목록을 역순 표시 (답글은 카드 내부라 영향 없음) */
  .mt-4 { display: flex !important; flex-direction: column-reverse !important; }
  /* 댓글 카드 — 옅은 하단 구분선(경량화) */
  .mt-4 > .my-4 {
    background: transparent !important; border: 0 !important; border-bottom: 1px solid ${c.cardBorder} !important;
    border-radius: 0 !important; padding: .95rem .15rem !important; margin: 0 !important;
  }
  .mt-4 > .my-4:first-child { border-bottom: 0 !important; } /* column-reverse 라 시각상 맨 아래 */
  /* 답글(대댓글) 카드 — 들여쓰기 + 부드러운 라운드 박스 */
  .my-4 .my-4.pl-4 {
    background: ${c.reply} !important; border: 0 !important;
    border-radius: 12px !important;
    padding: .6rem .85rem .5rem .85rem !important; margin: .4rem 0 .15rem 1.1rem !important;
  }
  /* 작성자 이름 + 관리자 배지 (한 줄) */
  .my-4 > .flex.items-center { align-items: center !important; }
  .flex.items-center .font-medium { color: ${c.accent} !important; font-weight: 700 !important; font-size: 0.8rem !important; margin-right: .15rem !important; }
  /* 하단 메타 줄(날짜 · 답글) */
  .my-4 > .text-sm { color: ${c.muted} !important; font-size: 0.72rem !important; margin: .1rem 0 0 !important; }
  .cusdis-meta { display: flex !important; align-items: center !important; gap: .8rem !important; margin-top: .05rem !important; }
  .cusdis-meta > .text-sm { margin: 0 !important; color: ${c.muted} !important; font-size: 0.72rem !important; }
  .cusdis-meta button:not(.bg-gray-200) {
    background: transparent !important; border: 0 !important; color: ${c.muted} !important;
    font-weight: 500 !important; font-size: 0.7rem !important; padding: 0 !important; border-radius: 0 !important;
  }
  .cusdis-meta button:not(.bg-gray-200):hover { background: transparent !important; color: ${c.accent} !important; }
  .cusdis-fold { display: inline-flex !important; align-items: center !important; gap: .2rem !important; white-space: nowrap !important; }
  .cusdis-fold-ic { width: .95rem !important; height: .95rem !important; transition: transform .2s ease !important; }
  .cusdis-fold.cusdis-fold-open .cusdis-fold-ic { transform: rotate(180deg) !important; }
  /* 관리자 배지 — "Admin" 라벨 */
  .flex.items-center .bg-gray-200 {
    background: ${c.adminBg} !important; color: ${c.adminFg} !important; border: 1px solid ${c.adminBorder} !important;
    width: auto !important; height: auto !important;
    padding: .02rem .34rem !important; margin: 0 0 0 .2rem !important;
    border-radius: 4px !important; display: inline-flex !important; align-items: center !important;
    font-size: .62rem !important; font-weight: 700 !important; line-height: 1.6 !important; letter-spacing: .02em !important;
  }
  /* 답글 @작성자 태그 — 내용 맨 앞 인라인 컬러 태그 */
  .cusdis-mention { color: ${c.mention} !important; font-weight: 700 !important; }
  .cusdis-form-tag {
    display: inline-block !important; background: color-mix(in srgb, ${c.mention} 15%, transparent) !important; color: ${c.mention} !important;
    font-weight: 700 !important; font-size: .8rem !important;
    padding: .15rem .6rem !important; border-radius: 999px !important; margin: 0 0 .5rem !important;
  }
  /* 본문 */
  .my-4 > .my-2 { color: ${c.fg} !important; font-size: 0.8rem !important; line-height: 1.6 !important; margin: .4rem 0 .15rem !important; }
  .my-4 > .my-2 p { margin: 0 !important; font-size: 0.8rem !important; line-height: 1.6 !important; }

  /* 구분 여백 축소 */
  .my-8 { margin: 1.2rem 0 !important; }

  /* 링크 */
  a { color: ${c.accent} !important; }
  /* "Cusdis 제공" 푸터 숨김 */
  .text-center.text-xs { display: none !important; }

  /* 로딩 스피너 */
  @keyframes cusdis-spin { to { transform: rotate(360deg); } }
  .cusdis-spin {
    display: inline-block; width: 26px; height: 26px; border-radius: 50%;
    border: 3px solid ${c.spinTrack}; border-top-color: ${c.accent};
    animation: cusdis-spin .8s linear infinite;
  }
`;
}

function CusdisThread() {
  const location = useLocation();
  const {colorMode} = useColorMode();
  const pageId = location.pathname;
  // 댓글 제출 후 위젯을 깨끗이 재마운트해 새 댓글이 바로 보이게 하는 키
  const [reloadKey, setReloadKey] = useState(0);
  const [reloading, setReloading] = useState(false); // 새로고침 리마운트 중(스타일 적용 전 원본 노출 방지)
  const [settling, setSettling] = useState(true); // 최초 로드 시 스타일·정렬 안정화 전까지 가림(재정렬 깜빡임 방지)
  // 새로고침 중 스레드가 잠깐 0→기본높이→실제높이로 튀는 것 방지: 새로고침 직전 높이로 컨테이너를 고정
  const [frozenHeight, setFrozenHeight] = useState<number | null>(null);
  const lastCountRef = useRef(0); // 마지막 댓글 수 — 새로고침 중 일시적 0으로 헤딩 숫자가 사라지는 것 방지
  const formDraftRef = useRef<{nick: string; content: string} | null>(null); // 새로고침 시 작성 중이던 폼 내용 보존
  // 위젯을 실제로 다시 렌더해야 하는 경우(페이지 이동/새로고침)만 기억 — 테마 변경만으론 재렌더 금지
  const renderRef = useRef<{pageId: string; reloadKey: number}>({pageId: '', reloadKey: -1});

  useEffect(() => {
    const theme: Theme = colorMode === 'dark' ? 'dark' : 'light';
    const w = window as any;
    // 테마 토글만으로는 위젯을 재렌더하지 않는다(재렌더 시 주입 CSS가 사라져 기본폼이 깜빡임).
    const needRender = renderRef.current.pageId !== pageId || renderRef.current.reloadKey !== reloadKey;
    // 다른 글로 이동할 때만 카운트 초기화(새로고침·테마변경 시엔 유지)
    if (renderRef.current.pageId !== pageId) lastCountRef.current = 0;
    renderRef.current = {pageId, reloadKey};
    // 새 렌더(최초/페이지 이동/새로고침)에서만 다시 가림. 테마 토글만으론 가리지 않음.
    if (needRender) setSettling(true);
    if (!document.getElementById(SCRIPT_ID)) {
      // 최초 1회: 한국어 로케일 지정 후 Cusdis 임베드 스크립트 주입(로드 시 자동 렌더)
      w.CUSDIS_LOCALE = KO_LOCALE;
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.async = true;
      s.defer = true;
      s.src = `${CUSDIS_HOST}/js/cusdis.es.js`;
      document.body.appendChild(s);
    } else if (w.CUSDIS && needRender) {
      // 페이지 이동/새로고침 시에만 현재 글 기준으로 다시 렌더 (테마 변경 시엔 스타일만 교체)
      w.CUSDIS.initial();
    }

    // 테마 토글 즉시 반영 — 200ms 폴링(attach)을 기다리지 않고 기존 iframe 스타일을 바로 교체
    // (홈페이지는 CSS 변수로 즉시 전환되므로, 여기서도 동기 교체해 지연을 없앤다)
    try {
      const ex = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement | null;
      const doc = ex && ex.contentDocument;
      if (doc && doc.head) {
        let st = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!st) {
          st = doc.createElement('style');
          st.id = STYLE_ID;
          doc.head.appendChild(st);
        }
        if (st.getAttribute('data-theme') !== theme) {
          st.textContent = brandCss(theme);
          st.setAttribute('data-theme', theme);
        }
      }
    } catch (_) {}

    // --- 높이 자동조정 + 브랜드 스타일 주입 ---
    // Cusdis 위젯은 부모로 resize 메시지를 보낼 때 targetOrigin 을 누락해
    // 최신 브라우저에서 자동 리사이즈가 동작하지 않는다(업스트림 버그).
    // srcdoc iframe 은 동일 출처이므로 내부 문서 높이를 직접 읽어 맞추고,
    // 내부에 브랜드 CSS 도 함께 주입한다.
    let ro: ResizeObserver | undefined;
    let mo: MutationObserver | undefined;
    let iv: ReturnType<typeof setInterval> | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;
    let giveUp: ReturnType<typeof setTimeout> | undefined;
    let secTimer: ReturnType<typeof setTimeout> | undefined;
    let submitTimer: ReturnType<typeof setTimeout> | undefined;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    let revealFallback: ReturnType<typeof setTimeout> | undefined;
    let revealed = false;
    let submitHandled = false;
    let boundIframe: HTMLIFrameElement | undefined;

    // 댓글 데이터를 미리 한 번만 조회 → ① 예상 수(노출 게이트) ② 초단위 날짜 맵(재조회 없이 즉시 적용)
    let expectedCount: number | null = null;
    let flatCache: any[] | null = null;
    (async () => {
      try {
        const r = await fetch(
          `${CUSDIS_HOST}/api/open/comments?appId=${encodeURIComponent(CUSDIS_APP_ID)}&pageId=${encodeURIComponent(pageId)}&page=1`,
        );
        const j = await r.json();
        const flat: any[] = [];
        const walk = (arr: any[]) => (arr || []).forEach((c) => {(flat.push(c), walk((c.replies && c.replies.data) || []));});
        walk((j && j.data && j.data.data) || []);
        flatCache = flat;
        expectedCount = flat.length;
      } catch (_) {
        expectedCount = 0;
      }
      if (boundIframe) {
        showSeconds(boundIframe); // 캐시로 초단위 즉시 적용
        maybeReveal();
      }
    })();

    // 콘텐츠 렌더 후 DOM 변경이 멎으면(정렬·스타일 안정화 완료) 노출 — 디바운스로 재정렬 깜빡임 숨김.
    // 게이트: (1) 폼 렌더 (2) 예상 댓글 수만큼 카드 렌더 (3) 날짜가 초단위까지 확정(정렬·표시 최종).
    const maybeReveal = () => {
      if (revealed || !boundIframe) return;
      const doc = boundIframe.contentDocument;
      if (!doc || !doc.body || !doc.querySelector('textarea')) return; // 폼도 아직이면 대기
      if (expectedCount == null) return; // 예상 수 조회 전
      if (doc.querySelectorAll('.my-4').length < expectedCount) return; // 댓글 아직 덜 그려짐
      // 초 없는(분단위) 날짜가 남아있으면 아직 정렬·표시 확정 전 → 대기
      const unconverted = expectedCount > 0 && [...doc.querySelectorAll('.my-4 div.text-sm')].some((el) =>
        /^\d{4}-\d\d-\d\d \d\d:\d\d$/.test((el.textContent || '').trim()),
      );
      if (unconverted) return;
      if (revealTimer) clearTimeout(revealTimer);
      revealTimer = setTimeout(() => {
        revealed = true;
        setSettling(false);
        setFrozenHeight(null); // 안착 완료 → 고정 해제(실제 높이로 자연스럽게)
      }, 250);
    };
    // 안전망: 변경이 계속돼도 오래 가리지 않도록
    revealFallback = setTimeout(() => {
      revealed = true;
      setSettling(false);
      setFrozenHeight(null);
    }, 6000);

    // 댓글 제출 완료를 감지하면, 자동승인(웹훅) 반영 시간을 준 뒤 위젯을 재마운트한다.
    const maybeReloadAfterSubmit = () => {
      try {
        const txt = boundIframe?.contentDocument?.body?.innerText || '';
        if (!submitHandled && txt.includes(SENT_MARKER)) {
          submitHandled = true;
          submitTimer = setTimeout(() => setReloadKey((k) => k + 1), 2500);
        }
      } catch (_) {}
    };

    const syncHeight = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        const body = doc?.body;
        if (!body) return;
        const h = Math.max(body.scrollHeight, body.offsetHeight);
        const cur = parseInt(iframe.style.height, 10) || 0;
        if (h && Math.abs(h - cur) > 1) iframe.style.height = h + 'px';
      } catch (_) {}
    };

    const replaceLoading = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        const root = doc?.getElementById('root');
        if (!root) return;
        root.querySelectorAll('div').forEach((el) => {
          if (
            el.childElementCount === 0 &&
            /^로딩중/.test((el.textContent || '').trim()) &&
            !(el as HTMLElement).dataset.spun
          ) {
            (el as HTMLElement).dataset.spun = '1';
            el.innerHTML = '<span class="cusdis-spin" role="status" aria-label="로딩중"></span>';
            (el as HTMLElement).style.display = 'flex';
            (el as HTMLElement).style.justifyContent = 'center';
            (el as HTMLElement).style.padding = '1.5rem 0';
          }
        });
      } catch (_) {}
    };

    const updateHeading = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        const n = doc ? doc.querySelectorAll('.my-4 > .flex.items-center').length : 0;
        // 새로고침 리마운트로 일시적으로 0이 되어도 직전 카운트를 유지(숫자·화살표 안 흔들림)
        if (n > 0) lastCountRef.current = n;
        const display = n > 0 ? n : lastCountRef.current;
        const heading = document.getElementById('cusdis-heading');
        if (heading) heading.textContent = display > 0 ? `댓글 ${display}` : '댓글';
      } catch (_) {}
    };

    const pad = (n: number) => String(n).padStart(2, '0');
    const fmtDate = (iso: string, withSec: boolean) => {
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) return null;
      const base = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      return withSec ? `${base}:${pad(dt.getSeconds())}` : base;
    };
    const showSeconds = async (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        // 분단위(초 없음)·초단위 날짜를 모두 수집(문서 순서). 최소 하나가 분단위여야 변환 필요.
        const els = [...doc.querySelectorAll('.my-4 div.text-sm')].filter((el) =>
          /^\d{4}-\d\d-\d\d \d\d:\d\d(:\d\d)?$/.test((el.textContent || '').trim()),
        ) as HTMLElement[];
        const needsConv = els.some((el) => (el.textContent || '').trim().length === 16); // "YYYY-MM-DD HH:MM"
        if (!needsConv) return;
        // 이미 받아둔 캐시가 있으면 재조회 없이 즉시 사용(초 적용 지연 제거), 없으면 조회
        let flat: any[];
        if (flatCache) {
          flat = flatCache;
        } else {
          const res = await fetch(
            `${CUSDIS_HOST}/api/open/comments?appId=${encodeURIComponent(CUSDIS_APP_ID)}&pageId=${encodeURIComponent(pageId)}&page=1`,
          );
          const j = await res.json();
          flat = [];
          const walk = (arr: any[]) => (arr || []).forEach((c) => {(flat.push(c), walk((c.replies && c.replies.data) || []));});
          walk((j && j.data && j.data.data) || []);
        }
        // 같은 이름+분에 여러 댓글이 있으면(루트+본인 대댓글 등) 초가 충돌하므로,
        // (이름|분) → 정렬된 초 목록을 만들고 문서 순서대로 하나씩 배정한다(오래된→최신).
        const groups: Record<string, string[]> = {};
        flat.forEach((c) => {
          const name = ((c.moderator && c.moderator.displayName) || c.by_nickname || '').trim();
          const sec = fmtDate(c.createdAt, true);
          if (!sec) return;
          const key = `${name}|${sec.slice(0, 16)}`;
          (groups[key] ||= []).push(sec);
        });
        Object.values(groups).forEach((a) => a.sort());
        const cursor: Record<string, number> = {};
        els.forEach((el) => {
          const card = el.closest('.my-4');
          const nameEl = card && card.querySelector('.font-medium');
          const name = nameEl ? (nameEl.textContent || '').trim() : '';
          const txt = (el.textContent || '').trim();
          const key = `${name}|${txt.slice(0, 16)}`;
          const arr = groups[key];
          if (!arr || !arr.length) return;
          const i = cursor[key] || 0;
          if (i < arr.length) {
            if (el.textContent !== arr[i]) el.textContent = arr[i];
            cursor[key] = i + 1;
          }
        });
      } catch (_) {}
    };

    const orderReplies = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const tsOf = (el: Element) => {
          const dEl = el.querySelector('div.text-sm');
          const t = dEl ? Date.parse((dEl.textContent || '').trim().replace(' ', 'T')) : NaN;
          return isNaN(t) ? 0 : t;
        };
        doc.querySelectorAll('.mt-4 > .my-4').forEach((card) => {
          const replies = [...card.children].filter(
            (el) => el.classList && el.classList.contains('my-4') && el.classList.contains('pl-4'),
          );
          if (replies.length < 2) return;
          if (tsOf(replies[0]) <= tsOf(replies[replies.length - 1])) return;
          const anchor = replies[replies.length - 1].nextSibling;
          replies
            .slice()
            .reverse()
            .forEach((r) => card.insertBefore(r, anchor));
        });
      } catch (_) {}
    };

    const styleMentions = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.querySelectorAll('.my-4 > .my-2 > p').forEach((p) => {
          if ((p as HTMLElement).getAttribute('data-mention') === '1') return;
          const first = p.firstChild;
          if (!first || first.nodeType !== 3) return;
          const t = (first.textContent || '').trim();
          if (!/^@\S/.test(t)) return;
          const afterFirst = first.nextSibling;
          p.removeChild(first);
          if (afterFirst && afterFirst.nodeName === 'BR') p.removeChild(afterFirst);
          const chip = doc.createElement('span');
          chip.className = 'cusdis-mention';
          chip.textContent = t;
          p.insertBefore(doc.createTextNode(' '), p.firstChild);
          p.insertBefore(chip, p.firstChild);
          (p as HTMLElement).setAttribute('data-mention', '1');
        });
      } catch (_) {}
    };

    const restructureMeta = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.querySelectorAll('.my-4').forEach((card) => {
          if ((card as HTMLElement).getAttribute('data-meta') === '1') return;
          const kids = [...card.children];
          const date = kids.find((c) => c.tagName === 'DIV' && c.classList.contains('text-sm'));
          const content = kids.find((c) => c.tagName === 'DIV' && c.classList.contains('my-2'));
          const metaDiv = [...kids].reverse().find(
            (c) => c.tagName === 'DIV' && !!c.querySelector(':scope > button'),
          );
          if (!date || !metaDiv || date === metaDiv) return;
          metaDiv.insertBefore(date, metaDiv.firstChild);
          (metaDiv as HTMLElement).classList.add('cusdis-meta');
          if (content && content.nextSibling && content.nextSibling !== metaDiv) {
            card.insertBefore(metaDiv, content.nextSibling);
          }
          (card as HTMLElement).setAttribute('data-meta', '1');
        });
      } catch (_) {}
    };

    const repliesOfCard = (card: Element) =>
      [...card.children].filter(
        (c) => c.classList && c.classList.contains('my-4') && c.classList.contains('pl-4'),
      ) as HTMLElement[];
    const applyFold = (card: Element) => {
      const folded = card.getAttribute('data-folded') === '1';
      const replies = repliesOfCard(card);
      replies.forEach((r) => {
        const disp = folded ? 'none' : '';
        if (r.style.display !== disp) r.style.display = disp;
      });
      const btn = card.querySelector(':scope > .cusdis-meta > .cusdis-fold') as HTMLElement | null;
      if (btn) {
        const labelEl = btn.querySelector('.cusdis-fold-label');
        const label = folded ? `답글 ${replies.length}개` : '답글 접기';
        if (labelEl && labelEl.textContent !== label) labelEl.textContent = label;
        btn.classList.toggle('cusdis-fold-open', !folded);
      }
    };
    const setupReplyFold = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.querySelectorAll('.mt-4 > .my-4').forEach((card) => {
          const meta = card.querySelector(':scope > .cusdis-meta');
          const hasReplies = repliesOfCard(card).length > 0;
          let btn = meta ? (meta.querySelector(':scope > .cusdis-fold') as HTMLButtonElement | null) : null;
          if (!meta || !hasReplies) {
            if (btn) btn.remove();
            return;
          }
          if (!btn) {
            btn = doc.createElement('button');
            btn.type = 'button';
            btn.className = 'cusdis-fold';
            btn.innerHTML =
              '<span class="cusdis-fold-label"></span>' +
              '<svg class="cusdis-fold-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
            btn.addEventListener('click', () => {
              card.setAttribute('data-folded', card.getAttribute('data-folded') === '1' ? '0' : '1');
              applyFold(card);
            });
            meta.appendChild(btn);
          }
          applyFold(card);
        });
      } catch (_) {}
    };

    const spinnerOnSubmit = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.querySelectorAll('button.bg-gray-200').forEach((btn) => {
          const sending = (btn.textContent || '').includes('전송중');
          (btn as HTMLElement).classList.toggle('cusdis-sending', sending);
        });
      } catch (_) {}
    };

    const stripFakeBadge = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.querySelectorAll('.flex.items-center .font-medium').forEach((el) => {
          const t = el.textContent || '';
          if (t.includes(KO_LOCALE.mod_badge)) el.textContent = t.split(KO_LOCALE.mod_badge).join('').trim();
        });
      } catch (_) {}
    };

    // 브랜드 스타일 주입/갱신 — 테마가 바뀌면 style 내용을 교체한다.
    const injectStyle = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc || !doc.head) return;
        let st = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!st) {
          st = doc.createElement('style');
          st.id = STYLE_ID;
          doc.head.appendChild(st);
        }
        if (st.getAttribute('data-theme') !== theme) {
          st.textContent = brandCss(theme);
          st.setAttribute('data-theme', theme);
        }
      } catch (_) {}
    };

    const setupForms = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.querySelectorAll('input[name="email"]').forEach((el) => {
          const emailCell = (el as HTMLElement).closest('.px-1') as HTMLElement | null;
          if (!emailCell || emailCell.style.display === 'none') return;
          emailCell.style.display = 'none';
          const row = emailCell.parentElement as HTMLElement | null;
          if (row) row.style.gridTemplateColumns = '1fr';
        });
        doc.querySelectorAll('textarea[name="reply_content"]').forEach((ta) => {
          const pl4 = (ta as HTMLElement).closest('.my-4.pl-4');
          const form = (ta as HTMLElement).closest('.grid') as HTMLElement | null;
          if (!pl4 || !form || form.querySelector('.cusdis-form-tag')) return;
          const nameEl = pl4.querySelector('.font-medium');
          const author = nameEl ? (nameEl.textContent || '').trim() : '';
          if (!author) return;
          const tag = doc.createElement('div');
          tag.className = 'cusdis-form-tag';
          tag.textContent = `↪︎ @${author}`;
          form.insertBefore(tag, form.firstChild);
        });
      } catch (_) {}
    };

    const guardSubmit = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument as (Document & {__submitGuarded?: boolean}) | null;
        if (!doc || doc.__submitGuarded) return;
        doc.__submitGuarded = true;
        doc.addEventListener(
          'click',
          (e) => {
            const btn = (e.target as HTMLElement)?.closest?.('button');
            if (!btn || !btn.classList.contains('bg-gray-200')) return;
            if ((btn.textContent || '').includes('전송중')) {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          },
          true,
        );
      } catch (_) {}
    };

    const repliesData = (c: any) => (c && c.replies && c.replies.data) || [];
    const locate = (list: any[], id: string, root: any = null): any => {
      for (const c of list || []) {
        const curRoot = root || c;
        if (c.id === id) return {root: curRoot, node: c};
        const f = locate(repliesData(c), id, curRoot);
        if (f) return f;
      }
      return null;
    };

    const interceptSubmit = (iframe: HTMLIFrameElement) => {
      try {
        const w2 = iframe.contentWindow as (Window & {fetch: typeof fetch; __submitIntercepted?: boolean}) | null;
        if (!w2 || w2.__submitIntercepted) return;
        w2.__submitIntercepted = true;
        const orig = w2.fetch.bind(w2);
        w2.fetch = async (input: any, init?: any) => {
          try {
            const url = typeof input === 'string' ? input : (input && input.url) || '';
            const method = (init && init.method) || (input && input.method) || 'GET';
            if (/\/api\/open\/comments/.test(url) && String(method).toUpperCase() === 'POST' && init && typeof init.body === 'string') {
              const data = JSON.parse(init.body);
              if (data && typeof data.content === 'string') {
                let changed = false;
                ['nickname', 'by_nickname'].forEach((k) => {
                  if (typeof data[k] === 'string' && data[k].includes(KO_LOCALE.mod_badge)) {
                    data[k] = data[k].split(KO_LOCALE.mod_badge).join('').trim();
                    changed = true;
                  }
                });
                const md = data.content.replace(/\r\n/g, '\n').replace(/\n/g, '  \n');
                if (md !== data.content) {
                  data.content = md;
                  changed = true;
                }
                if (data.parentId) {
                  try {
                    const appId = data.appId || CUSDIS_APP_ID;
                    const pid = data.pageId || data.page_id || '';
                    // 최상위 댓글이 많으면 부모가 뒤 페이지로 밀릴 수 있어, pageCount 끝까지 순회하되 찾으면 조기 종료
                    let loc: ReturnType<typeof locate> = null;
                    let pageCount = 1;
                    for (let page = 1; page <= pageCount; page++) {
                      const r = await orig(
                        `${CUSDIS_HOST}/api/open/comments?appId=${encodeURIComponent(appId)}&pageId=${encodeURIComponent(pid)}&page=${page}`,
                      );
                      const j = await r.json();
                      pageCount = (j && j.data && j.data.pageCount) || pageCount;
                      loc = locate((j && j.data && j.data.data) || [], data.parentId);
                      if (loc && loc.node) break; // 부모 찾음 → 조기 종료
                    }
                    if (loc && loc.node && loc.root && loc.node.id !== loc.root.id) {
                      const author = (loc.node.moderator && loc.node.moderator.displayName) || loc.node.by_nickname || '';
                      data.parentId = loc.root.id;
                      data.content = (author ? `@${author}  \n` : '') + data.content;
                      changed = true;
                    }
                  } catch (_) {}
                }
                if (changed) init = {...init, body: JSON.stringify(data)};
              }
            }
          } catch (_) {}
          return orig(input, init);
        };
      } catch (_) {}
    };

    const restoreDraft = (iframe: HTMLIFrameElement) => {
      try {
        const draft = formDraftRef.current;
        if (!draft) return;
        const doc = iframe.contentDocument;
        if (!doc) return;
        const setVal = (el: HTMLInputElement | HTMLTextAreaElement, v: string) => {
          const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) setter.call(el, v);
          el.dispatchEvent(new Event('input', {bubbles: true}));
        };
        const ta = [...doc.querySelectorAll('textarea')].find((t) => !t.closest('.my-4')) as HTMLTextAreaElement | undefined;
        const nk = [...doc.querySelectorAll('input[name="nickname"]')].find((n) => !n.closest('.my-4')) as HTMLInputElement | undefined;
        if (ta && draft.content) setVal(ta, draft.content);
        if (nk && draft.nick) setVal(nk, draft.nick);
        formDraftRef.current = null;
      } catch (_) {}
    };

    const onReady = () => {
      if (!boundIframe) return;
      injectStyle(boundIframe);
      if (boundIframe.contentDocument?.getElementById(STYLE_ID)) setReloading(false);
      guardSubmit(boundIframe);
      interceptSubmit(boundIframe);
      setupForms(boundIframe);
      restoreDraft(boundIframe);
      replaceLoading(boundIframe);
      syncHeight(boundIframe);
      updateHeading(boundIframe);
      showSeconds(boundIframe);
      orderReplies(boundIframe);
      styleMentions(boundIframe);
      restructureMeta(boundIframe);
      setupReplyFold(boundIframe);
      stripFakeBadge(boundIframe);
      spinnerOnSubmit(boundIframe);
      maybeReveal();
      try {
        const doc = boundIframe.contentDocument;
        if (doc && doc.body) {
          ro?.disconnect();
          mo?.disconnect();
          ro = new ResizeObserver(() => {
            window.requestAnimationFrame(() => boundIframe && syncHeight(boundIframe));
          });
          ro.observe(doc.body);
          mo = new MutationObserver(() => {
            if (!boundIframe) return;
            injectStyle(boundIframe);
            setupForms(boundIframe);
            replaceLoading(boundIframe);
            maybeReloadAfterSubmit();
            orderReplies(boundIframe);
            styleMentions(boundIframe);
            restructureMeta(boundIframe);
            setupReplyFold(boundIframe);
            stripFakeBadge(boundIframe);
            spinnerOnSubmit(boundIframe);
            syncHeight(boundIframe);
            updateHeading(boundIframe);
            maybeReveal();
            if (secTimer) clearTimeout(secTimer);
            secTimer = setTimeout(() => boundIframe && showSeconds(boundIframe), 400);
          });
          mo.observe(doc.body, {subtree: true, childList: true, attributes: true, characterData: true});
        }
      } catch (_) {}
    };

    const attach = () => {
      const thread = document.getElementById('cusdis_thread');
      const iframe = thread?.querySelector('iframe') as HTMLIFrameElement | null;
      if (!iframe) return false;
      boundIframe = iframe;
      iframe.addEventListener('load', onReady);
      onReady();
      let n = 0;
      iv = setInterval(() => {
        if (boundIframe) {
          syncHeight(boundIframe);
          updateHeading(boundIframe);
        }
        if (++n > 20) iv && clearInterval(iv);
      }, 300);
      return true;
    };

    poll = setInterval(() => {
      if (attach()) poll && clearInterval(poll);
    }, 200);
    giveUp = setTimeout(() => poll && clearInterval(poll), 10000);

    return () => {
      poll && clearInterval(poll);
      giveUp && clearTimeout(giveUp);
      iv && clearInterval(iv);
      submitTimer && clearTimeout(submitTimer);
      secTimer && clearTimeout(secTimer);
      revealTimer && clearTimeout(revealTimer);
      revealFallback && clearTimeout(revealFallback);
      ro?.disconnect();
      mo?.disconnect();
      boundIframe?.removeEventListener('load', onReady);
    };
  }, [pageId, reloadKey, colorMode]);

  return (
    <div style={{marginTop: '2.5rem'}}>
      <div className="cusdis-head">
        <h3 id="cusdis-heading" className="cusdis-heading">
          댓글
        </h3>
        <button
          type="button"
          onClick={() => {
            try {
              const ifr = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement | null;
              const d = ifr && ifr.contentDocument;
              if (d) {
                const ta = [...d.querySelectorAll('textarea')].find((t) => !t.closest('.my-4')) as HTMLTextAreaElement | undefined;
                const nk = [...d.querySelectorAll('input[name="nickname"]')].find((n) => !n.closest('.my-4')) as HTMLInputElement | undefined;
                const draft = {nick: nk ? nk.value : '', content: ta ? ta.value : ''};
                formDraftRef.current = draft.nick || draft.content ? draft : null;
              }
            } catch (_) {}
            // 현재 스레드 높이를 고정해 리마운트 중 높이 스파이크(0→기본→실제)를 가림
            try {
              const el = document.getElementById('cusdis_thread');
              const h = el ? Math.round(el.getBoundingClientRect().height) : 0;
              if (h > 0) setFrozenHeight(h);
            } catch (_) {}
            setReloading(true);
            setReloadKey((k) => k + 1);
            setTimeout(() => setReloading(false), 3000);
          }}
          title="댓글 새로고침"
          aria-label="댓글 새로고침"
          className="cusdis-refresh-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>
      <div
        style={{
          position: 'relative',
          // 새로고침 중에는 직전 높이로 고정 + 넘침 숨김 → 중간 높이 스파이크가 안 보임
          ...(frozenHeight != null ? {height: frozenHeight, overflow: 'hidden'} : null),
        }}>
        {(reloading || settling) && (
          <div
            className="cusdis-loading"
            role="status"
            aria-label="댓글 불러오는 중"
            style={{position: 'absolute', inset: 0, background: 'transparent', zIndex: 2}}
          />
        )}
        <div
          key={reloadKey}
          id="cusdis_thread"
          style={{opacity: reloading || settling ? 0 : 1}}
          data-host={CUSDIS_HOST}
          data-app-id={CUSDIS_APP_ID}
          data-page-id={pageId}
          data-page-url={typeof window !== 'undefined' ? window.location.href : ''}
          data-page-title={typeof document !== 'undefined' ? document.title : ''}
        />
      </div>
    </div>
  );
}

export default function CusdisComments() {
  // App ID 미설정 시 위젯을 렌더링하지 않음 (src/cusdis.ts 참고)
  if (!CUSDIS_APP_ID) {
    return null;
  }
  return (
    <BrowserOnly fallback={<div className="cusdis-loading" role="status" aria-label="댓글 불러오는 중" />}>
      {() => <CusdisThread />}
    </BrowserOnly>
  );
}
