/**
 * GET /api/auth/me
 * Возвращает текущего пользователя из MongoDB по JWT cookie (`cnpf_auth`).
 * Если нет cookie/токен невалиден/пользователь не найден -> { user: null }.
 */
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/currentUser';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      avatarUrl: user.hasAvatar ? `/api/user/avatar/${user.id}` : null,
    },
  });
}

