/**
 * /settings
 * Поп-ап настроек залогиненного пользователя.
 */

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/currentUser';
import { SettingsModal } from './modal';

export default async function SettingsPage() {
  const me = await getCurrentUser();
  if (!me) redirect('/auth/login');

  return (
    <SettingsModal
      initialUser={{
        id: me.id,
        email: me.email,
        username: me.username,
        isAdmin: me.isAdmin,
        hasAvatar: me.hasAvatar,
      }}
    />
  );
}

