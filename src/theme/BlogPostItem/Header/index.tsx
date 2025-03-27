import React, {type ReactNode} from 'react';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';

import {useLocation} from '@docusaurus/router';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import DisqusCountLink from '@site/src/components/DisqusCountLink';

export default function BlogPostItemHeader(): ReactNode {
  const {metadata} = useBlogPost();
  const {permalink} = metadata;
  const location = useLocation();

  return (
      <header>
        <BlogPostItemHeaderTitle />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BlogPostItemHeaderInfo />
          <DisqusCountLink key={location.pathname} slug={permalink} />
        </div>
        <BlogPostItemHeaderAuthors />
      </header>
  );
}