import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {DiscussionEmbed} from 'disqus-react';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';

// BrowserOnly 내부에서 훅을 쓰기 위한 실제 렌더 컴포넌트
function DisqusInner() {
  const location = useLocation();
  const {colorMode} = useColorMode();

  const disqusConfig = {
    url: window.location.href,
    identifier: location.pathname,
    title: document.title,
  };

  return (
    <div className="disqus-root" style={{marginTop: '2rem'}}>
      {/* colorMode를 key로 주면 테마 전환 시 Disqus가 재마운트되어
          현재 테마(배경색)에 맞는 라이트/다크로 다시 로드된다 */}
      <DiscussionEmbed key={colorMode} shortname="johny-dev" config={disqusConfig} />
    </div>
  );
}

export default function DisqusComments() {
  return (
    <BrowserOnly fallback={<div>Loading comments...</div>}>
      {() => <DisqusInner />}
    </BrowserOnly>
  );
}
