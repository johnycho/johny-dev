import React from 'react';
import {
  Document, Page, View, Text, Link, StyleSheet, Font, Svg, Path, Rect, Circle, pdf,
} from '@react-pdf/renderer';
import {
  NAME, ROLE, CONTACTS, ABOUT, EXPERIENCE, PROJECTS,
  TROUBLES, EDUCATION, CERTS, OPENSOURCE, ACTIVITIES, boldSegments,
} from './data';

// 한글 임베드용 폰트(사이트 정적 파일 — 같은 오리진이라 CORS 없음)
Font.register({
  family: 'Noto Sans KR', // 원본 이력서와 동일(한글)
  fonts: [
    {src: '/fonts/NotoSansKR-Regular.ttf'},
    {src: '/fonts/NotoSansKR-Bold.ttf', fontWeight: 700},
  ],
});
Font.register({
  family: 'Source Sans Pro', // 원본 이력서와 동일(라틴 전용 구간)
  fonts: [
    {src: '/fonts/SourceSansPro-Regular.ttf'},
    {src: '/fonts/SourceSansPro-Bold.ttf', fontWeight: 700},
  ],
});
// 한글은 공백 단위로 줄바꿈 — 단어를 자모로 쪼개지 않도록
Font.registerHyphenationCallback((word) => [word]);

const INK = '#1a1a1a';
const BODY = '#333';
const MUTED = '#777';
const LINE = '#222';
const HAIR = '#c9ccd1';
const ACCENT = '#2b93b0'; // 연락처 아이콘 (원본 이력서와 동일한 테일 톤)

const s = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans KR',
    fontSize: 9,
    lineHeight: 1.36,
    color: BODY,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 42,
  },

  // 헤더 — 원본 이력서와 동일: 이름/직함 + 아이콘 연락처 세로 스택
  headRow: {flexDirection: 'row', alignItems: 'baseline', marginBottom: 7},
  name: {fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.1},
  role: {fontFamily: 'Source Sans Pro', fontSize: 11.5, color: '#40485a', marginLeft: 8, lineHeight: 1.1},
  contactList: {flexDirection: 'column'},
  contactItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 3},
  cIco: {marginTop: 1.5}, // 아이콘을 텍스트 중앙에 맞게 살짝 하향
  contact: {fontFamily: 'Source Sans Pro', fontSize: 9, color: BODY, textDecoration: 'none', marginLeft: 6, lineHeight: 1.1},
  headRule: {borderBottomWidth: 1.5, borderBottomColor: LINE, marginTop: 10},

  // 섹션 헤더 (영문 대문자 + 구분선)
  h2: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12.5, fontWeight: 700, color: INK, letterSpacing: 0.5,
    marginTop: 8, marginBottom: 4, paddingBottom: 3,
    borderBottomWidth: 1, borderBottomColor: '#9aa0a6',
  },
  para: {marginBottom: 3},

  // 타임라인 행 (왼쪽 기간 · 오른쪽 내용)
  row: {flexDirection: 'row', marginBottom: 5},
  when: {width: 110, fontSize: 9.3, color: '#3f4657', paddingTop: 1, paddingRight: 10},
  whenRole: {fontSize: 8.3, color: MUTED, marginTop: 1.5},
  body: {flex: 1},

  org: {fontSize: 10, fontWeight: 700, color: INK},
  company: {fontSize: 10, fontWeight: 700, color: INK},
  headline: {fontSize: 8.8, fontWeight: 700, color: ACCENT, marginTop: 5, marginBottom: 4},

  label: {fontSize: 8.8, fontWeight: 400, color: ACCENT, marginTop: 5, marginBottom: 2, letterSpacing: 0.3},
  block: {paddingLeft: 6},          // 소제목(담당/성과/기술) 살짝 들여씀
  indent: {paddingLeft: 8},         // 소제목 아래 내용(불릿) 추가로 살짝 더
  li: {flexDirection: 'row', marginTop: 1.5},
  bullet: {width: 10, fontSize: 8, color: MUTED, paddingTop: 0.5},
  liText: {flex: 1},

  desc: {marginTop: 4, marginBottom: 2, color: BODY},
  techVal: {fontFamily: 'Source Sans Pro', fontSize: 9, color: BODY},

  // 2단 (Education | Certificates, Strengths)
  twoCol: {flexDirection: 'row', gap: 22},
  col: {flex: 1},
  credRow: {marginBottom: 4},
  credOrg: {fontSize: 9.3, fontWeight: 700, color: INK},
  credOrgLink: {fontSize: 9.3, fontWeight: 700, color: INK, textDecoration: 'none'},
  credOrgRow: {flexDirection: 'row', alignItems: 'center'},
  credDetail: {fontSize: 8.3, color: MUTED, marginTop: 0.5},
  prRow: {flexDirection: 'row', alignItems: 'center', marginTop: 1},
  prLink: {fontFamily: 'Source Sans Pro', fontSize: 8.6, color: BODY, textDecoration: 'none'},
  tsTitle: {fontSize: 10, fontWeight: 700, color: INK, marginBottom: 5},
  osLink: {textDecoration: 'none'},
  osRow: {flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 5},
  osPr: {fontFamily: 'Source Sans Pro', fontSize: 8.6, fontWeight: 400, color: MUTED},
  extArrow: {fontFamily: 'Noto Sans KR', fontSize: 8.5, color: ACCENT},

  // skill 행
  skillRow: {flexDirection: 'row', marginBottom: 3},
  skillKey: {width: 110, fontSize: 8.6, fontWeight: 700, color: MUTED},
  skillVal: {flex: 1, fontSize: 8.8, color: BODY},

  link: {color: BODY, textDecoration: 'none'},
});

