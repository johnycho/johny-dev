import React from 'react';

// '유지 크기(retained heap)' 개념도 — 점선 상자로 "지우면 함께 사라지는 범위"를 직접 그림.
// 오리지널 일러스트(스크린샷 아님). 테마 대응은 사이트 CSS 변수 사용.

const chipBase: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.32rem 0.62rem',
  borderRadius: '8px',
  border: '1px solid var(--site-card-border)',
  fontWeight: 600,
  fontSize: '0.85rem',
};

const rootChip: React.CSSProperties = {
  ...chipBase,
  background: 'var(--site-card-bg)',
  color: 'var(--site-muted)',
};

const objChip: React.CSSProperties = {
  ...chipBase,
  background: 'var(--site-accent-soft)',
  borderColor: 'var(--site-accent)',
};

const dashedBox: React.CSSProperties = {
  position: 'relative',
  border: '2px dashed #e0757e',
  borderRadius: '10px',
  padding: '1.15rem 0.9rem 0.85rem',
  marginTop: '0.15rem',
  maxWidth: '440px',
};

const dashedLabel: React.CSSProperties = {
  position: 'absolute',
  top: '-0.72em',
  left: '12px',
  background: 'var(--ifm-background-color, var(--site-card-bg))',
  padding: '0 6px',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#e0757e',
  whiteSpace: 'nowrap',
};

const children: React.CSSProperties = {
  marginTop: '0.55rem',
  marginLeft: '0.5rem',
  color: 'var(--site-muted)',
  fontFamily: 'var(--ifm-font-family-monospace, monospace)',
  fontSize: '0.82rem',
  lineHeight: 1.75,
};

export default function RetainedHeapDiagram() {
  return (
    <div style={{margin: '1rem 0'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem'}}>
        <span style={rootChip}>GC 루트 — static 필드·스레드 등</span>
        <span style={{marginLeft: '1.1rem', color: 'var(--site-muted)', fontSize: '0.8rem'}}>↓ 참조</span>
        <div style={dashedBox}>
          <span style={dashedLabel}>이 상자 전체 = 캐시 Map의 ‘유지 크기’(retained)</span>
          <div style={objChip}>
            캐시 Map <span style={{color: 'var(--site-muted)', fontWeight: 400}}>(의심 객체)</span>
          </div>
          <div style={children}>
            <div>├─ 엔트리 수천 개</div>
            <div>└─ 엔트리가 가리키는 value 객체들</div>
          </div>
        </div>
      </div>
      <p style={{color: 'var(--site-muted)', fontSize: '0.75rem', marginTop: '0.55rem'}}>
        점선 상자를 지우면 그 안이 <b>전부 함께</b> 사라진다 — 그 합이 <b>유지 크기</b>. (반면 <b>얕은 크기</b>는 캐시 Map 껍데기 하나뿐)
      </p>
    </div>
  );
}
