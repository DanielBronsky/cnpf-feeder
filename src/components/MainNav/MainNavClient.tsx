'use client';

import { usePathname } from 'next/navigation';
import { NavItem } from './MainNav.styles';

export function MainNavClient({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const isFeed = pathname === '/' || pathname === '/feed' || pathname?.startsWith('/feed/');
  const isCompetitions =
    pathname === '/competitions' || pathname?.startsWith('/competitions/');

  return (
    <>
      <NavItem href="/feed" data-active={isFeed}>
        Отчеты
      </NavItem>
      <NavItem href="/competitions" data-active={isCompetitions}>
        Соревнования
      </NavItem>
      {isAdmin ? (
        <NavItem
          href="/admin/users"
          data-active={pathname?.startsWith('/admin') ?? false}
        >
          Админка
        </NavItem>
      ) : null}
    </>
  );
}
