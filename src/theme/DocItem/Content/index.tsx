import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';

// 프론트매터 title(본문에 h1 없음)일 때만 합성 제목 렌더 — 카테고리 페이지와 동일한 강조 헤더 적용
function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  return shouldRender ? metadata.title : null;
}

export default function DocItemContent({children}: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header className="docs-head">
          <p className="docs-eyebrow">REFERENCE</p>
          <Heading as="h1" className="docs-title">
            {syntheticTitle}
          </Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
