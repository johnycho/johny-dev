import React, {type ReactNode} from 'react';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import DocPaginator from '@theme/DocPaginator';

// 사이드바에서 카테고리(게시판) 페이지의 href 를 모두 수집
function collectCategoryHrefs(items: any[], acc: Set<string>): Set<string> {
  for (const it of items ?? []) {
    if (it.type === 'category') {
      if (it.href) acc.add(it.href);
      collectCategoryHrefs(it.items, acc);
    }
  }
  return acc;
}

export default function DocItemPaginator(): ReactNode {
  const {metadata} = useDoc();
  const sidebar = useDocsSidebar();
  const catHrefs = collectCategoryHrefs(sidebar?.items ?? [], new Set());
  // 하단 좌우 네비게이션에서 카테고리 페이지는 제외
  const exclude = (link: any) => (link && catHrefs.has(link.permalink) ? undefined : link);
  return <DocPaginator previous={exclude(metadata.previous)} next={exclude(metadata.next)} />;
}
