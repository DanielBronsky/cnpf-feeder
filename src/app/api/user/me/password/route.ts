/**
 * POST /api/user/me/password
 * Смена пароля текущего пользователя.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

import { getCurrentUser } from '@/lib/currentUser';
import { getDb } from '@/lib/mongodb';
import { hashPassword, verifyPassword } from '@/lib/password';

const BodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
  newPasswordConfirm: z.string().min(1),
});

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { currentPassword, newPassword, newPasswordConfirm } = parsed.data;
  if (newPassword !== newPasswordConfirm) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: 'New password must be different' }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');

  const doc: any = await users.findOne(
    { _id: new ObjectId(me.id) },
    { projection: { passwordHash: 1 } }
  );
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ok = await verifyPassword(currentPassword, doc.passwordHash ?? '');
  if (!ok) return NextResponse.json({ error: 'Current password is wrong' }, { status: 400 });

  const passwordHash = await hashPassword(newPassword);
  await users.updateOne({ _id: doc._id }, { $set: { passwordHash } });
  return NextResponse.json({ ok: true });
}

