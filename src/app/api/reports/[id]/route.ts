/**
 * /api/reports/:id
 * - GET: получить один отчёт (для редактирования)
 * - PATCH: обновить отчёт (только автор или админ)
 * - DELETE: удалить отчёт (только автор или админ)
 *
 * PATCH поддерживает:
 * - title/text
 * - photos[] (добавить новые фото)
 * - removePhoto[] (удалить фото по индексам)
 * - removeAllPhotos=1 (удалить все фото)
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

function isAllowed(me: { id: string; isAdmin: boolean }, authorId: any) {
  return me.isAdmin || String(authorId) === me.id;
}

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const me = await getCurrentUser().catch(() => null);
  const db = await getDb();

  const report: any = await db.collection('reports').findOne({ _id: new ObjectId(id) });
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const photos = report.photos || [];
  const photosCount = Array.isArray(photos) ? photos.length : 0;
  const canEdit = Boolean(me && isAllowed(me, report.authorId));

  return NextResponse.json({
    report: {
      id: report._id.toString(),
      title: report.title,
      text: report.text,
      createdAt: report.createdAt ? new Date(report.createdAt).toISOString() : undefined,
      updatedAt: report.updatedAt ? new Date(report.updatedAt).toISOString() : undefined,
      authorId: String(report.authorId ?? ''),
      photos: Array.from({ length: photosCount }).map((_, i) => ({
        url: `/api/reports/${id}/photos/${i}`,
      })),
      canEdit,
    },
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const db = await getDb();
  const reports = db.collection('reports');

  const existing: any = await reports.findOne({ _id: new ObjectId(id) }, { projection: { authorId: 1, photos: 1 } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!isAllowed(me, existing.authorId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const titleRaw = String(fd.get('title') ?? '');
  const textRaw = String(fd.get('text') ?? '');

  const titleProvided = fd.has('title');
  const textProvided = fd.has('text');

  if (titleProvided) {
    const parsed = TitleSchema.safeParse(titleRaw);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  }
  if (textProvided) {
    const parsed = TextSchema.safeParse(textRaw);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
  }

  const removeAllPhotos = String(fd.get('removeAllPhotos') ?? '') === '1';
  const removePhotoRaw = fd.getAll('removePhoto').map((x) => String(x));
  const removeIdx = new Set<number>();
  for (const v of removePhotoRaw) {
    const n = Number(v);
    if (Number.isInteger(n) && n >= 0) removeIdx.add(n);
  }

  const currentPhotos: Array<{ contentType: string; data: Buffer }> = Array.isArray(existing.photos) ? existing.photos : [];
  const kept = removeAllPhotos ? [] : currentPhotos.filter((_, i) => !removeIdx.has(i));

  const photoFields = fd.getAll('photos');
  const files = photoFields.filter((x): x is File => x instanceof File);

  let newPhotos: Array<{ contentType: string; data: Buffer }> = [];
  if (files.length) {
    try {
      newPhotos = await Promise.all(files.map((f) => fileToPhoto(f)));
    } catch (e: any) {
      return NextResponse.json({ error: e?.message ?? 'Invalid photo' }, { status: 400 });
    }
  }

  const mergedPhotos = [...kept, ...newPhotos];
  if (mergedPhotos.length > MAX_PHOTOS) {
    return NextResponse.json({ error: 'Too many photos (max 10)' }, { status: 400 });
  }

  const $set: any = { updatedAt: new Date() };
  if (titleProvided) $set.title = titleRaw.trim();
  if (textProvided) $set.text = textRaw.trim();
  if (removeAllPhotos || removeIdx.size > 0 || newPhotos.length > 0) {
    $set.photos = mergedPhotos;
  }

  await reports.updateOne({ _id: new ObjectId(id) }, { $set });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const db = await getDb();
  const reports = db.collection('reports');

  const existing: any = await reports.findOne({ _id: new ObjectId(id) }, { projection: { authorId: 1 } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!isAllowed(me, existing.authorId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await reports.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}

