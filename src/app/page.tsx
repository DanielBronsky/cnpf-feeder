/**
 * /
 * Главная: лента “Вести с водоёмов, отчёты”.
 */
import { getCurrentUser } from '@/lib/currentUser';
import { FeedClient } from './feed/ui';

export default async function Home() {
  const me = await getCurrentUser();

  return <FeedClient me={me ? { id: me.id, isAdmin: me.isAdmin } : null} limit={3} />;
}
