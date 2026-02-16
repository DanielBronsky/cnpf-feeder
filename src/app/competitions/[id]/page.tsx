/**
 * /competitions/[id]
 * Страница просмотра одного соревнования
 */
import { getCurrentUser } from '@/lib/currentUser';
import { CompetitionViewClient } from './ui';

export default async function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getCurrentUser();

  return <CompetitionViewClient competitionId={id} me={me ? { id: me.id, isAdmin: me.isAdmin } : null} />;
}
