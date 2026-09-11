import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {findFirstSidebarItemLink} from '@docusaurus/plugin-content-docs/client';
import styles from './DocsBoard.module.css';

const PAGE = 20; // 페이지당 문서 수

type Row = {label: string; href: string};

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

export default function DocsBoard({items}: {items: any[]}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  // 정렬 — null=원래순(사이드바 순서). 제목 헤더 클릭 시 오름→내림→원래순 순환.
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // 사이드바 아이템 → {제목, 링크} (문서 링크 + 하위 카테고리 첫 문서 링크)
  const rows: Row[] = (items ?? [])
    .map((it: any) => {
      const href = it.type === 'category' ? findFirstSidebarItemLink(it) : it.href;
      return {label: it.label as string, href: href as string};
    })
    .filter((r) => !!r.label && !!r.href);

  const q = query.trim().toLowerCase();
  const matched = q ? rows.filter((r) => r.label.toLowerCase().includes(q)) : rows;

  // 정렬 — 제목 오름/내림, 원래순(null)은 사이드바 순서 그대로
  const dir = sortDir === 'asc' ? 1 : -1;
  const sorted =
    sortKey === null ? matched : [...matched].sort((a, b) => dir * a.label.localeCompare(b.label, 'ko'));

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const curPage = Math.min(page, totalPages);
  const startIdx = (curPage - 1) * PAGE;
  const shown = sorted.slice(startIdx, startIdx + PAGE);

  // 제목 헤더 클릭 → 오름 → 내림 → 원래순(null) 3단계 순환
  const changeSort = () => {
    if (sortKey !== 'title') {
      setSortKey('title');
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir('asc');
    }
    setPage(1);
  };

  return (
    <div className={styles.board}>
      <div className={styles.searchRow}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="문서 제목 검색…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          aria-label="문서 검색"
        />
      </div>

      <div className={styles.listHead}>
        <span className={styles.colIndex}>번호</span>
        <button
          type="button"
          className={`${styles.colTitle} ${styles.sortBtn} ${sortKey === 'title' ? styles.sortBtnOn : ''}`}
          onClick={changeSort}
          aria-label="제목(으)로 정렬">
          제목
          <span className={styles.sortStack} aria-hidden="true">
            {/* 위(오름)·아래(내림) 캐럿을 항상 함께 표시하고, 활성 방향만 진하게 */}
            <span className={`${styles.sortUp} ${sortKey === 'title' && sortDir === 'asc' ? styles.sortOn : ''}`}>⌃</span>
            <span className={`${styles.sortDown} ${sortKey === 'title' && sortDir === 'desc' ? styles.sortOn : ''}`}>⌃</span>
          </span>
        </button>
      </div>

      <ul className={styles.list}>
        {shown.map((r, idx) => (
          <li key={r.href}>
            <Link to={r.href} className={styles.row}>
              <span className={styles.rowIndex}>{startIdx + idx + 1}</span>
              <span className={styles.rowTitle}>
                <span className={styles.rowText}>{highlightTitle(r.label, query.trim())}</span>
              </span>
            </Link>
          </li>
        ))}
        {shown.length === 0 && (
          <li className={styles.empty}>
            {q ? `'${query.trim()}' 검색 결과가 없어요.` : '문서가 아직 없어요.'}
          </li>
        )}
      </ul>

      {sorted.length > 0 && renderPager()}
    </div>
  );

  // 블로그 보드와 동일한 윈도우 페이저
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
