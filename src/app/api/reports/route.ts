/**
 * /api/reports
 * - GET: публичная лента отчётов (последние N)
 * - POST: создать отчёт (только залогиненный пользователь), поддерживает фото (multipart/form-data)
 */
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/currentUser';
import { getDb } from '@/lib/mongodb';

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

const TitleSchema = z.string().trim().min(3).max(120);
const TextSchema = z.string().trim().min(1).max(5000);

function fileToPhoto(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Файл должен быть изображением');
  }
  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error('Фото слишком большое (макс 2MB)');
  }
  return file.arrayBuffer().then((ab) => ({
    contentType: file.type,
    data: Buffer.from(ab),
  }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(30, Number(url.searchParams.get('limit') ?? '20') || 20));

  const me = await getCurrentUser().catch(() => null);
  const db = await getDb();

  const items = await db
    .collection('reports')
    .aggregate([
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1,
          photos: 1,
          photosCount: { $size: { $ifNull: ['$photos', []] } },
          authorUsername: { $ifNull: ['$author.username', 'unknown'] },
          authorHasAvatar: { $ifNull: ['$author.hasAvatar', false] },
        },
      },
    ])
    .toArray();

  return NextResponse.json({
      reports: items.map((r: any) => {
        const id = r._id.toString();
        const photosCount = Number(r.photosCount ?? 0);
        const canEdit = Boolean(me && (me.isAdmin || me.id === String(r.authorId)));
        return {
          id,
          title: r.title,
          text: r.text,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : undefined,
          author: {
            id: r.authorId ? String(r.authorId) : '',
            username: r.authorUsername,
            hasAvatar: Boolean(r.authorHasAvatar),
            avatarUrl: r.authorId && r.authorHasAvatar ? `/api/user/avatar/${String(r.authorId)}` : null,
          },
          photos: Array.from({ length: photosCount }).map((_, i) => ({
            url: `/api/reports/${id}/photos/${i}`,
          })),
          canEdit,
        };
      }),
  });
}

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const titleRaw = String(fd.get('title') ?? '');
  const textRaw = String(fd.get('text') ?? '');
  const titleParsed = TitleSchema.safeParse(titleRaw);
  const textParsed = TextSchema.safeParse(textRaw);
  if (!titleParsed.success) return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  if (!textParsed.success) return NextResponse.json({ error: 'Invalid text' }, { status: 400 });

  const photoFields = fd.getAll('photos');
  const files = photoFields.filter((x): x is File => x instanceof File);
  if (files.length > MAX_PHOTOS) return NextResponse.json({ error: 'Too many photos (max 10)' }, { status: 400 });

  let photos: Array<{ contentType: string; data: Buffer }> = [];
  try {
    photos = await Promise.all(files.map((f) => fileToPhoto(f)));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid photo' }, { status: 400 });
  }

  const db = await getDb();
  const reports = db.collection('reports');

  const doc = {
    authorId: new ObjectId(me.id),
    title: titleParsed.data,
    text: textParsed.data,
    photos,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await reports.insertOne(doc as any);
  return NextResponse.json({ ok: true });
}

