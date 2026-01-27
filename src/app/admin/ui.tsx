'use client';

/**
 * src/app/admin/ui.tsx
 * Внутренний header админки (навигация по разделам).
 */
import { usePathname } from 'next/navigation';

import {
  AdminHeader,
  HeaderTop,
  Hint,
  Nav,
  NavLink,
  SectionBlock,
  SectionTitle,
  SectionsContainer,
} from './admin.styles';

const adminLinks = [
  { href: '/admin/users', label: 'Пользователи' },
  { href: '/admin/site-settings', label: 'Настройки сайта' },
];

const sectionsLinks = [
  { href: '/admin/reports', label: 'Вести/Отчеты' },
  { href: '/admin/competitions', label: 'Соревнования' },
];

export function AdminNav() {
  const pathname = usePathname() || '';
  return (
    <AdminHeader>
      <HeaderTop>
        <Hint>Доступ только для администратора</Hint>
      </HeaderTop>
      <SectionsContainer>
        <SectionBlock>
          <SectionTitle>Админка</SectionTitle>
          <Nav>
            {adminLinks.map((l) => (
              <NavLink key={l.href} href={l.href} $active={pathname === l.href}>
                {l.label}
              </NavLink>
            ))}
          </Nav>
        </SectionBlock>
        <SectionBlock>
          <SectionTitle>Разделы</SectionTitle>
          <Nav>
            {sectionsLinks.map((l) => (
              <NavLink key={l.href} href={l.href} $active={pathname === l.href}>
                {l.label}
              </NavLink>
            ))}
          </Nav>
        </SectionBlock>
      </SectionsContainer>
    </AdminHeader>
  );
}
