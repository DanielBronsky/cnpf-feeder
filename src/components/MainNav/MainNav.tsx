/**
 * Основная навигация: Отчеты, Соревнования, Чат-бот — для всех.
 * Админка — только для авторизованных админов.
 */

import { getCurrentUser } from '@/lib/currentUser';
import { MainNavWrap, NavList } from './MainNav.styles';
import { MainNavClient } from './MainNavClient';

export async function MainNav() {
  const me = await getCurrentUser();

  return (
    <MainNavWrap>
      <NavList>
        <MainNavClient isAdmin={me?.isAdmin ?? false} />
      </NavList>
    </MainNavWrap>
  );
}
