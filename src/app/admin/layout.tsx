/**
 * src/app/admin/layout.tsx
 * Общий layout для админки: проверяет, что пользователь — админ, и рисует внутренний header/навигацию.
 */
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/currentUser';
import { AdminNav } from './ui';
import { Content, Wrap } from './admin.styles';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  if (!me) redirect('/auth/login');
  if (!me.isAdmin) redirect('/');

  return (
    <Wrap>
      <AdminNav />
      <Content>{children}</Content>
    </Wrap>
  );
}

