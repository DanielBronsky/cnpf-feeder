/**
 * /admin/users
 * Админ-страница управления пользователями.
 */
import { AdminUsersClient } from './ui';

export default async function AdminUsersPage() {
  return (
    <>
      <h1 style={{ fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>Пользователи</h1>
      <p style={{ opacity: 0.75, marginBottom: 16 }}>Управление правами администратора.</p>
      <AdminUsersClient />
    </>
  );
}

