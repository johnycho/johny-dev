import {useState, useEffect, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

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
      {finished && (
        <p className={styles.line}>
          <Prompt />
          <span className={styles.cursor} />
        </p>
      )}
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
          <Link className={clsx(styles.ctaBtn, styles.ctaPrimary)} to="/wiki">
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
