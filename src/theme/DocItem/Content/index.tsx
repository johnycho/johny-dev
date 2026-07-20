import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc, useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';

// 프론트매터 title(본문에 h1 없음)일 때만 합성 제목 렌더 — 카테고리 페이지와 동일한 강조 헤더 적용
function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  return shouldRender ? metadata.title : null;
}

// 현재 문서의 가장 가까운 상위 카테고리(게시판) 링크
function useCategoryHref(): string | null {
  const breadcrumbs = useSidebarBreadcrumbs() as any[];
  const cat = [...(breadcrumbs ?? [])].reverse().find((b) => b.type === 'category' && b.href);
  return cat ? cat.href : null;
}

export default function DocItemContent({children}: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const categoryHref = useCategoryHref();
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {categoryHref && (
        <Link to={categoryHref} className="post-back-link">
          <span aria-hidden="true">←</span> 목록으로
        </Link>
      )}
      {syntheticTitle && (
        <header className="docs-head">
          <Heading as="h1" className="docs-title">
            {syntheticTitle}
          </Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
