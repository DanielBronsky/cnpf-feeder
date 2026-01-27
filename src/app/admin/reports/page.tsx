/**
 * /admin/reports
 * Админ-страница управления отчётами.
 */
import { AdminReportsClient } from './ui';

export default function AdminReportsPage() {
  return (
    <>
      <h1 style={{ fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>Вести / отчёты</h1>
      <p style={{ opacity: 0.75, marginBottom: 16 }}>Управление отчётами: редактирование и удаление.</p>
      <AdminReportsClient />
    </>
  );
}
