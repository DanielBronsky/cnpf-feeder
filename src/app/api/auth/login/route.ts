/**
 * POST /api/auth/login
 * Логин по email/password:
 * - валидирует вход через zod
 * - сравнивает пароль с bcrypt hash
 * - устанавливает httpOnly cookie `cnpf_auth` с JWT
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getDb } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/password';
import { AUTH_COOKIE, signAuthToken } from '@/lib/auth';

const Schema = z.object({
  login: z.string().trim().min(3).max(254).toLowerCase(),
  password: z.string().min(1).max(72),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { login, password } = parsed.data;

  const db = await getDb();
  const users = db.collection('users');

  // login может быть email или username (оба храним в lower-case)
  const user = await users.findOne<{ _id: any; email: string; username?: string; passwordHash: string }>({
    $or: [{ email: login }, { username: login }],
  });
  if (!user) {
    return NextResponse.json({ error: 'Wrong email or password' }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Wrong email or password' }, { status: 401 });
  }

  const token = await signAuthToken({ sub: user._id.toString(), email: user.email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30d
  });
  return res;
}

