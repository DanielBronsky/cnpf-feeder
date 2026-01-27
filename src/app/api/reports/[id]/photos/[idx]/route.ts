/**
 * GET /api/reports/:id/photos/:idx
 * Отдаёт конкретное фото отчёта как image/*.
 *
 * Важно: фото могут обновляться/удаляться, поэтому route не должен кешироваться.
 */
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; idx: string }> }) {
  const { id, idx } = await params;
  if (!ObjectId.isValid(id)) return new NextResponse('Not found', { status: 404 });

  const n = Number(idx);
  if (!Number.isInteger(n) || n < 0 || n > 100) return new NextResponse('Not found', { status: 404 });

  const db = await getDb();
  const report: any = await db.collection('reports').findOne({ _id: new ObjectId(id) }, { projection: { photos: 1 } });
  const photos = report?.photos || [];
  const photo = photos[n];

  if (!photo?.data || !photo?.contentType) return new NextResponse('Not found', { status: 404 });

  const raw: any = photo.data;
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

  if (!bytes || bytes.length === 0) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(bytes, {
    headers: {
      'content-type': photo.contentType,
      'cache-control': 'no-store, max-age=0',
    },
  });
}

