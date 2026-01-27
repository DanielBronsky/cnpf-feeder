/**
 * /feed
 * Страница всех отчётов
 */
import { getCurrentUser } from '@/lib/currentUser';
import { FeedClient } from './ui';

export default async function FeedPage() {
  const me = await getCurrentUser();

  return <FeedClient me={me ? { id: me.id, isAdmin: me.isAdmin } : null} showAll={true} />;
}