const Bullet = ({children}: {children: React.ReactNode}) => (
  <View style={s.li}>
    <Text style={s.bullet}>•</Text>
    <Text style={s.liText}>{children}</Text>
  </View>
);

// 강조 렌더(PDF): 볼드·하이라이트 모두 볼드로 표현(PDF엔 형광펜 없음)
const richPdf = (str: string): React.ReactNode =>
  boldSegments(str).map((seg, i) =>
    (seg.bold || seg.mark) ? <Text key={i} style={{fontWeight: 700}}>{seg.text}</Text> : seg.text
  );

// 소제목(라벨) + 불릿 목록. flush=true면 들여쓰기 없이(제목과 같은 좌측)
const LabeledList = ({label, items, flush}: {label: string; items: string[]; flush?: boolean}) => (
  <View style={flush ? undefined : s.block}>
    <Text style={s.label}>{label}</Text>
    <View style={s.indent}>{items.map((x) => <Bullet key={x}>{richPdf(x)}</Bullet>)}</View>
  </View>
);

// 연락처 아이콘 (원본 이력서와 동일: 테일색 아이콘 + 텍스트)
const IcGitHub = () => (
  <Svg width={12} height={12} viewBox="0 0 16 16">
    <Path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" fill={ACCENT} />
  </Svg>
);
const IcLinkedIn = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" fill={ACCENT} />
  </Svg>
);
const IcPhone = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" stroke={ACCENT} strokeWidth={2} fill="none" />
  </Svg>
);
const IcGlobe = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9.5} stroke={ACCENT} strokeWidth={2} fill="none" />
    <Path d="M2.5 12 H21.5" stroke={ACCENT} strokeWidth={2} fill="none" />
    <Path d="M12 2.5 a15 15 0 0 1 0 19 a15 15 0 0 1 0 -19 Z" stroke={ACCENT} strokeWidth={2} fill="none" />
  </Svg>
);
const IcLink = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={ACCENT} strokeWidth={2} fill="none" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={ACCENT} strokeWidth={2} fill="none" />
  </Svg>
);
const IcMail = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Rect x={3} y={5} width={18} height={14} rx={2} stroke={ACCENT} strokeWidth={2} fill="none" />
    <Path d="M3 7 L12 13 L21 7" stroke={ACCENT} strokeWidth={2} fill="none" />
  </Svg>
);
const IcExtSmall = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke={ACCENT} strokeWidth={2.4} fill="none" />
    <Path d="M15 3h6v6" stroke={ACCENT} strokeWidth={2.4} fill="none" />
    <Path d="M10 14 21 3" stroke={ACCENT} strokeWidth={2.4} fill="none" />
  </Svg>
);

