/**
 * /api/competitions
 * - GET: получить список соревнований (публичный)
 * - POST: создать соревнование (только админ)
 */
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/currentUser';
import { getDb } from '@/lib/mongodb';

const TourSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
});

const CompetitionSchema = z.object({
  title: z.string().trim().min(3).max(200),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  location: z.string().trim().min(1).max(200),
  tours: z.array(TourSchema).min(1),
  openingDate: z.string().optional(),
  openingTime: z.string().optional(),
  individualFormat: z.boolean(),
  teamFormat: z.boolean(),
  fee: z.string().optional(),
  teamLimit: z.string().optional(),
  regulations: z.string().trim().optional(),
});

export async function GET() {
  const db = await getDb();
  const competitions = await db
    .collection('competitions')
    .find({}, { sort: { createdAt: -1 } })
    .toArray();

  return NextResponse.json({
    competitions: competitions.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      startDate: c.startDate ? new Date(c.startDate).toISOString() : null,
      endDate: c.endDate ? new Date(c.endDate).toISOString() : null,
      location: c.location,
      tours: (c.tours || []).map((tour: any) => ({
        date: tour.date ? new Date(tour.date).toISOString() : null,
        time: tour.time || null,
      })),
      openingDate: c.openingDate ? new Date(c.openingDate).toISOString() : null,
      openingTime: c.openingTime || null,
      individualFormat: Boolean(c.individualFormat),
      teamFormat: Boolean(c.teamFormat),
      fee: c.fee || null,
      teamLimit: c.teamLimit || null,
      regulations: c.regulations || null,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
      updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
    })),
  });
}

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!me.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const parsed = CompetitionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const {
    title,
    startDate,
    endDate,
    location,
    tours,
    openingDate,
    openingTime,
    individualFormat,
    teamFormat,
    fee,
    teamLimit,
    regulations,
  } = parsed.data;

  // Проверка, что хотя бы один формат выбран
  if (!individualFormat && !teamFormat) {
    return NextResponse.json({ error: 'Выберите хотя бы один формат соревнований' }, { status: 400 });
  }

  const db = await getDb();
  const competitions = db.collection('competitions');

  const doc = {
    title,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    location,
    tours: tours.map((tour) => ({
      date: new Date(tour.date),
      time: tour.time,
    })),
    openingDate: openingDate ? new Date(openingDate) : null,
    openingTime: openingTime || null,
    individualFormat,
    teamFormat,
    fee: fee ? parseFloat(fee) : null,
    teamLimit: teamLimit ? parseInt(teamLimit, 10) : null,
    regulations: regulations || null,
    createdBy: new ObjectId(me.id),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await competitions.insertOne(doc as any);
  return NextResponse.json({ ok: true });
}
