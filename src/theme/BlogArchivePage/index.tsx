import React, {type ReactNode} from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import type {Props} from '@theme/BlogArchivePage';

import BlogBoard from '@site/src/components/BlogBoard';
import styles from '@site/src/theme/blog-list.module.css';

export default function BlogArchive(_props: Props): ReactNode {
  return (
    <>
      <PageMetadata title="아카이브" description="전체 글 목록" />
      <Layout>
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.head}>
              <p className={styles.eyebrow}>ARCHIVE</p>
              <h1 className={styles.heading}>전체 글</h1>
              <p className={styles.sub}>지금까지 남긴 모든 글을 한곳에서 살펴봅니다.</p>
            </div>
            <BlogBoard paginate />
          </div>
        </main>
      </Layout>
    </>
  );
}
