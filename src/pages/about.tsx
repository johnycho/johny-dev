import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './about.module.css';
import CusdisComments from '../components/CusdisComments';
import {
  NAME, ROLE, TAGLINE, CONTACTS, ABOUT, EXPERIENCE, PROJECTS, STRENGTHS,
  SKILLS, TROUBLES, EDUCATION, CERTS, OPENSOURCE, ACTIVITIES, boldSegments,
} from '../components/resume/data';

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);
const BlogIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);
function CompanyLogo({file, big, git}: {file: string; big?: boolean; git?: boolean}) {
  const src = useBaseUrl(`/img/logos/${file}`);
  return (
    <span className={`${styles.coLogo} ${big ? styles.coLogoBig : ''} ${git ? styles.coLogoGit : ''} ${file === 'interon.svg' ? styles.coLogoXl : ''}`}>
      <img src={src} alt="" loading="lazy" />
    </span>
  );
}

const DevIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /><path d="m8.5 8.5-2 2 2 2" /><path d="M13 8.5h3" />
  </svg>
);
const ExtIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" />
  </svg>
);

const ExamIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3v2h6V3" /><path d="m8.5 13 2 2 4-4" />
  </svg>
);

// Cred: 로고 박스 + 기관명/상세 + 상태(現/前/졸업 등) 뱃지
function Cred({logo, icon, org, detail, status, big}: {logo?: string; icon?: ReactNode; org: string; detail?: string; status?: string; big?: boolean}) {
  const src = useBaseUrl(`/img/logos/${logo ?? ''}`);
  const tone = status === '現' ? styles.stCurrent : status === '前' ? styles.stPast : styles.stCred;
  return (
    <div className={styles.cred}>
      <span className={`${styles.credMark} ${icon ? styles.credMarkIcon : ''}`}>
        {icon ? icon : <img className={`${styles.credLogo} ${big ? styles.credLogoBig : ''} ${(logo === 'oracle.svg' || logo === 'forca.png') ? styles.credLogoXl : ''}`} src={src} alt="" loading="lazy" />}
      </span>
      <div className={styles.credText}>
        <span className={styles.credOrg}>{org}</span>
        {detail && <span className={styles.credDetail}>{detail}</span>}
      </div>
      {status && <span className={`${styles.status} ${tone}`}>{status}</span>}
    </div>
  );
}

// 강조 렌더: **볼드**는 <b>, ==하이라이트==는 <mark> (용도별 분리)
function rich(str: string): ReactNode {
  return boldSegments(str).map((seg, i) => {
    if (seg.mark) return <mark key={i}>{seg.text}</mark>;
    if (seg.bold) return <b key={i}>{seg.text}</b>;
    return <React.Fragment key={i}>{seg.text}</React.Fragment>;
  });
}

function ActivityRow({a}: {a: {name: string; detail: string; logo?: string; url?: string; icon?: string}}) {
  const logoSrc = useBaseUrl(`/img/logos/${a.logo ?? ''}`);
  return (
    <div className={styles.cred}>
      {a.logo
        ? <span className={styles.credMark}><img className={styles.credLogo} src={logoSrc} alt="" loading="lazy" /></span>
        : <span className={`${styles.credMark} ${styles.credMarkIcon}`}><DevIcon /></span>}
      <div className={styles.credText}>
        {a.url
          ? <a className={styles.orgLink} href={a.url} target="_blank" rel="noreferrer">{a.name}<ExtIcon /></a>
          : <span className={styles.credOrg}>{a.name}</span>}
        <span className={styles.credDetail}>{a.detail}</span>
      </div>
    </div>
  );
}

