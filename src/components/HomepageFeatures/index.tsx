import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  glyph: string;
  href: string;
  cta: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '레퍼런스',
    glyph: '{ }',
    href: '/docs/intro',
    cta: 'open ./docs',
    description: <>CS · Java · Spring · JPA · Database 등 정리된 개념과 지식을 주제별로 찾아봅니다.</>,
  },
  {
    title: '인사이트',
    glyph: '#',
    href: '/blog',
    cta: 'ls ./blog',
    description: <>실무에서 부딪힌 문제와 해결 과정에서 얻은 깨달음을 글로 남깁니다.</>,
  },
  {
    title: 'Communication',
    glyph: '>_',
    href: 'https://github.com/johnycho',
    cta: 'git remote',
    description: <>피드백과 이야기는 언제나 환영입니다. GitHub에서 만나요.</>,
  },
];

function Feature({title, glyph, href, cta, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={href} className={styles.card}>
        <span className={styles.cardGlyph}>{glyph}</span>
        <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
        <p className={styles.cardDesc}>{description}</p>
        <span className={styles.cardCta}>
          <span className={styles.cardPrompt}>$</span> {cta}
        </span>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.sectionKicker}>~/johnycho.dev</span>
          <Heading as="h2" className={styles.sectionTitle}>
            무엇을 찾고 계신가요?
          </Heading>
        </div>
        <div className={clsx('row', styles.row)}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
