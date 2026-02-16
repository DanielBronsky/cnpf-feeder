'use client';

/**
 * src/components/LogoutButton.tsx
 * Кнопка выхода: вызывает GraphQL mutation logout, затем делает reload/redirect.
 */

import { startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGOUT_MUTATION } from '@/lib/graphql/mutations';
import { Button } from './LogoutButton.styles';

export function LogoutButton() {
  const router = useRouter();
  const client = useApolloClient();
  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION);

  async function onLogout() {
    try {
      await logoutMutation();
      // Очищаем кэш Apollo Client перед редиректом
      await client.clearStore();
      // Используем startTransition для отложенного обновления состояния и избежания проблем с гидратацией
      startTransition(() => {
        router.push('/');
        router.refresh();
      });
    } catch (error) {
      // Even if logout fails, clear cache and redirect
      await client.clearStore().catch(() => {});
      startTransition(() => {
        router.push('/');
        router.refresh();
      });
    }
  }

  return (
    <Button type='button' onClick={onLogout} disabled={loading}>
      {loading ? 'Выходим...' : 'Выйти'}
    </Button>
  );
}
