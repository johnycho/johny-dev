import React, {useState} from 'react';
import Link from '@docusaurus/Link';
// 블로그 아카이브(전체 글) 생성 데이터 — 아카이브 플러그인 해시는 빌드 간 안정적
import blogPosts from '@generated/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json';
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
  tags: {label: string; permalink: string}[];
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

// 태그 표시 라벨 — 고정 정의 (원본 태그 label → 게시판 표시 라벨)
const TAG_LABEL: Record<string, string> = {
  Kafka: 'Kafka',
  Spring: 'Spring',
  Redis: 'Redis',
  MySQL: 'MySQL',
  Architecture: '아키텍처',
  SystemDesign: '시스템 설계',
};

export default function BlogBoard({lockTag = null, paginate = true}: Props = {}) {
  const [filter, setFilter] = useState<string>('all'); // 'all' | tag.permalink
  const [page, setPage] = useState<number>(1);

  const posts: Entry[] = (blogPosts as any).archive.blogPosts
    .map((post: any) => ({
      permalink: post.metadata.permalink,
      title: post.metadata.title,
      date: post.metadata.date,
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

  const matched = lockTag
    ? posts.filter((p) => p.tags.some((t) => t.permalink === lockTag.permalink))
    : filter === 'all'
      ? posts
      : posts.filter((p) => p.tags.some((t) => t.permalink === filter));

  const totalPages = Math.max(1, Math.ceil(matched.length / PAGE));
  const curPage = Math.min(page, totalPages);
  const startIdx = paginate ? (curPage - 1) * PAGE : 0;
  const shown = paginate ? matched.slice(startIdx, startIdx + PAGE) : matched.slice(0, PAGE);

  return (
    <div className={styles.board}>
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

      <div className={styles.listHead} aria-hidden="true">
        <span className={styles.colIndex}>번호</span>
        <span className={styles.colTag}>분류</span>
        <span className={styles.colTitle}>제목</span>
        <span className={styles.colDate}>날짜</span>
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
                    {post.title}
                  </span>
                </span>
                <span className={styles.rowDate}>{fmtDate(post.date)}</span>
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && <li className={styles.empty}>해당 분류의 글이 아직 없어요.</li>}
      </ul>

      {paginate && matched.length > 0 && renderPager()}
    </div>
  );

  // joylangcenter식 페이저: 최대 5개 번호 윈도우 + 생략(…) + « ‹ › »
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