// 왼쪽 기간 · 오른쪽 내용 타임라인 행
const Row = ({when, children, pageBreak}: {when: string; children: React.ReactNode; pageBreak?: boolean}) => (
  <View style={s.row} break={pageBreak}>
    <Text style={s.when}>{when}</Text>
    <View style={s.body}>{children}</View>
  </View>
);

function ResumeDoc() {
  return (
    <Document title={`${NAME}_이력서`} author={NAME}>
      <Page size="A4" style={s.page}>
        {/* 헤더 */}
        <View>
          <View style={s.headRow}>
            <Text style={s.name}>{NAME}</Text>
            <Text style={s.role}>{ROLE}</Text>
          </View>
          <View style={s.contactList}>
            {/* 전화번호는 현재 미표시 — 필요 시 아래 주석 해제
            <View style={s.contactItem}>
              <IcPhone />
              <Text style={s.contact}>{CONTACTS.phone}</Text>
            </View>
            */}
            <View style={s.contactItem}>
              <View style={s.cIco}><IcGitHub /></View>
              <Link style={s.contact} src={CONTACTS.github}>{CONTACTS.github}</Link>
            </View>
            <View style={s.contactItem}>
              <View style={s.cIco}><IcLinkedIn /></View>
              <Link style={s.contact} src={CONTACTS.linkedin}>{CONTACTS.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</Link>
            </View>
            <View style={s.contactItem}>
              <View style={s.cIco}><IcGlobe /></View>
              <Link style={s.contact} src={CONTACTS.site}>{CONTACTS.site}</Link>
            </View>
            <View style={s.contactItem}>
              <View style={s.cIco}><IcMail /></View>
              <Link style={s.contact} src={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</Link>
            </View>
          </View>
          <View style={s.headRule} />
        </View>

        {/* INTRODUCE */}
        <View>
          <Text style={s.h2}>INTRODUCTION</Text>
          {ABOUT.map((p, i) => (
            <Text key={i} style={s.para}>
              {boldSegments(p).map((seg, j) => (
                seg.bold ? <Text key={j} style={{fontWeight: 700}}>{seg.text}</Text> : seg.text
              ))}
            </Text>
          ))}
        </View>

        {/* WORK EXPERIENCE */}
        <View>
          <Text style={s.h2}>WORK EXPERIENCE</Text>
          {EXPERIENCE.map((e) => (
            <View key={e.company} style={s.row} wrap={false}>
              <View style={s.when}>
                <Text>{e.period}</Text>
                <Text style={s.whenRole}>{e.role}</Text>
              </View>
              <View style={s.body}>
                <Text style={s.company}>{e.company}{e.jp ? ` ${e.jp}` : ''}</Text>
                <Text style={s.headline}>{e.scale}</Text>
                <View style={s.indent}>
                  {e.bullets.map((b) => <Bullet key={b}>{b}</Bullet>)}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* EDUCATION | CERTIFICATES */}
        <View wrap={false}>
          <View style={s.twoCol}>
            <View style={s.col}>
              <Text style={s.h2}>EDUCATION</Text>
              {EDUCATION.map((e) => (
                <View key={e.org} style={s.credRow}>
                  <Text style={s.credOrg}>{e.org}</Text>
                  <Text style={s.credDetail}>{e.detail} · {e.status}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              <Text style={s.h2}>CERTIFICATES</Text>
              {CERTS.map(([name, date]) => (
                <View key={name + date} style={s.credRow}>
                  <Text style={s.credOrg}>{name}</Text>
                  <Text style={s.credDetail}>{date}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ACTIVITIES (섹션 통째로 유지해 페이지 경계에서 쪼개지지 않게) */}
        <View wrap={false}>
          <Text style={s.h2}>ACTIVITIES</Text>
          {ACTIVITIES.map((a) => (
            <View key={a.name} style={s.credRow}>
              {a.url ? (
                <View style={s.credOrgRow}>
                  <Link style={s.credOrgLink} src={a.url}>{a.name}</Link>
                  <View style={{marginLeft: 3}}><IcExtSmall /></View>
                </View>
              ) : (
                <Text style={s.credOrg}>{a.name}</Text>
              )}
              <Text style={s.credDetail}>{a.detail}</Text>
            </View>
          ))}
        </View>

        {/* KEY PROJECTS — 2페이지부터 시작 */}
        <View break>
          <Text style={s.h2}>KEY PROJECTS</Text>
          {PROJECTS.map((p) => (
            <Row key={p.title} when={p.period} pageBreak={p.title === '모바일 메신저 성능 개선'}>
              <Text style={s.org}>{p.title}</Text>
              <Text style={s.desc}>{p.desc}</Text>
              <LabeledList label="담당" items={p.roles} flush />
              <LabeledList label="성과" items={p.results} flush />
              <View>
                <Text style={s.label}>기술</Text>
                <View style={s.indent}><Text style={s.techVal}>{p.tech.join(', ')}</Text></View>
              </View>
            </Row>
          ))}
        </View>

        {/* TROUBLESHOOTING */}
        <View>
          <Text style={s.h2}>TROUBLESHOOTING</Text>
          {TROUBLES.map((t) => (
            <View key={t.title} style={{marginBottom: 11}}>
              <Text style={s.tsTitle} minPresenceAhead={40}>{t.title}</Text>
              <LabeledList label="문제" items={t.problem} />
              <LabeledList label="해결" items={t.solution} />
              <LabeledList label="성과" items={t.result} />
            </View>
          ))}
        </View>

        {/* OPENSOURCE CONTRIBUTION */}
        <View>
          <Text style={s.h2}>OPEN SOURCE CONTRIBUTIONS</Text>
          {OPENSOURCE.map((o) => (
            <View key={o.prLabel} style={{marginBottom: 9}} wrap={false}>
              <View style={s.osRow}>
                <Link style={s.osLink} src={o.prUrl}>
                  <Text style={s.org}>
                    {o.title}{' '}
                    <Text style={s.osPr}>({o.prLabel}{o.extra ? `, ${o.extra}` : ''})</Text>
                  </Text>
                </Link>
                <View style={{marginLeft: 4}}><IcExtSmall /></View>
              </View>
              <LabeledList label="이슈" items={o.issue} />
              <LabeledList label="해결" items={o.solution} />
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
}

// 헤드리스 PDF 렌더 검증용 export (resume-verify 스킬의 render-resume.cjs가 사용).
// 앱에서는 import하지 않으므로 프로덕션 번들에서 트리셰이킹됨 — 그대로 둘 것.
export const __ResumeDoc = ResumeDoc;

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
  </svg>
);
// 다운로드 생성 중 스피너(SMIL 회전 — CSS 키프레임 불필요)
const Spinner = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
    </path>
  </svg>
);

export function ResumeDownloadButton({className}: {className?: string}) {
  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    try {
      setLoading(true);
      const blob = await pdf(<ResumeDoc />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${NAME}_이력서.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button type="button" className={className} onClick={onClick} disabled={loading}>
      {loading ? <Spinner /> : <DownloadIcon />} PDF
    </button>
  );
}

export default ResumeDownloadButton;
