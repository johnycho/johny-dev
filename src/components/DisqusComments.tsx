import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

export default function DisqusComments() {
  const location = useLocation();

  useEffect(() => {
    const d = document;

    // 기존 스크립트 제거
    const oldScript = d.getElementById('dsq-embed-scr');
    if (oldScript) oldScript.remove();

    // 기존 댓글 제거 (다시 그리기 위해)
    const disqusThread = document.getElementById('disqus_thread');
    if (disqusThread) disqusThread.innerHTML = '';

    // 반드시 먼저 설정
    (window as any).disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = window.location.pathname;
    };

    // embed.js 삽입
    const s = d.createElement('script');
    s.src = 'https://johny-dev.disqus.com/embed.js'; // 본인 shortname
    s.setAttribute('data-timestamp', Date.now().toString());
    s.id = 'dsq-embed-scr';
    s.async = true;
    (d.head || d.body).appendChild(s);
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