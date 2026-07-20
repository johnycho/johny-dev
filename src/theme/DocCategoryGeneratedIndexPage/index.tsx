import React, {type ReactNode} from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useCurrentSidebarCategory} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';
import type {Props} from '@theme/DocCategoryGeneratedIndexPage';

import DocsBoard from '@site/src/components/DocsBoard';

function DocCategoryGeneratedIndexPageMetadata({categoryGeneratedIndex}: Props): ReactNode {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function DocCategoryGeneratedIndexPageContent({categoryGeneratedIndex}: Props): ReactNode {
  const category = useCurrentSidebarCategory();
  return (
    <div>
      <DocVersionBanner />
      <DocBreadcrumbs />
      <DocVersionBadge />
      <header className="docs-head">
        <p className="docs-eyebrow">REFERENCE</p>
        <Heading as="h1" className="docs-title">
          {categoryGeneratedIndex.title}
        </Heading>
        {categoryGeneratedIndex.description && (
          <p className="docs-desc">{categoryGeneratedIndex.description}</p>
        )}
      </header>
      {/* 기본 카드 그리드 대신 블로그처럼 게시판형(검색·페이징) 목록 */}
      <article className="margin-top--lg">
        <DocsBoard items={category.items} />
      </article>
      <footer className="margin-top--lg">
        <DocPaginator
          previous={categoryGeneratedIndex.navigation.previous}
          next={categoryGeneratedIndex.navigation.next}
        />
      </footer>
    </div>
  );
}

export default function DocCategoryGeneratedIndexPage(props: Props): ReactNode {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata {...props} />
      <DocCategoryGeneratedIndexPageContent {...props} />
    </>
  );
}
