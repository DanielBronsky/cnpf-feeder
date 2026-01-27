'use client';

/**
 * src/components/LogoutButton.tsx
 * Кнопка выхода: вызывает POST `/api/auth/logout`, затем делает reload/redirect.
 */

import { useState } from 'react';
import { Button } from './LogoutButton.styles';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type='button' onClick={onLogout} disabled={loading}>
      {loading ? 'Выходим...' : 'Выйти'}
    </Button>
  );
}
