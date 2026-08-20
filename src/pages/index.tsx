import React, {useState, useEffect, useRef, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

// 터미널에 직접 입력해 실행할 수 있는 명령 → 동작 매핑
const COMMANDS: {match: string[]; to: string; external?: boolean}[] = [
  {match: ['whoami', 'cat about.md', 'open ./about', 'cd ./about', 'cd about'], to: '/about'},
  {match: ['open ./wiki', 'open wiki', 'cd ./wiki', 'cd wiki'], to: '/wiki'},
  {match: ['ls ./blog', 'ls blog', 'cd ./blog', 'open ./blog'], to: '/blog'},
  {match: ['git remote', 'git remote -v'], to: 'https://github.com/johnycho', external: true},
];
// Tab 자동완성 대상(대표 명령)
const COMPLETIONS = COMMANDS.map((c) => c.match[0]);

type OutLine = {text: string; muted?: boolean; banner?: boolean; tag?: boolean; log?: boolean};
type Step = {cmd: string; out: OutLine[]};

// 'JOHNY DEV' ASCII 아트(figlet Small — 얇고 깔끔한 형태) — 라인별 노출
const JOHNY_BANNER_LINES = [
  "     _  ___  _  _ _  ___   __  ___  _____   __",
  "  _ | |/ _ \\| || | \\| \\ \\ / / |   \\| __\\ \\ / /",
  " | || | (_) | __ | .` |\\ V /  | |) | _| \\ V / ",
  "  \\__/ \\___/|_||_|_|\\_| |_|   |___/|___| \\_/  ",
];

function Prompt() {
  return (
    <>
      <span className={styles.prompt}>johnycho@dev</span>
      <span className={styles.path}>:~</span>
      {'$ '}
    </>
  );
}

function OutRow({o}: {o: OutLine}) {
  if (o.banner) {
    return <div className={styles.banner}>{o.text}</div>;
  }
  if (o.log) {
    return <div className={styles.logLine}>{o.text}</div>;
  }
  return (
    <p className={o.tag ? styles.bannerTag : o.muted ? styles.outputMuted : styles.output}>
      {o.text}
    </p>
  );
}

// 애니메이션 종료 후: 사용자가 직접 명령을 입력하면 해당 동작을 수행하는 프롬프트
function InteractivePrompt() {
  const history = useHistory();
  const [value, setValue] = useState('');
  const [log, setLog] = useState<{cmd: string; error?: boolean}[]>([]); // 실행/미인식 명령 히스토리
  const inputRef = useRef<HTMLInputElement>(null);
  const tabRef = useRef<{matches: string[]; idx: number} | null>(null); // Tab 순환 상태

  const complete = () => {
    const st = tabRef.current;
    if (st && st.matches.length && value === st.matches[st.idx]) {
      // 이미 완성된 상태에서 Tab → 다음 후보로 순환
      const idx = (st.idx + 1) % st.matches.length;
      st.idx = idx;
      setValue(st.matches[idx]);
      return;
    }
    const q = value.trimStart().toLowerCase();
    const matches = COMPLETIONS.filter((c) => c.toLowerCase().startsWith(q));
    if (!matches.length) {
      tabRef.current = null;
      return;
    }
    tabRef.current = {matches, idx: 0};
    setValue(matches[0]);
  };

  useEffect(() => {
    // 데스크톱(정밀 포인터)에서만 자동 포커스 — 모바일에서 키보드가 즉시 뜨는 것 방지
    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches) {
      inputRef.current?.focus();
    }
  }, []);

  // 명령이 쌓이면 터미널 높이는 그대로 두고 스크롤로 최신 줄이 보이게
  useEffect(() => {
    const el = inputRef.current?.closest('[class*="terminalBody"]') as HTMLElement | null;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const run = () => {
    const cmd = value.trim().replace(/\s+/g, ' ');
    if (!cmd) return;
    const hit = COMMANDS.find((c) => c.match.includes(cmd.toLowerCase()));
    if (hit) {
      setValue('');
      if (hit.external) {
        // 새 탭으로 열리고 현재 페이지는 유지되므로 실행한 명령을 히스토리에 남긴다
        setLog((prev) => [...prev, {cmd}]);
        window.open(hit.to, '_blank', 'noopener,noreferrer'); // 버튼과 동일하게 새 탭
      } else {
        history.push(hit.to);
      }
      return;
    }
    setLog((prev) => [...prev, {cmd, error: true}]);
    setValue('');
  };

  return (
    <>
      {log.map((entry, i) => (
        <React.Fragment key={i}>
          <p className={styles.line}>
            <Prompt />
            <span className={styles.cmd}>{entry.cmd}</span>
          </p>
          {entry.error && (
            <p className={styles.termOut}>zsh: command not found: {entry.cmd.split(' ')[0]}</p>
          )}
        </React.Fragment>
      ))}
      <p className={styles.termInputLine} onClick={() => inputRef.current?.focus()}>
        <Prompt />
        <span className={styles.cmd}>{value}</span>
        <span className={styles.cursor} />
        {/* 입력 캡처용 투명 오버레이 — 보이는 텍스트는 위 span 이 담당(폭 재계산 없어 떨림 없음) */}
        <input
          ref={inputRef}
          className={styles.termInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault(); // 포커스 이동 대신 자동완성
              complete();
              return;
            }
            // 한글 등 IME 조합 중 Enter는 조합 확정용이므로 명령 실행하지 않음
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) run();
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="터미널 명령 입력 (open ./wiki, ls ./blog, git remote)"
        />
      </p>
    </>
  );
}

// 홈 로드 시 명령어 타이핑 → 출력이 진짜 터미널처럼 라인별로 순차 노출되는 애니메이션
function AnimatedTerminal({steps}: {steps: Step[]}) {
  const [step, setStep] = useState(0); // 현재 명령 인덱스
  const [chars, setChars] = useState(0); // 현재 명령에서 타이핑된 글자 수
  const [outCount, setOutCount] = useState(0); // 현재 명령의 출력 중 노출된 라인 수
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
    (async () => {
      await wait(450);
      for (let s = 0; s < steps.length; s++) {
        if (cancelled) return;
        setStep(s);
        setChars(0);
        setOutCount(0);
        const cmd = steps[s].cmd;
        for (let c = 1; c <= cmd.length; c++) {
          await wait(58);
          if (cancelled) return;
          setChars(c);
        }
        await wait(300);
        if (cancelled) return;
        const out = steps[s].out;
        for (let k = 1; k <= out.length; k++) {
          if (cancelled) return;
          setOutCount(k);
          // 배너(ASCII) 라인은 빠르게, 텍스트 출력은 살짝 느리게
          await wait(out[k - 1].banner ? 70 : 170);
        }
        await wait(520);
        if (cancelled) return;
      }
      if (!cancelled) setFinished(true);
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [steps]);

  return (
    <div className={styles.terminalBody}>
      {steps.map((st, i) => {
        if (i > step) return null;
        const typed = i < step ? st.cmd : st.cmd.slice(0, chars);
        const shownOut = i < step ? st.out.length : i === step ? outCount : 0;
        const typingHere = i === step && outCount === 0 && !finished;
        return (
          <div key={i}>
            <p className={styles.line}>
              <Prompt />
              <span className={styles.cmd}>{typed}</span>
              {typingHere && <span className={styles.cursor} />}
            </p>
            {st.out.slice(0, shownOut).map((o, j) => (
              <OutRow key={j} o={o} />
            ))}
          </div>
        );
      })}
      {finished && <InteractivePrompt />}
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const steps: Step[] = [
    {
      cmd: './gradlew bootRun',
      out: [
        ...JOHNY_BANNER_LINES.map((l) => ({text: l, banner: true})),
        {text: `:: ${siteConfig.title} ::        (v1.0.0)`, tag: true},
      ],
    },
    {
      cmd: 'cat about.md',
      out: [
        {text: '개발 지식과 경험을 기록하고 공유합니다.'},
        {text: 'Spring · JPA · Kafka · Redis · Database · Java · CS · Architecture · AI', muted: true},
      ],
    },
  ];
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.terminal}>
          <div className={styles.terminalBar}>
            <span className={clsx(styles.dot, styles.dotRed)} />
            <span className={clsx(styles.dot, styles.dotYellow)} />
            <span className={clsx(styles.dot, styles.dotGreen)} />
            <span className={styles.terminalTitle}>zsh — johnycho.dev</span>
          </div>
          <AnimatedTerminal steps={steps} />
        </div>

        <div className={styles.ctaRow}>
          <Link className={clsx(styles.ctaBtn, styles.ctaPrimary)} to="/about">
            $ whoami
          </Link>
          <Link className={clsx(styles.ctaBtn, styles.ctaGhost)} to="/wiki">
            $ open ./wiki
          </Link>
          <Link className={clsx(styles.ctaBtn, styles.ctaGhost)} to="/blog">
            $ ls ./blog
          </Link>
          <Link className={clsx(styles.ctaBtn, styles.ctaGhost)} to="https://github.com/johnycho">
            $ git remote
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout description="개발 관련 지식/경험을 공유합니다.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
