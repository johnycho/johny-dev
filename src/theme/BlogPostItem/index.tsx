/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import type {Props} from '@theme/BlogPostItem';

import CusdisComments from '@site/src/components/CusdisComments';

// apply card styling + bottom margin in list view
function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'blog-list-card margin-bottom--xl' : undefined;
}

// SEO: 개별 글 페이지에 BlogPosting 구조화 데이터(JSON-LD)를 넣어 검색 리치 결과를 돕는다.
function useBlogPostingJsonLd(): string | null {
  const {siteConfig} = useDocusaurusContext();
  const {metadata, isBlogPostPage} = useBlogPost();
  if (!isBlogPostPage) {
    return null;
  }

  const siteUrl = siteConfig.url;
  const abs = (path?: string): string | undefined =>
    path ? new URL(path, siteUrl).href : undefined;

  const meta = metadata as any;
  const pageUrl = abs(meta.permalink)!;
  const defaultImage = (siteConfig.themeConfig as any)?.image as string | undefined;
  const image = abs(meta.frontMatter?.image ?? defaultImage);
  const authors = (meta.authors ?? []).map((a: any) => ({
    '@type': 'Person',
    name: a.name ?? a.key,
    ...(a.url ? {url: a.url} : {}),
  }));

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    ...(meta.description ? {description: meta.description} : {}),
    ...(meta.date ? {datePublished: meta.date} : {}),
    ...(meta.lastUpdatedAt
      ? {dateModified: new Date(meta.lastUpdatedAt * 1000).toISOString()}
      : meta.date
      ? {dateModified: meta.date}
      : {}),
    ...(authors.length ? {author: authors} : {}),
    ...(image ? {image} : {}),
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    ...(meta.tags?.length
      ? {keywords: meta.tags.map((t: any) => t.label).join(', ')}
      : {}),
    publisher: {'@type': 'Person', name: 'johnycho', url: `${siteUrl}/about`},
    inLanguage: 'ko',
  };
  return JSON.stringify(jsonLd);
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const {isBlogPostPage} = useBlogPost();
  const containerClassName = useContainerClassName();
  const blogPostingJsonLd = useBlogPostingJsonLd();

  return (
      <BlogPostItemContainer className={clsx(containerClassName, className)}>
        {blogPostingJsonLd && (
          <Head>
            <script type="application/ld+json">{blogPostingJsonLd}</script>
          </Head>
        )}
        <BlogPostItemHeader />
        <BlogPostItemContent>{children}</BlogPostItemContent>
        <BlogPostItemFooter />
        {isBlogPostPage && <CusdisComments />}
      </BlogPostItemContainer>
  );
}
