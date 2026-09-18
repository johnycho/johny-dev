import React, {useEffect, useRef, useState} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';

type Props = {
  /** static HTML 경로 (예: /diagrams/k8s-architecture.html) — ?theme= 은 자동으로 붙는다 */
  src: string;
  title: string;
  /** 초기·최소 높이(내용에 맞춰 자동으로 한 번 맞춘 뒤 고정) */
  height?: string;
};

const MAX_H = 1400; // 되먹임/오측정에 대한 안전 상한(px)

function Frame({src, title, height = '560px'}: Props) {
  const {colorMode} = useColorMode();
  const ref = useRef<HTMLIFrameElement>(null);
  const [h, setH] = useState<string>(height);

  // embed=1은 hover 관계 오버레이(화살표 흐름)까지 꺼버리므로 쓰지 않고,
  // 편집 크롬은 HTML에 주입한 CSS(#blog-chrome-hide)가 숨긴다.
  const initialSrc = `${src}?theme=${colorMode}`;

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    let timers: number[] = [];

    const applyTheme = () => {
      try {
        iframe.contentDocument?.documentElement.setAttribute('data-theme', colorMode);
      } catch {
        /* noop */
      }
    };
    // 내용 높이 측정: 뷰포트 의존 컨테이너 대신 실제 내용(.container)의 렌더 높이를 잰다.
    const measure = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const el = doc.querySelector('.container') as HTMLElement | null;
        const contentH = el
          ? el.getBoundingClientRect().height
          : Math.max(doc.body?.scrollHeight ?? 0, doc.documentElement?.scrollHeight ?? 0);
        // 버퍼는 1px만(위=컨테이너 패딩, 아래=컨테이너 패딩으로 대칭). scrolling="no"라 스크롤바 안 생김.
        if (contentH > 40) setH(`${Math.min(Math.ceil(contentH) + 1, MAX_H)}px`);
      } catch {
        /* cross-origin 등 접근 불가 시 무시 */
      }
    };

    // 로드 후 레이아웃이 안정될 때까지 "정해진 횟수만" 측정하고 멈춘다(연속 관찰 없음 → 되먹임 방지).
    const onLoad = () => {
      applyTheme();
      timers = [120, 450, 1000].map((t) => window.setTimeout(measure, t));
    };
    // 창 폭이 바뀌면 다이어그램이 재배치되므로 그때만 한 번 더 측정(디바운스).
    let rz: number | undefined;
    const onResize = () => {
      window.clearTimeout(rz);
      rz = window.setTimeout(measure, 250);
    };

    applyTheme();
    iframe.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
    // 이미 로드가 끝난 경우 대비 1회 측정
    timers.push(window.setTimeout(measure, 200));

    return () => {
      iframe.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(rz);
    };
  }, [colorMode]);

  return (
    <iframe
      ref={ref}
      src={initialSrc}
      title={title}
      loading="lazy"
      scrolling="no"
      style={{
        width: '100%',
        height: h,
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        display: 'block',
        overflow: 'hidden',
        // 바로 아래 본문과 너무 붙지 않도록 하단 여백 확보
        margin: '0.5rem 0 1.75rem',
      }}
    />
  );
}

export default function ArchifyEmbed(props: Props): JSX.Element {
  return (
    <BrowserOnly fallback={<div style={{height: props.height ?? '560px'}} />}>
      {() => <Frame {...props} />}
    </BrowserOnly>
  );
}
