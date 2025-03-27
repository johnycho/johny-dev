import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

export default function DisqusComments() {
  const location = useLocation();

  useEffect(() => {
    // Disqus가 이미 로드된 경우 재설정
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = window.location.href;
          this.page.identifier = window.location.pathname;
        },
      });
    } else {
      // 최초 로드
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://johny-dev.disqus.com/embed.js'; // ← 여기에 본인의 shortname
      s.setAttribute('data-timestamp', Date.now().toString());
      s.async = true;
      (d.head || d.body).appendChild(s);
    }
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