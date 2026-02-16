/**
 * src/components/Header.tsx
 * Верхний header/navigation. Рендерится на сервере и показывает разные действия:
 * - гость: Войти / Регистрация
 * - пользователь: аватар + ник + Настройки + Выйти
 * - админ: дополнительно ссылка на управление пользователями
 */

import { getCurrentUser } from '@/lib/currentUser';
import { LogoutButton } from '@/components/LogoutButton/LogoutButton';
import {
  Avatar,
  AvatarFallback,
  Brand,
  BrandLogo,
  BrandText,
  HeaderWrap,
  Inner,
  Muted,
  Nav,
  Pill,
  PillPrimary,
  UserBox,
  Username,
} from './Header.styles';

export async function Header() {
  const me = await getCurrentUser();

  return (
    <HeaderWrap>
      <Inner>
        <Brand href='/'>
          <BrandLogo src='/brand/logo.jpg' alt='logo' />
          <BrandText>CNPF Feeder</BrandText>
        </Brand>

        <Nav>
          {!me ? (
            <>
              <Pill href='/auth/login'>Войти</Pill>
              <PillPrimary href='/auth/register'>Регистрация</PillPrimary>
            </>
          ) : (
            <>
              <Pill href='/feed'>Отчеты</Pill>
              <Pill href='/competitions'>Соревнования</Pill>
              <Pill href='/chat'>Чат-бот</Pill>
              {me.isAdmin ? <Pill href='/admin/users'>Админка</Pill> : null}

              <UserBox>
                {me.hasAvatar ? (
                  <Avatar src={`/api/user/avatar/${me.id}`} alt='avatar' />
                ) : (
                  <AvatarFallback />
                )}
                <div style={{ display: 'grid', lineHeight: 1.1 }}>
                  <Username>{me.username}</Username>
                  <Muted>{me.email}</Muted>
                </div>
              </UserBox>

              <Pill href='/settings'>Настройки</Pill>

              <div>
                <LogoutButton />
              </div>
            </>
          )}
        </Nav>
      </Inner>
    </HeaderWrap>
  );
}
