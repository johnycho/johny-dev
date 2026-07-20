import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Navbar/MobileSidebar/Layout';

// 모바일 드로어(햄버거): 문서 페이지에서도 하위(docs 사이드바) 메뉴로 바로 진입하지 않고
// 항상 메인 메뉴(레퍼런스·인사이트)를 보여준다. (secondary 패널은 렌더하지 않음)
export default function NavbarMobileSidebarLayout({header, primaryMenu}: Props): ReactNode {
  return (
    <div className="navbar-sidebar">
      {header}
      <div className="navbar-sidebar__items">
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
      </div>
    </div>
  );
}