export default function About(): ReactNode {
  return (
    <Layout title="소개" description="백엔드 엔지니어 조현준 — 경력·기술·프로젝트 소개">
      <main className={styles.page}>
        <div className={styles.wrap}>
          <header className={styles.hero}>
            <h1 className={styles.name}>{NAME}</h1>
            <p className={styles.role}>{ROLE}</p>
            <p className={styles.tagline}>{TAGLINE}</p>
            <div className={styles.contacts}>
              <a className={styles.contactBtn} href={CONTACTS.github} target="_blank" rel="noreferrer">
                <GitHubIcon /> GitHub
              </a>
              <a className={styles.contactBtn} href={CONTACTS.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon /> LinkedIn
              </a>
              <a className={styles.contactBtn} href={`mailto:${CONTACTS.email}`}>
                <MailIcon /> Email
              </a>
              <BrowserOnly>
                {() => {
                  const {ResumeDownloadButton} = require('../components/resume/ResumePdf');
                  return <ResumeDownloadButton className={styles.contactBtn} />;
                }}
              </BrowserOnly>
            </div>
          </header>

          <section className={styles.section}>
            <h2 className={styles.h2}>About Me</h2>
            {ABOUT.map((p, i) => (
              <p key={i} className={styles.p}>{rich(p)}</p>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Experience</h2>
            <div className={styles.exp}>
              {EXPERIENCE.map((e) => (
                <article key={e.company} className={styles.expItem}>
                  <div className={styles.expHead}>
                    <CompanyLogo file={e.logo} big={e.big} git={e.git} />
                    <div className={styles.credText}>
                      <div className={styles.companyRow}>
                        <span className={styles.company}>
                          {e.company}{e.jp && <span className={styles.jp}> {e.jp}</span>}
                        </span>
                        <span className={styles.period}>{e.period}</span>
                      </div>
                      <span className={styles.meta}>{e.role}</span>
                    </div>
                  </div>
                  <p className={styles.expScale}>{e.scale}</p>
                  <ul className={styles.ul}>
                    {e.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Projects</h2>
            <div className={styles.projList}>
              {PROJECTS.map((p) => (
                <article key={p.title} className={styles.proj}>
                  <div className={styles.projHead}>
                    <span className={styles.projTitle}>{p.title}</span>
                    <span className={styles.projMeta}>{p.period}</span>
                  </div>
                  <p className={styles.projDesc}>{rich(p.desc)}</p>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>담당</span>
                    <ul className={styles.projUl}>
                      {p.roles.map((r) => <li key={r}>{rich(r)}</li>)}
                    </ul>
                  </div>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>성과</span>
                    <ul className={styles.projUl}>
                      {p.results.map((r) => <li key={r}>{rich(r)}</li>)}
                    </ul>
                  </div>
                  <div className={styles.projTechRow}>
                    {p.tech.map((t) => (
                      <span key={t} className={styles.chip}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Strengths</h2>
            <div className={styles.grid}>
              {STRENGTHS.map(([t, d]) => (
                <div key={t} className={styles.card}>
                  <div className={styles.cardTitle}>{t}</div>
                  <div className={styles.cardDesc}>{rich(d)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Skills</h2>
            <div className={styles.skills}>
              {SKILLS.map(([key, vals]) => (
                <div key={key} className={styles.skillRow}>
                  <div className={styles.skillKey}>{key}</div>
                  <div className={styles.skillVals}>
                    {vals.map((v) => (
                      <span key={v} className={styles.chip}>{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Open Source</h2>
            <div className={styles.projList}>
              {OPENSOURCE.map((o) => (
                <article key={o.prLabel} className={styles.proj}>
                  <div className={styles.projHead}>
                    <a className={styles.osLink} href={o.prUrl} target="_blank" rel="noreferrer">
                      <span className={styles.projTitle}>{o.title}</span>
                      <span className={styles.osPr}>({o.prLabel}{o.extra ? `, ${o.extra}` : ''})</span>
                      <ExtIcon />
                    </a>
                  </div>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>이슈</span>
                    <ul className={styles.projUl}>{o.issue.map((x) => <li key={x}>{rich(x)}</li>)}</ul>
                  </div>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>해결</span>
                    <ul className={styles.projUl}>{o.solution.map((x) => <li key={x}>{rich(x)}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Troubleshooting</h2>
            <div className={styles.projList}>
              {TROUBLES.map((t) => (
                <article key={t.title} className={styles.proj}>
                  <div className={styles.projHead}>
                    <span className={styles.projTitle}>{t.title}</span>
                  </div>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>문제</span>
                    <ul className={styles.projUl}>{t.problem.map((x) => <li key={x}>{rich(x)}</li>)}</ul>
                  </div>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>해결</span>
                    <ul className={styles.projUl}>{t.solution.map((x) => <li key={x}>{rich(x)}</li>)}</ul>
                  </div>
                  <div className={styles.projRow}>
                    <span className={styles.projLabel}>성과</span>
                    <ul className={styles.projUl}>{t.result.map((x) => <li key={x}>{rich(x)}</li>)}</ul>
                  </div>
                  <div className={styles.projLink}>→ 참고: <a className={styles.refLink} href={t.to} target="_blank" rel="noreferrer">{t.label}<ExtIcon /></a></div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Education</h2>
            <div className={styles.credList}>
              {EDUCATION.map((e) => (
                <Cred key={e.org} logo={e.org === '인하대학교' ? 'inha.png' : 'forca.png'} big={e.org === '인하대학교'} org={e.org} detail={e.detail} status={e.status} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Certificates</h2>
            <div className={styles.credList}>
              {CERTS.map(([name, date, file]) => (
                file
                  ? <Cred key={name} logo={file} org={name} detail={date} />
                  : <Cred key={name} icon={<ExamIcon />} org={name} detail={date} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Activities</h2>
            <div className={styles.credList}>
              {ACTIVITIES.map((a) => <ActivityRow key={a.name} a={a} />)}
            </div>
          </section>

          <CusdisComments />
        </div>
      </main>
    </Layout>
  );
}
