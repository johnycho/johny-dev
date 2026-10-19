import React from 'react';
import styles from './DiagramDesignDemo.module.css';

// diagram-design(cathrynlavery/diagram-design)의 "에디토리얼" 스타일과
// 반응형 모델(viewBox + overflow-x:auto 래퍼 + svg min-width)을 재현한 테스트용 샘플.
// 실제 스킬 출력이 아니라, 그 출력 규격을 그대로 흉내 낸 손수 작성 SVG.

// 에디토리얼 팔레트(그림자 없음·2색 중심)
const INK = '#2d3142';
const MUTED = '#4f5d75';
const ACCENT = '#bf4520';

function Node({x, y, w, h, title, sub}: {x: number; y: number; w: number; h: number; title: string; sub: string}) {
  const cx = x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#faf9f7" stroke={INK} strokeWidth={1} />
      <text x={cx} y={y + h / 2 - 2} fill={INK} fontSize={15} textAnchor="middle" className={styles.mono}>
        {title}
      </text>
      <text x={cx} y={y + h / 2 + 16} fill={MUTED} fontSize={11} textAnchor="middle" className={styles.mono}>
        {sub}
      </text>
    </>
  );
}

function Edge({x1, y1, x2, y2, label, lx, ly}: {x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number}) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} markerEnd="url(#dd-arrow)" />
      <text x={lx} y={ly} fill={MUTED} fontSize={11} textAnchor="middle" className={styles.mono}>
        {label}
      </text>
    </>
  );
}

export default function DiagramDesignDemo() {
  return (
    <>
      <div className={styles.container}>
        <svg
          viewBox="0 0 900 340"
          role="img"
          aria-labelledby="dd-title dd-desc"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
          <title id="dd-title">요청 처리 아키텍처</title>
          <desc id="dd-desc">브라우저가 API 서버를 호출하고, API는 PostgreSQL과 Redis를 사용한다.</desc>

          <defs>
            <pattern id="dd-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={INK} opacity="0.1" />
            </pattern>
            <marker id="dd-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L7,3 L0,6" fill="none" stroke={MUTED} strokeWidth="1" />
            </marker>
          </defs>

          <rect width="900" height="340" fill="#f5f5f3" />
          <rect width="900" height="340" fill="url(#dd-dots)" />

          {/* eyebrow */}
          <text x="48" y="36" fill={ACCENT} fontSize="11" letterSpacing="2" className={styles.mono}>
            ARCHITECTURE · 테스트
          </text>

          {/* nodes */}
          <Node x={48} y={132} w={168} h={76} title="브라우저" sub="Client" />
          <Node x={366} y={118} w={190} h={104} title="API 서버" sub="Spring Boot" />
          <Node x={700} y={56} w={170} h={76} title="PostgreSQL" sub="주 저장소" />
          <Node x={700} y={208} w={170} h={76} title="Redis" sub="캐시" />

          {/* edges */}
          <Edge x1={216} y1={170} x2={362} y2={170} label="HTTPS" lx={289} ly={160} />
          <Edge x1={556} y1={150} x2={696} y2={100} label="SQL" lx={636} ly={116} />
          <Edge x1={556} y1={190} x2={696} y2={240} label="GET / SET" lx={640} ly={230} />
        </svg>
      </div>
      <p className={styles.cap}>
        diagram-design 스타일·반응형 모델 재현 (테스트용 샘플 — 실제 스킬 출력 아님)
      </p>
    </>
  );
}
