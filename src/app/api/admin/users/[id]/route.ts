/**
 * PATCH /api/admin/users/:id
 * Переключает флаг isAdmin для пользователя. Доступно только админам.
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/currentUser';
import { getDb } from '@/lib/mongodb';

const Schema = z.object({
  isAdmin: z.boolean(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!me.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const db = await getDb();
  const users = db.collection('users');

  // Не даём выключить последнего админа.
  if (parsed.data.isAdmin === false) {
    const admins = await users.countDocuments({ isAdmin: true });
    if (admins <= 1) {
      const target = await users.findOne({ _id: new ObjectId(id) }, { projection: { isAdmin: 1 } });
      if (target?.isAdmin) {
        return NextResponse.json({ error: 'Нельзя убрать права у последнего админа' }, { status: 409 });
      }
    }
  }

  await users.updateOne({ _id: new ObjectId(id) }, { $set: { isAdmin: parsed.data.isAdmin } });
  return NextResponse.json({ ok: true });
}

