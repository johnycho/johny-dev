import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

export default function DisqusComments() {
  const location = useLocation();

  useEffect(() => {
    const disqus_config = function (this: any) {
      this.page.url = window.location.href;
      this.page.identifier = window.location.pathname;
    };

    const embedDisqus = () => {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://johny-dev.disqus.com/embed.js'; // ← 본인 shortname 사용
      s.setAttribute('data-timestamp', Date.now().toString());
      s.setAttribute('id', 'dsq-embed-scr');
      s.async = true;
      (d.head || d.body).appendChild(s);
    };

    // ✅ 기존 스크립트 제거 (중복 방지)
    const cleanupOldDisqus = () => {
      const oldScript = document.getElementById('dsq-embed-scr');
      if (oldScript) oldScript.remove();

      // Disqus가 이전에 렌더된 경우 지워주기
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) disqusThread.innerHTML = '';
    };

    if ((window as any).DISQUS) {
      // 🔁 Disqus 객체가 있으면 리셋
      (window as any).DISQUS.reset({
        reload: true,
        config: disqus_config,
      });
    } else {
      // 🆕 없으면 새로 로드
      cleanupOldDisqus();
      (window as any).disqus_config = disqus_config;
      embedDisqus();
    }
  }, [location.pathname]); // ⛳ 페이지 경로 바뀔 때마다 실행

  return (
      <>
        <div id="disqus_thread" style={{ marginTop: '2rem' }} />
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
        </noscript>
      </>
  );
}