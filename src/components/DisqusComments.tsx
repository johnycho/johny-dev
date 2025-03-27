import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

export default function DisqusComments() {
  const location = useLocation();

  useEffect(() => {
    const disqus_config = function (this: any) {
      this.page.url = window.location.href;
      this.page.identifier = window.location.pathname;
    };

    // 기존 스크립트 제거 + 댓글 DOM 초기화
    const cleanup = () => {
      const oldScript = document.getElementById('dsq-embed-scr');
      if (oldScript) oldScript.remove();

      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) disqusThread.innerHTML = '';
    };

    // Disqus embed script 삽입
    const loadDisqus = () => {
      (window as any).disqus_config = disqus_config;

      const s = document.createElement('script');
      s.src = 'https://johny-dev.disqus.com/embed.js';
      s.setAttribute('data-timestamp', Date.now().toString());
      s.setAttribute('id', 'dsq-embed-scr');
      s.async = true;
      (document.head || document.body).appendChild(s);
    };

    cleanup();
    loadDisqus();
  }, [location.pathname]);

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