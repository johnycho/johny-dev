import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

type Props = {
  slug: string;
};

export default function DisqusCountLink({ slug }: Props) {
  const location = useLocation();

  useEffect(() => {
    // Disqus count.js가 로드된 후 count 업데이트
    if (typeof window !== 'undefined' && (window as any).DISQUSWIDGETS) {
      (window as any).DISQUSWIDGETS.getCount({ reset: true });
    }
  }, [location.pathname]);

  return (
      <a
          href={`${slug}#disqus_thread`}
          data-disqus-identifier={slug}
          style={{ marginLeft: '1rem', fontSize: '0.9rem' }}
      >
        댓글 보기
      </a>
  );
}