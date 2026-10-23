import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import SearchMetadata from '@theme/SearchMetadata';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import type {Props} from '@theme/BlogListPage';

import BlogBoard from '@site/src/components/BlogBoard';
import styles from '@site/src/theme/blog-list.module.css';

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <Layout>
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>BLOG</p>
              <h1 className={styles.heading}>블로그</h1>
              <p className={styles.sub}>
                실무에서 얻은 경험과 관련 지식을 깊이 있게 정리하고 공유합니다.
              </p>
            </div>
            <BlogBoard paginate />
          </div>
        </main>
      </Layout>
    </HtmlClassNameProvider>
  );
}
