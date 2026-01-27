/**
 * GET /api/user/avatar/:id
 * Возвращает аватар пользователя как картинку (если сохранён в MongoDB).
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/mongodb';

// Аватар может меняться пользователем, поэтому этот route НЕ должен кешироваться.
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return new NextResponse('Not found', { status: 404 });

  const db = await getDb();
  const user = await db
    .collection<{ _id: ObjectId; avatar?: { contentType: string; data: any } | null }>('users')
    .findOne({ _id: new ObjectId(id) }, { projection: { avatar: 1 } });

  if (!user?.avatar?.data || !user.avatar.contentType) {
    return new NextResponse('Not found', { status: 404 });
  }

  // В MongoDB поле хранится как BSON Binary, а в Node может быть Buffer/Uint8Array/Binary.
  const raw: any = user.avatar.data;
  const bytes =
    raw instanceof Uint8Array
      ? raw
      : Buffer.isBuffer(raw)
        ? new Uint8Array(raw)
        : raw?.buffer instanceof Uint8Array
          ? raw.buffer
          : typeof raw?.value === 'function'
            ? (() => {
                const v = raw.value(true);
                return Buffer.isBuffer(v) ? new Uint8Array(v) : new Uint8Array(v);
              })()
            : null;

  if (!bytes || bytes.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }
  return new NextResponse(bytes, {
    headers: {
      'content-type': user.avatar.contentType,
      // Критично: иначе браузер покажет старый аватар после апдейта.
      'cache-control': 'no-store, max-age=0',
    },
  });
}

