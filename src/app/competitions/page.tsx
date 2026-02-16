/**
 * /competitions
 * Страница всех соревнований
 */
import { getCurrentUser } from '@/lib/currentUser';
import { CompetitionsListClient } from './ui';

export default async function CompetitionsPage() {
  const me = await getCurrentUser();

  return <CompetitionsListClient me={me ? { id: me.id, isAdmin: me.isAdmin } : null} />;
}
