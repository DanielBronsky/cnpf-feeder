'use client';

/**
 * src/components/LogoutButton.tsx
 * Кнопка выхода: вызывает GraphQL mutation logout, затем hard redirect.
 * Hard redirect вместо router.push избегает React #311 (invalid hook) при размонтировании.
 */

import { useMutation, useApolloClient } from '@apollo/client';
import { LOGOUT_MUTATION } from '@/lib/graphql/mutations';
import { Button } from './LogoutButton.styles';

export function LogoutButton() {
  const client = useApolloClient();
  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION);

  async function onLogout() {
    try {
      await logoutMutation();
    } catch {
      // Игнорируем ошибку — всё равно делаем logout
    }
    await client.clearStore().catch(() => {});
    // Hard redirect: полная перезагрузка страницы, чтобы избежать проблем с hooks при переходе
    window.location.href = '/';
  }

  return (
    <Button type='button' onClick={onLogout} disabled={loading}>
      {loading ? 'Выходим...' : 'Выйти'}
    </Button>
  );
}
