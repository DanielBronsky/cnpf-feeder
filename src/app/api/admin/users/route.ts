/**
 * GET /api/admin/users
 * Возвращает список пользователей (без паролей). Доступно только админам.
 */

import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/currentUser';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!me.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = await getDb();
  const users = await db
    .collection('users')
    .find(
      {},
      {
        projection: { passwordHash: 0, avatar: 0 },
        sort: { createdAt: -1 },
      }
    )
    .toArray();

  return NextResponse.json({
    users: users.map((u: any) => ({
      id: u._id.toString(),
      email: u.email,
      username: u.username ?? u.email,
      isAdmin: Boolean(u.isAdmin),
      hasAvatar: Boolean(u.hasAvatar),
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
    })),
  });
}

