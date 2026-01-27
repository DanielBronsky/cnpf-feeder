/**
 * POST /api/auth/register
 * Регистрирует пользователя:
 * - принимает multipart/form-data (поля + avatar file) или JSON (fallback)
 * - валидирует вход через zod
 * - проверяет уникальность email/username
 * - сохраняет passwordHash в MongoDB
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { AUTH_COOKIE, signAuthToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';

const Schema = z
  .object({
    email: z.string().trim().email().toLowerCase(),
    username: z
      .string()
      .trim()
      .min(3)
      .max(24)
      .regex(/^[a-zA-Z0-9_]+$/, 'Username must be [a-zA-Z0-9_]')
      .toLowerCase(),
    password: z.string().min(8).max(72),
    passwordConfirm: z.string().min(8).max(72),
    // avatar file придёт отдельно; это поле оставляем для совместимости/возможного URL-режима
    avatarUrl: z.string().trim().url().optional().or(z.literal('')).optional(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({ code: 'custom', path: ['passwordConfirm'], message: 'Passwords do not match' });
    }
  });

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';

  let body: any = null;
  let avatarFile: File | null = null;

  if (contentType.includes('multipart/form-data')) {
    const fd = await req.formData().catch(() => null);
    if (!fd) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    body = {
      email: String(fd.get('email') ?? ''),
      username: String(fd.get('username') ?? ''),
      password: String(fd.get('password') ?? ''),
      passwordConfirm: String(fd.get('passwordConfirm') ?? ''),
      avatarUrl: String(fd.get('avatarUrl') ?? ''),
    };

    const f = fd.get('avatar');
    avatarFile = f instanceof File ? f : null;
  } else {
    body = await req.json().catch(() => null);
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, username, password, avatarUrl } = parsed.data;

  const db = await getDb();
  const users = db.collection('users');

  const existing = await users.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return NextResponse.json({ error: 'Email or username already used' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // Первый зарегистрированный пользователь становится админом.
  const usersCount = await users.estimatedDocumentCount();
  const isAdmin = usersCount === 0;

  let avatar: { contentType: string; data: Buffer } | null = null;
  let hasAvatar = false;
  if (avatarFile) {
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Avatar must be an image' }, { status: 400 });
    }
    // ограничим до 512KB (мы отправляем кропнутый 256x256 jpeg)
    if (avatarFile.size > 512 * 1024) {
      return NextResponse.json({ error: 'Avatar file too large' }, { status: 400 });
    }
    const ab = await avatarFile.arrayBuffer();
    avatar = { contentType: avatarFile.type, data: Buffer.from(ab) };
    hasAvatar = true;
  }

  const res = await users.insertOne({
    email,
    username,
    avatarUrl: avatarUrl || null,
    avatar,
    hasAvatar,
    isAdmin,
    passwordHash,
    createdAt: new Date(),
  });

  // Авто-логин после регистрации: ставим cookie с JWT
  const token = await signAuthToken({ sub: res.insertedId.toString(), email });
  const out = NextResponse.json({ ok: true });
  out.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30d
  });
  return out;
}

