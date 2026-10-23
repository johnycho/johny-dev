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
    title: '소개',
    glyph: 'ID',
    href: '/about',
    cta: 'whoami',
    description: <>백엔드 엔지니어 조현준의 경력과 기술, 프로젝트를 소개합니다.</>,
  },
  {
    title: '위키',
    glyph: '{ }',
    href: '/wiki',
    cta: 'cd ./wiki',
    description: <>개발에 필요한 핵심 개념과 지식을 주제별로 정리합니다.</>,
  },
  {
    title: '블로그',
    glyph: '#',
    href: '/blog',
    cta: 'ls ./blog',
    description: <>실무에서 얻은 경험과 관련 지식을 정리하고 공유합니다.</>,
  },
  {
    title: '커뮤니케이션',
    glyph: '>_',
    href: 'https://www.linkedin.com/in/johny-cho',
    cta: 'open linkedin',
    description: <>궁금한 점이나 의견은 LinkedIn으로 편하게 남겨 주세요.</>,
  },
];

function Feature({title, glyph, href, cta, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
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
