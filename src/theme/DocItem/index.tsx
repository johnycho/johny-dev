import React, {type ReactNode} from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import type {Props} from '@theme/DocItem';

export default function DocItem(props: Props): ReactNode {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;

  return (
      <DocProvider content={props.content}>
        <HtmlClassNameProvider className={docHtmlClassName}>
          <DocItemMetadata />
          {/* 댓글은 DocItem/Layout 에서 태그·페이지네이션 뒤(본문 밑)로 렌더 */}
          <DocItemLayout>
            <MDXComponent />
          </DocItemLayout>
        </HtmlClassNameProvider>
      </DocProvider>
  );
}