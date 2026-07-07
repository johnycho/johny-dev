import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useBlogTagsPostsPageTitle} from '@docusaurus/theme-common/internal';
import Layout from '@theme/Layout';
import SearchMetadata from '@theme/SearchMetadata';
import Unlisted from '@theme/ContentVisibility/Unlisted';
import type {Props} from '@theme/BlogTagsPostsPage';

import BlogBoard from '@site/src/components/BlogBoard';
import styles from '@site/src/theme/blog-list.module.css';

function BlogTagsPostsPageMetadata({tag}: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <>
      <PageMetadata title={title} description={tag.description} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  );
}

export default function BlogTagsPostsPage(props: Props): ReactNode {
  const {tag} = props;

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage,
      )}>
      <BlogTagsPostsPageMetadata {...props} />
      <Layout>
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>TAG</p>
              <h1 className={styles.heading}>#{tag.label}</h1>
              <p className={styles.sub}>
                {tag.description ?? `‘${tag.label}’ 태그의 글을 모았습니다.`}
              </p>
            </div>
            {tag.unlisted && <Unlisted />}
            <BlogBoard
              lockTag={{permalink: tag.permalink, label: tag.label}}
              paginate
            />
          </div>
        </main>
      </Layout>
    </HtmlClassNameProvider>
  );
}
