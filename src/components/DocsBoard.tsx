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

  // 사이드바 아이템 → {제목, 링크} (문서 링크 + 하위 카테고리 첫 문서 링크)
  const rows: Row[] = (items ?? [])
    .map((it: any) => {
      const href = it.type === 'category' ? findFirstSidebarItemLink(it) : it.href;
      return {label: it.label as string, href: href as string};
    })
    .filter((r) => !!r.label && !!r.href);

  const q = query.trim().toLowerCase();
  const matched = q ? rows.filter((r) => r.label.toLowerCase().includes(q)) : rows;

  const totalPages = Math.max(1, Math.ceil(matched.length / PAGE));
  const curPage = Math.min(page, totalPages);
  const startIdx = (curPage - 1) * PAGE;
  const shown = matched.slice(startIdx, startIdx + PAGE);

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

      <div className={styles.listHead} aria-hidden="true">
        <span className={styles.colIndex}>번호</span>
        <span className={styles.colTitle}>제목</span>
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

      {matched.length > 0 && renderPager()}
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
