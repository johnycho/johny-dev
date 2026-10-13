import React from 'react';
import styles from './HerdrMockup.module.css';

// Herdr TUI(사이드바 + 에이전트 페인)를 재현한 오리지널 목업.
// 실제 스크린샷이 아니며 표시 값은 전부 예시.

type State = 'working' | 'blocked' | 'done' | 'idle';

const LABEL: Record<State, string> = {
  working: 'working',
  blocked: 'blocked',
  done: 'done',
  idle: 'idle',
};

function Badge({state, dim}: {state: State; dim?: boolean}) {
  return (
    <span className={`${styles.badge} ${styles[state]} ${dim ? styles.badgeDim : ''}`}>
      <span className={styles.bdot} />
      {LABEL[state]}
    </span>
  );
}

type Pane = {agent: string; task?: string; state: State; active?: boolean};
type Workspace = {name: string; state: State; open: boolean; panes: Pane[]};

const WORKSPACES: Workspace[] = [
  {
    name: 'api-server',
    state: 'blocked',
    open: true,
    panes: [
      {agent: 'claude code', task: 'refactor auth', state: 'blocked', active: true},
      {agent: 'codex', task: 'write tests', state: 'working'},
      {agent: 'shell', state: 'idle'},
    ],
  },
  {
    name: 'web-frontend',
    state: 'working',
    open: true,
    panes: [
      {agent: 'cursor', task: 'fix layout', state: 'working'},
      {agent: 'claude code', task: 'a11y pass', state: 'done'},
    ],
  },
  {
    name: 'infra',
    state: 'idle',
    open: false,
    panes: [{agent: 'shell', task: 'terraform plan', state: 'idle'}],
  },
];

// 포커스된 페인(api-server · claude code · refactor auth)의 터미널 출력 예시.
const PANE_LINES = [
  {t: 'ok', s: 'Edited  src/auth/token.ts  (+24 −8)'},
  {t: 'ok', s: 'Ran tests — 18 passed'},
  {t: 'gap', s: ''},
  {t: 'ask', s: 'Apply this change to AuthFilter.java?'},
  {t: 'opt', s: '❯ 1. Yes'},
  {t: 'opt', s: '  2. Yes, and don’t ask again'},
  {t: 'opt', s: '  3. No, tell Claude what to do differently'},
  {t: 'gap', s: ''},
  {t: 'wait', s: 'waiting for your approval…'},
];

export default function HerdrMockup() {
  return (
    <>
      <div className={styles.win} aria-label="herdr 터미널 UI 목업">
        <div className={styles.bar}>
          <span className={styles.dots}>
            <span className={styles.dot} style={{background: '#ff5f57'}} />
            <span className={styles.dot} style={{background: '#febc2e'}} />
            <span className={styles.dot} style={{background: '#28c840'}} />
          </span>
          <span className={styles.title}>herdr · ~/work</span>
        </div>

        <div className={styles.body}>
          {/* 사이드바 — 워크스페이스 → 페인, 상태 롤업 */}
          <div className={styles.side}>
            <div className={styles.sideHead}>WORKSPACES</div>
            {WORKSPACES.map((w) => (
              <div key={w.name}>
                <div className={styles.wsRow}>
                  <span className={styles.tw}>{w.open ? '▾' : '▸'}</span>
                  <span className={styles.wsName}>{w.name}</span>
                  <Badge state={w.state} dim />
                </div>
                {w.open &&
                  w.panes.map((p, i) => (
                    <div
                      key={i}
                      className={`${styles.paneRow} ${p.active ? styles.paneActive : ''}`}
                    >
                      <span className={styles.paneAgent}>{p.agent}</span>
                      {p.task && <span className={styles.paneTask}>{p.task}</span>}
                      <span className={styles.spacer} />
                      <span className={`${styles.sdot} ${styles[p.state]}`} />
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* 메인 페인 — 포커스된 에이전트 터미널 */}
          <div className={styles.main}>
            <div className={styles.paneHead}>
              <span className={styles.paneHeadTitle}>claude code · refactor auth</span>
              <Badge state="blocked" />
            </div>
            <div className={styles.term}>
              {PANE_LINES.map((l, i) => {
                if (l.t === 'gap') return <div key={i} className={styles.tgap} />;
                return (
                  <div key={i} className={styles[`t_${l.t}`]}>
                    {(l.t === 'ok') && <span className={styles.tmark}>●</span>}
                    {l.s}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.status}>
          <span className={styles.prefix}>ctrl+b</span>
          <span className={styles.spacer} />
          <span className={styles.count}><span className={`${styles.sdot} ${styles.working}`} /> 2 working</span>
          <span className={styles.count}><span className={`${styles.sdot} ${styles.blocked}`} /> 1 blocked</span>
          <span className={styles.count}><span className={`${styles.sdot} ${styles.done}`} /> 1 done</span>
        </div>
      </div>
      <p className={styles.cap}>
        herdr — 워크스페이스·페인과 에이전트 상태를 한눈에 보는 화면 (오리지널 목업, 실제 스크린샷 아님)
      </p>
    </>
  );
}
