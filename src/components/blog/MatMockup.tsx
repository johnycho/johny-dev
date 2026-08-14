import React from 'react';
import styles from './MatMockup.module.css';

// Eclipse MAT 뷰(도미네이터 트리 / 히스토그램 / Path to GC Roots)를 흉내 낸 오리지널 목업.
// 실제 스크린샷이 아니며 표시 값은 전부 예시.

const TABS = ['Overview', 'Histogram', 'Dominator Tree', 'Leak Suspects'];

function Chrome({
  title = 'heapdump.hprof — Memory Analyzer',
  activeTab,
  children,
}: {
  title?: string;
  activeTab?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.win} aria-label={title}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <span className={styles.dot} style={{background: '#ff5f57'}} />
          <span className={styles.dot} style={{background: '#febc2e'}} />
          <span className={styles.dot} style={{background: '#28c840'}} />
        </span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <span key={t} className={`${styles.tab} ${t === activeTab ? styles.tabActive : ''}`}>
            {t}
          </span>
        ))}
      </div>
      <div className={styles.scroll}>{children}</div>
    </div>
  );
}

// ── 도미네이터 트리 ──
type DomRow = {depth: number; name: string; objects: string; shallow: string; retained: string; pct: number; toggle: '▼' | '▶' | ''};
const DOM: DomRow[] = [
  {depth: 0, name: 'com.example.cache.ProductCache', objects: '1', shallow: '32 B', retained: '512 MB', pct: 68, toggle: '▼'},
  {depth: 1, name: 'ConcurrentHashMap  map', objects: '1', shallow: '48 B', retained: '508 MB', pct: 67, toggle: '▼'},
  {depth: 2, name: 'ConcurrentHashMap$Node[]  table', objects: '1', shallow: '5 MB', retained: '505 MB', pct: 67, toggle: '▼'},
  {depth: 3, name: 'com.example.model.Product  × 1,240,000', objects: '1.24M', shallow: '59 MB', retained: '470 MB', pct: 62, toggle: ''},
  {depth: 0, name: 'byte[]', objects: '1,300,000', shallow: '180 MB', retained: '180 MB', pct: 24, toggle: '▶'},
  {depth: 0, name: 'java.lang.String', objects: '3,100,000', shallow: '74 MB', retained: '120 MB', pct: 16, toggle: '▶'},
];

export default function MatDominatorTree() {
  return (
    <>
      <Chrome activeTab="Dominator Tree">
        <div className={styles.thead}>
          <span>Class Name</span>
          <span className={styles.num}>Objects</span>
          <span className={styles.num}>Shallow</span>
          <span className={styles.num}>Retained</span>
          <span className={styles.num}>%</span>
        </div>
        {DOM.map((r, i) => (
          <div className={styles.row} key={i}>
            <span className={styles.cls} style={{paddingLeft: `${r.depth * 1.1}rem`}}>
              <span className={styles.tw}>{r.toggle}</span>
              <span className={styles.clsName}>{r.name}</span>
            </span>
            <span className={`${styles.num} ${styles.muted}`}>{r.objects}</span>
            <span className={`${styles.num} ${styles.muted}`}>{r.shallow}</span>
            <span className={styles.num}>{r.retained}</span>
            <span className={styles.pctWrap}>
              <span className={styles.pctBar}>
                <span className={styles.pctFill} style={{width: `${r.pct}%`}} />
              </span>
              <span className={styles.pctNum}>{r.pct}%</span>
            </span>
          </div>
        ))}
      </Chrome>
      <p className={styles.cap}>MAT — 도미네이터 트리 화면 (예시)</p>
    </>
  );
}

// ── 히스토그램 ──
type HistRow = {name: string; objects: string; shallow: string; retained: string};
const HIST: HistRow[] = [
  {name: 'com.example.model.Product', objects: '1,240,000', shallow: '59 MB', retained: '470 MB'},
  {name: 'java.lang.String', objects: '3,100,000', shallow: '74 MB', retained: '120 MB'},
  {name: 'byte[]', objects: '1,300,000', shallow: '180 MB', retained: '180 MB'},
  {name: 'char[]', objects: '3,050,000', shallow: '96 MB', retained: '96 MB'},
  {name: 'java.util.concurrent.ConcurrentHashMap$Node', objects: '1,240,000', shallow: '40 MB', retained: '40 MB'},
];

export function MatHistogram() {
  return (
    <>
      <Chrome activeTab="Histogram">
        <div className={styles.hhead}>
          <span>Class Name</span>
          <span className={styles.num}>Objects</span>
          <span className={styles.num}>Shallow</span>
          <span className={styles.num}>Retained</span>
        </div>
        {HIST.map((r, i) => (
          <div className={styles.hrow} key={i}>
            <span className={styles.clsName}>{r.name}</span>
            <span className={styles.num}>{r.objects}</span>
            <span className={`${styles.num} ${styles.muted}`}>{r.shallow}</span>
            <span className={styles.num}>{r.retained}</span>
          </div>
        ))}
      </Chrome>
      <p className={styles.cap}>MAT — 히스토그램 화면 (예시)</p>
    </>
  );
}

// ── Path to GC Roots ──
type PathRow = {depth: number; icon: string; name: string; field?: string; root?: boolean};
const PATH: PathRow[] = [
  {depth: 0, icon: '◆', name: 'com.example.model.Product @ 0x76b3a08'},
  {depth: 1, icon: '↑', name: 'ConcurrentHashMap$Node', field: 'value'},
  {depth: 2, icon: '↑', name: 'ConcurrentHashMap$Node[]', field: '[i]'},
  {depth: 3, icon: '↑', name: 'ConcurrentHashMap', field: 'table'},
  {depth: 4, icon: '↑', name: 'com.example.cache.ProductCache', field: 'map'},
  {depth: 5, icon: '★', name: 'ProductCache.INSTANCE', field: 'static field', root: true},
];

export function MatPathToGCRoots() {
  return (
    <>
      <Chrome title="Path to GC Roots — Product @ 0x76b3a08" activeTab="Dominator Tree">
        {PATH.map((r, i) => (
          <div className={`${styles.pathRow} ${r.root ? styles.rootRow : ''}`} key={i} style={{paddingLeft: `${0.7 + r.depth * 1.15}rem`}}>
            <span className={styles.pathIcon}>{r.icon}</span>
            <span className={styles.pathName}>{r.name}</span>
            {r.field && <span className={styles.pathField}>&nbsp;·&nbsp;{r.field}</span>}
            {r.root && <span className={styles.rootTag}>GC ROOT</span>}
          </div>
        ))}
      </Chrome>
      <p className={styles.cap}>MAT — Path to GC Roots 화면 (예시): 객체(위)에서 GC 루트(아래)까지 참조 사슬</p>
    </>
  );
}
