/**
 * PATCH /api/user/me
 * Обновление профиля текущего пользователя:
 * - username
 * - avatar (upload/remove)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

import { getCurrentUser } from '@/lib/currentUser';
import { getDb } from '@/lib/mongodb';

const UsernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(24)
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must be [a-zA-Z0-9_]')
  .toLowerCase();

export async function PATCH(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const usernameRaw = String(fd.get('username') ?? '');
  const removeAvatar = String(fd.get('removeAvatar') ?? '') === '1';
  const avatarField = fd.get('avatar');
  const avatarFile = avatarField instanceof File ? avatarField : null;

  const usernameParsed = UsernameSchema.safeParse(usernameRaw);
  if (!usernameParsed.success) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');
  const myId = new ObjectId(me.id);

  const existing = await users.findOne({ _id: { $ne: myId }, username: usernameParsed.data });
  if (existing) return NextResponse.json({ error: 'Username already used' }, { status: 409 });

  const $set: any = { username: usernameParsed.data };
  const $unset: any = {};

  if (removeAvatar) {
    $set.hasAvatar = false;
    $unset.avatar = '';
  }

  if (avatarFile) {
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Avatar must be an image' }, { status: 400 });
    }
    if (avatarFile.size > 512 * 1024) {
      return NextResponse.json({ error: 'Avatar file too large' }, { status: 400 });
    }
    const ab = await avatarFile.arrayBuffer();
    $set.avatar = { contentType: avatarFile.type, data: Buffer.from(ab) };
    $set.hasAvatar = true;
  }

  const update: any = { $set };
  if (Object.keys($unset).length) update.$unset = $unset;

  await users.updateOne({ _id: myId }, update);
  return NextResponse.json({ ok: true });
}

