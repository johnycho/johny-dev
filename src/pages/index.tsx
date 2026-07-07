import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
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
          <div className={styles.terminalBody}>
            <p className={styles.line}>
              <span className={styles.prompt}>johnycho@dev</span>
              <span className={styles.path}>:~</span>$&nbsp;
              <span className={styles.cmd}>whoami</span>
            </p>
            <p className={styles.output}>{siteConfig.title}</p>

            <p className={styles.line}>
              <span className={styles.prompt}>johnycho@dev</span>
              <span className={styles.path}>:~</span>$&nbsp;
              <span className={styles.cmd}>cat about.md</span>
            </p>
            <p className={styles.output}>개발 지식과 경험을 기록하고 공유합니다.</p>
            <p className={styles.outputMuted}>{siteConfig.tagline} · Backend · JPA · Spring · Kafka · Redis</p>

            <p className={styles.line}>
              <span className={styles.prompt}>johnycho@dev</span>
              <span className={styles.path}>:~</span>$&nbsp;
              <span className={styles.cursor} />
            </p>
          </div>
        </div>

        <div className={styles.ctaRow}>
          <Link className={clsx(styles.ctaBtn, styles.ctaPrimary)} to="/blog">
            $ ls ./blog
          </Link>
          <Link className={clsx(styles.ctaBtn, styles.ctaGhost)} to="/docs/intro">
            $ open ./docs
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
