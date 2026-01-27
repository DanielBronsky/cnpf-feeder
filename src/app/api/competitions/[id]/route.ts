/**
 * /api/competitions/[id]
 * - GET: получить соревнование по ID
 * - PATCH: обновить соревнование (только админ)
 * - DELETE: удалить соревнование (только админ)
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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const db = await getDb();
  const competition: any = await db.collection('competitions').findOne({ _id: new ObjectId(id) });
  if (!competition) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    competition: {
      id: competition._id.toString(),
      title: competition.title,
      startDate: competition.startDate ? new Date(competition.startDate).toISOString() : null,
      endDate: competition.endDate ? new Date(competition.endDate).toISOString() : null,
      location: competition.location,
      tours: (competition.tours || []).map((tour: any) => ({
        date: tour.date ? new Date(tour.date).toISOString() : null,
        time: tour.time || null,
      })),
      openingDate: competition.openingDate ? new Date(competition.openingDate).toISOString() : null,
      openingTime: competition.openingTime || null,
      individualFormat: Boolean(competition.individualFormat),
      teamFormat: Boolean(competition.teamFormat),
      fee: competition.fee || null,
      teamLimit: competition.teamLimit || null,
      regulations: competition.regulations || null,
      createdAt: competition.createdAt ? new Date(competition.createdAt).toISOString() : null,
      updatedAt: competition.updatedAt ? new Date(competition.updatedAt).toISOString() : null,
    },
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!me.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

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

  if (!individualFormat && !teamFormat) {
    return NextResponse.json({ error: 'Выберите хотя бы один формат соревнований' }, { status: 400 });
  }

  const db = await getDb();
  const competitions = db.collection('competitions');

  const existing = await competitions.findOne({ _id: new ObjectId(id) });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await competitions.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
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
        updatedAt: new Date(),
      },
    },
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!me.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const db = await getDb();
  const result = await db.collection('competitions').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
