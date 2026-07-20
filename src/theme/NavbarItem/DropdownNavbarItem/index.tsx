import React, {useState, useRef, useEffect, type ReactNode} from 'react';
import clsx from 'clsx';
import {isRegexpStringMatch, useCollapsible, Collapsible} from '@docusaurus/theme-common';
import {isSamePath, useLocalPathname} from '@docusaurus/theme-common/internal';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import NavbarItem from '@theme/NavbarItem';
import type {Props} from '@theme/NavbarItem/DropdownNavbarItem';

function isItemActive(item: any, localPathname: string) {
  if (isSamePath(item.to, localPathname)) {
    return true;
  }
  if (isRegexpStringMatch(item.activeBaseRegex, localPathname)) {
    return true;
  }
  if (item.activeBasePath && localPathname.startsWith(item.activeBasePath)) {
    return true;
  }
  return false;
}

function containsActiveItems(items: any[], localPathname: string) {
  return items.some((item) => isItemActive(item, localPathname));
}

function DropdownNavbarItemDesktop({items, position, className, onClick, ...props}: any) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | FocusEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('focusin', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('focusin', handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <div
      ref={dropdownRef}
      className={clsx('navbar__item', 'dropdown', 'dropdown--hoverable', {
        'dropdown--right': position === 'right',
        'dropdown--show': showDropdown,
      })}>
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        href={props.to ? undefined : '#'}
        className={clsx('navbar__link', className)}
        {...props}
        onClick={props.to ? undefined : (e: React.MouseEvent) => e.preventDefault()}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }
        }}>
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul className="dropdown__menu">
        {items.map((childItemProps: any, i: number) => (
          <NavbarItem
            isDropdownItem
            activeClassName="dropdown__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

// 모바일 드로어: 원래 접이식(캐럿) 유지. 단, 라벨 클릭 시 to(intro)로 이동, 캐럿 클릭 시 하위메뉴 토글.
function DropdownNavbarItemMobile({items, className, position, onClick, ...props}: any) {
  const localPathname = useLocalPathname();
  const containsActive = containsActiveItems(items, localPathname);
  const {collapsed, toggleCollapsed, setCollapsed} = useCollapsible({
    initialState: () => !containsActive,
  });
  useEffect(() => {
    if (containsActive) {
      setCollapsed(!containsActive);
    }
  }, [localPathname, containsActive, setCollapsed]);
  return (
    <li className={clsx('menu__list-item', {'menu__list-item--collapsed': collapsed})}>
      <div className="menu__list-item-collapsible">
        <NavbarNavLink
          className={clsx('menu__link', className)}
          activeClassName="menu__link--active"
          {...props}
          onClick={onClick}>
          {props.children ?? props.label}
        </NavbarNavLink>
        <button
          type="button"
          aria-label="하위 메뉴 펼치기/접기"
          aria-expanded={!collapsed}
          className="clean-btn menu__caret"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCollapsed();
          }}
        />
      </div>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps: any, i: number) => (
          <NavbarItem
            mobile
            isDropdownItem
            onClick={onClick}
            activeClassName="menu__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </Collapsible>
    </li>
  );
}

export default function DropdownNavbarItem({mobile = false, ...props}: Props): ReactNode {
  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop;
  return <Comp {...props} />;
}
