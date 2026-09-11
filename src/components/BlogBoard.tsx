import React, {useState, useEffect} from 'react';
import Link from '@docusaurus/Link';
// 블로그 아카이브(전체 글) 생성 데이터 — 아카이브 플러그인 해시는 빌드 간 안정적
import blogPosts from '@generated/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json';
import {fetchViews} from '@site/src/viewCount';
import styles from './BlogBoard.module.css';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const PAGE = 10; // 페이지당 글 수

type Props = {
  /** 특정 태그로 고정해서 보여줄 때 (분류 필터 숨김) */
  lockTag?: {permalink: string; label: string} | null;
  /** 페이지 번호 방식 사용. 기본 true */
  paginate?: boolean;
};

type Entry = {
  permalink: string;
  title: string;
  date: string; // ISO
  description: string; // 본문 도입부(아카이브 데이터에 이미 포함 — 검색용, 추가 로드 없음)
  tags: {label: string; permalink: string}[];
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

// 제목에서 검색어와 일치하는 부분을 하이라이트
function highlightTitle(title: string, q: string): React.ReactNode {
  if (!q) return title;
  const lower = title.toLowerCase();
  const ql = q.toLowerCase();
  if (!lower.includes(ql)) return title;
  const parts: React.ReactNode[] = [];
  let i = 0;
  let idx = lower.indexOf(ql, i);
  let key = 0;
  while (idx !== -1) {
    if (idx > i) parts.push(title.slice(i, idx));
    parts.push(
      <span key={key++} className={styles.hl}>
        {title.slice(idx, idx + q.length)}
      </span>,
    );
    i = idx + q.length;
    idx = lower.indexOf(ql, i);
  }
  if (i < title.length) parts.push(title.slice(i));
  return parts;
}

// 태그 표시 라벨 — 고정 정의 (원본 태그 label → 게시판 표시 라벨)
const TAG_LABEL: Record<string, string> = {
  Kafka: 'Kafka',
  Spring: 'Spring',
  Redis: 'Redis',
  MySQL: 'MySQL',
  Architecture: '아키텍처',
  SystemDesign: '설계',
  '시스템 설계': '설계',
};

// 게시판 컬럼. sortable=true인 컬럼만 헤더 클릭으로 정렬(오름→내림→원래순 3단계). 번호는 정렬 제외.
const COLS: {key: string; label: string; cls: string; sortable: boolean}[] = [
  {key: 'index', label: '번호', cls: 'colIndex', sortable: false},
  {key: 'tag', label: '분류', cls: 'colTag', sortable: true},
  {key: 'title', label: '제목', cls: 'colTitle', sortable: true},
  {key: 'date', label: '작성일', cls: 'colDate', sortable: true},
  {key: 'views', label: '조회수', cls: 'colViews', sortable: true},
];

export default function BlogBoard({lockTag = null, paginate = true}: Props = {}) {
  const [filter, setFilter] = useState<string>('all'); // 'all' | tag.permalink
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>(''); // 검색어
  const [views, setViews] = useState<Record<string, number>>({}); // permalink → 조회수
  // 정렬 — 기본은 작성일 내림차순(최신순). 헤더 클릭 시 오름→내림→원래순(null) 순환.
  const [sortKey, setSortKey] = useState<string | null>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false); // 모바일 정렬 드롭다운

  // 조회수 일괄 조회(1회) — API/Upstash 미설정이면 빈 객체라 조용히 미표시
  useEffect(() => {
    const ids = (blogPosts as any).archive.blogPosts.map((p: any) => p.metadata.permalink);
    fetchViews(ids).then(setViews);
  }, []);

  const posts: Entry[] = (blogPosts as any).archive.blogPosts
    .map((post: any) => ({
      permalink: post.metadata.permalink,
      title: post.metadata.title,
      date: post.metadata.date,
      description: post.metadata.description ?? '',
      tags: (post.metadata.tags ?? []).map((t: any) => ({label: t.label, permalink: t.permalink})),
    }))
    .sort((a: Entry, b: Entry) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 분류 필터: 실제 등장하는 태그들을 개수순으로
  const tagCount = new Map<string, {label: string; permalink: string; count: number}>();
  posts.forEach((p) =>
    p.tags.forEach((t) => {
      const cur = tagCount.get(t.permalink);
      if (cur) cur.count += 1;
      else tagCount.set(t.permalink, {label: t.label, permalink: t.permalink, count: 1});
    }),
  );
  const tagList = [...tagCount.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const select = (key: string) => {
    setFilter(key);
    setPage(1);
  };

  // 1) 분류(태그) 필터
  const base = lockTag
    ? posts.filter((p) => p.tags.some((t) => t.permalink === lockTag.permalink))
    : filter === 'all'
      ? posts
      : posts.filter((p) => p.tags.some((t) => t.permalink === filter));

  // 2) 검색어 필터 — 제목 또는 분류(표시 라벨) 부분일치
  const q = query.trim().toLowerCase();
  const matched = q
    ? base.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => (TAG_LABEL[t.label] ?? t.label).toLowerCase().includes(q)),
      )
    : base;

  // 3) 정렬 — 컬럼 헤더 클릭 / 모바일 드롭다운. 원래순(null)은 기본 순서(작성일 최신순).
  const viewOf = (p: Entry) => views[p.permalink] ?? 0;
  const cmp = (a: Entry, b: Entry) => {
    switch (sortKey) {
      case 'title':
        return a.title.localeCompare(b.title, 'ko');
      case 'tag':
        return (a.tags[0]?.label ?? '').localeCompare(b.tags[0]?.label ?? '', 'ko');
      case 'views':
        return viewOf(a) - viewOf(b);
      default: // date
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  };
  const dir = sortDir === 'asc' ? 1 : -1;
  const sorted =
    sortKey === null
      ? matched
      : [...matched].sort((a, b) => {
          const c = cmp(a, b);
          // 동점이면 항상 최신순으로 안정 정렬
          return c !== 0 ? dir * c : new Date(b.date).getTime() - new Date(a.date).getTime();
        });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const curPage = Math.min(page, totalPages);
  const startIdx = paginate ? (curPage - 1) * PAGE : 0;
  const shown = paginate ? sorted.slice(startIdx, startIdx + PAGE) : sorted.slice(0, PAGE);

  // 헤더 클릭 → 오름 → 내림 → 원래순(null) 3단계 순환. 다른 컬럼이면 오름차순부터.
  const changeSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir('asc');
    }
    setPage(1);
  };
  // 모바일 단일 컨트롤 표시용 유효 상태 (원래순 null → 작성일 내림차순으로 표시)
  const effSortKey = sortKey ?? 'date';
  const effSortDir: 'asc' | 'desc' = sortKey === null ? 'desc' : sortDir;

  return (
    <div className={styles.board}>
      {!lockTag && (
        <div className={styles.searchRow}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="제목·내용·분류 검색…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label="게시판 검색"
          />
        </div>
      )}
      {!lockTag && (
        <div className={styles.filters}>
          <button
            type="button"
            className={`${styles.fbtn} ${filter === 'all' ? styles.fbtnOn : ''}`}
            onClick={() => select('all')}>
            전체<span className={styles.fbtnCount}>{posts.length}</span>
          </button>
          {tagList.map((t) => {
            const slug = t.permalink.split('/').filter(Boolean).pop() ?? '';
            return (
              <button
                key={t.permalink}
                type="button"
                className={`${styles.fbtn} ${styles['t_' + slug] || ''} ${filter === t.permalink ? styles.fbtnOn : ''}`}
                onClick={() => select(t.permalink)}>
                {TAG_LABEL[t.label] ?? t.label}<span className={styles.fbtnCount}>{t.count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 모바일 정렬 컨트롤 — 데스크톱에선 숨김(헤더 클릭으로 정렬) */}
      <div className={styles.mobileSort}>
        <div className={styles.msControl}>
          <div className={styles.msDropdown}>
            <button
              type="button"
              className={styles.msColBtn}
              onClick={() => setSortMenuOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}>
              {COLS.find((c) => c.key === effSortKey)?.label}
            </button>
            {sortMenuOpen && (
              <>
                <div className={styles.msBackdrop} onClick={() => setSortMenuOpen(false)} />
                <ul className={styles.msMenu} role="listbox">
                  {COLS.filter((c) => c.sortable).map((c) => (
                    <li key={c.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={effSortKey === c.key}
                        className={`${styles.msOption} ${effSortKey === c.key ? styles.msOptionOn : ''}`}
                        onClick={() => {
                          setSortKey(c.key);
                          setSortDir(effSortDir);
                          setSortMenuOpen(false);
                          setPage(1);
                        }}>
                        {c.label}
                        {effSortKey === c.key && <span className={styles.msCheck}>✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <span className={styles.msDivider} aria-hidden="true" />
          <button
            type="button"
            className={styles.msDir}
            onClick={() => {
              setSortKey(effSortKey);
              setSortDir(effSortDir === 'asc' ? 'desc' : 'asc');
              setPage(1);
            }}
            aria-label={effSortDir === 'asc' ? '오름차순 — 클릭 시 내림차순' : '내림차순 — 클릭 시 오름차순'}>
            <span style={{display: 'inline-block', transform: effSortDir === 'desc' ? 'rotate(180deg)' : undefined}}>⌃</span>
          </button>
        </div>
      </div>

      <div className={styles.listHead}>
        {COLS.map((c) =>
          c.sortable ? (
            <button
              key={c.key}
              type="button"
              className={`${styles[c.cls]} ${styles.sortBtn} ${sortKey === c.key ? styles.sortBtnOn : ''}`}
              onClick={() => changeSort(c.key)}
              aria-label={`${c.label}(으)로 정렬`}>
              {c.label}
              <span className={styles.sortStack} aria-hidden="true">
                {/* 위(오름)·아래(내림) 캐럿을 항상 함께 표시하고, 활성 방향만 진하게 */}
                <span
                  className={`${styles.sortUp} ${sortKey === c.key && sortDir === 'asc' ? styles.sortOn : ''}`}>
                  ⌃
                </span>
                <span
                  className={`${styles.sortDown} ${sortKey === c.key && sortDir === 'desc' ? styles.sortOn : ''}`}>
                  ⌃
                </span>
              </span>
            </button>
          ) : (
            <span key={c.key} className={styles[c.cls]}>{c.label}</span>
          ),
        )}
      </div>

      <ul className={styles.list}>
        {shown.map((post, idx) => {
          const isNew = Date.now() - new Date(post.date).getTime() <= TWO_WEEKS_MS;
          const tags = post.tags.length ? post.tags : (lockTag ? [lockTag] : []);
          return (
            <li key={post.permalink}>
              <Link to={post.permalink} className={styles.row}>
                <span className={styles.rowIndex}>{startIdx + idx + 1}</span>
                <span className={styles.tagCell}>
                  {tags.map((t) => {
                    const slug = t.permalink.split('/').filter(Boolean).pop() ?? '';
                    return (
                      <span key={t.permalink} className={`${styles.tagChip} ${styles['t_' + slug] || ''}`}>
                        {TAG_LABEL[t.label] ?? t.label}
                      </span>
                    );
                  })}
                </span>
                <span className={styles.rowTitle}>
                  <span className={styles.rowText}>
                    {isNew && <span className={styles.newTag}>NEW</span>}
                    {highlightTitle(post.title, q)}
                  </span>
                </span>
                <span className={styles.rowDate}>{fmtDate(post.date)}</span>
                <span className={styles.rowViews}>
                  {views[post.permalink] != null ? views[post.permalink].toLocaleString('ko-KR') : '–'}
                </span>
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className={styles.empty}>
            {q ? `'${query.trim()}' 검색 결과가 없어요.` : '해당 분류의 글이 아직 없어요.'}
          </li>
        )}
      </ul>

      {paginate && sorted.length > 0 && renderPager()}
    </div>
  );

  // 페이저: 최대 5개 번호 윈도우 + 생략(…) + « ‹ › »
  function renderPager() {
    const WINDOW = 5;
    let winStart = Math.max(1, curPage - Math.floor(WINDOW / 2));
    const winEnd = Math.min(totalPages, winStart + WINDOW - 1);
    winStart = Math.max(1, winEnd - WINDOW + 1);
    const nums = Array.from({length: winEnd - winStart + 1}, (_, i) => winStart + i);
    return (
      <div className={styles.pager}>
        <nav className={styles.pagerGroup} aria-label="페이지 탐색">
          <button type="button" className={styles.pageBtn} onClick={() => setPage(1)} disabled={curPage === 1} aria-label="맨 앞">«</button>
          <button type="button" className={styles.pageBtn} onClick={() => setPage(curPage - 1)} disabled={curPage === 1} aria-label="이전">‹</button>
          {winStart > 1 && <span className={styles.pageEllipsis}>…</span>}
          {nums.map((n) => (
            <button
              key={n}
              type="button"
              className={`${styles.pageBtn} ${n === curPage ? styles.pageBtnOn : ''}`}
              onClick={() => setPage(n)}
              aria-current={n === curPage ? 'page' : undefined}>
              {n}
            </button>
          ))}
          {winEnd < totalPages && <span className={styles.pageEllipsis}>…</span>}
          <button type="button" className={styles.pageBtn} onClick={() => setPage(curPage + 1)} disabled={curPage === totalPages} aria-label="다음">›</button>
          <button type="button" className={styles.pageBtn} onClick={() => setPage(totalPages)} disabled={curPage === totalPages} aria-label="맨 뒤">»</button>
        </nav>
      </div>
    );
  }
}
