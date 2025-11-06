import React, {type ReactNode} from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import type {Props} from '@theme/DocItem';
import DisqusComments from "@site/src/components/DisqusComments";

export default function DocItem(props: Props): ReactNode {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;

  return (
      <DocProvider content={props.content}>
        <HtmlClassNameProvider className={docHtmlClassName}>
          <DocItemMetadata />
          <DocItemLayout>
            <MDXComponent />
            {/* 첫 페이지 (intro, 또는 slug='/') 에서는 댓글 숨기기 */}
            {props.content.metadata.id !== 'intro' && <DisqusComments />}
          </DocItemLayout>
        </HtmlClassNameProvider>
      </DocProvider>
  );
}