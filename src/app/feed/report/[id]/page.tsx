/**
 * /feed/report/[id]
 * Страница просмотра одного отчета
 */
import { getCurrentUser } from '@/lib/currentUser';
import { ReportViewClient } from './ui';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getCurrentUser();

  return <ReportViewClient reportId={id} me={me ? { id: me.id, isAdmin: me.isAdmin } : null} />;
}
