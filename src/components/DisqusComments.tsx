import React from 'react';
import {DiscussionEmbed} from 'disqus-react';
import {useLocation} from '@docusaurus/router';

export default function DisqusComments() {
  const location = useLocation();

  const disqusShortname = 'johny-dev'; // 너의 Disqus shortname
  const disqusConfig = {
    url: window.location.href,
    identifier: location.pathname,
    title: document.title,
  };

  return (
      <div style={{ marginTop: '2rem' }}>
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
  );
}