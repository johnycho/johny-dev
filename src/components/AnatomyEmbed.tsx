// anatomy 인터랙티브 그림(등각 기계 일러스트)을 본문에 넣는다. 그림 규칙의 예외로 허용된 글에서만 쓴다
// (.claude/wiki/blog-authoring.md 4절). 빌드: tools/anatomy/<이름>/build.mjs → static/diagrams/<이름>(-light).html
import React, {useEffect, useRef, useState} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';

type Props = {
  /** static/diagrams 아래 이름(확장자 제외). 라이트 테마는 `<이름>-light.html`을 쓴다 */
  name: string;
  title: string;
  /** 그림 페이지에 넘길 쿼리(예: `steps=1-4`). 한 그림을 글의 여러 곳에 나눠 넣을 때 쓴다 */
  query?: string;
  /** 높이를 재기 전 자리 높이 */
  height?: string;
};

const MAX_H = 1600; // 오측정에 대한 안전 상한(px)

function Frame({name, title, query, height = '480px'}: Props) {
  const {colorMode} = useColorMode();
  const ref = useRef<HTMLIFrameElement>(null);
  const [h, setH] = useState<string>(height);
  const src = `/diagrams/${name}${colorMode === 'dark' ? '' : '-light'}.html${query ? `?${query}` : ''}`;

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    let timers: number[] = [];

    // 내용 높이: 그림 페이지의 body 렌더 높이(페이지는 100vh 레이아웃을 쓰지 않는다)
    const measure = () => {
      try {
        const body = iframe.contentDocument?.body;
        const contentH = body ? body.getBoundingClientRect().height : 0;
        if (contentH > 40) setH(`${Math.min(Math.ceil(contentH), MAX_H)}px`);
      } catch {
        /* 접근 불가 시 자리 높이 유지 */
      }
    };
    const onLoad = () => {
      timers = [100, 400, 1000].map((t) => window.setTimeout(measure, t));
    };
    // 폭이 바뀌면 카드 높이도 바뀌므로 그때만 다시 잰다(디바운스)
    let rz: number | undefined;
    const onResize = () => {
      window.clearTimeout(rz);
      rz = window.setTimeout(measure, 250);
    };

    iframe.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
    timers.push(window.setTimeout(measure, 200));

    return () => {
      iframe.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(rz);
    };
  }, [src]);

  return (
    <iframe
      ref={ref}
      key={src}
      src={src}
      title={title}
      loading="lazy"
      scrolling="no"
      // 그림 페이지의 color-scheme과 같아야 브라우저가 iframe 배경을 불투명하게 칠하지 않는다
      style={{width: '100%', height: h, border: 0, display: 'block', overflow: 'hidden', margin: '1.5rem 0', colorScheme: colorMode}}
    />
  );
}

export default function AnatomyEmbed(props: Props): JSX.Element {
  return (
    <BrowserOnly fallback={<div style={{height: props.height ?? '480px'}} />}>
      {() => <Frame {...props} />}
    </BrowserOnly>
  );
}
