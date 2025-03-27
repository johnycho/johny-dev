import React from 'react';
import {CommentCount} from 'disqus-react';
import BrowserOnly from '@docusaurus/BrowserOnly';

type Props = {
  slug: string;
};

export default function DisqusCountLink({slug}: Props) {
  return (
      <BrowserOnly>
        {() => {
          const disqusShortname = 'johny-dev'; // 본인 Disqus shortname
          const disqusConfig = {
            url: window.location.origin + slug,
            identifier: slug,
          };

          return (
              <a href={`${slug}#disqus_thread`} style={{ marginLeft: '1rem', fontSize: '0.9rem' }}>
                <CommentCount shortname={disqusShortname} config={disqusConfig}>
                  댓글
                </CommentCount>
              </a>
          );
        }}
      </BrowserOnly>
  );
}