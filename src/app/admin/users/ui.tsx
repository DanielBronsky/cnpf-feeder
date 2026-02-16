'use client';

/**
 * /admin/users UI (client)
 * Рендерит таблицу пользователей и позволяет переключать isAdmin.
 */

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { ADMIN_USERS_QUERY } from '@/lib/graphql/queries';
import { ADMIN_UPDATE_USER_MUTATION, ADMIN_DELETE_USER_MUTATION } from '@/lib/graphql/mutations';

type UserRow = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  hasAvatar: boolean;
  createdAt?: string;
};

export function AdminUsersClient() {
  const [err, setErr] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(ADMIN_USERS_QUERY);
  const [updateUserMutation] = useMutation(ADMIN_UPDATE_USER_MUTATION, {
    refetchQueries: [{ query: ADMIN_USERS_QUERY }],
  });
  const [deleteUserMutation] = useMutation(ADMIN_DELETE_USER_MUTATION, {
    refetchQueries: [{ query: ADMIN_USERS_QUERY }],
  });

  const rows: UserRow[] = data?.adminUsers || [];
  const adminsCount = useMemo(() => rows.filter((r) => r.isAdmin).length, [rows]);

  // Handle error from useQuery - use useEffect to avoid calling setState during render
  useEffect(() => {
    if (error) {
      setErr(error.message);
    }
  }, [error]);

  async function toggleAdmin(userId: string, next: boolean) {
    setErr('');
    setSavingId(userId);
    try {
      const { errors } = await updateUserMutation({
        variables: {
          id: userId,
          isAdmin: next,
        },
      });
      
      if (errors) {
        throw new Error(errors[0]?.message ?? 'Failed to update');
      }
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    } finally {
      setSavingId(null);
    }
  }
  
  async function deleteUser(userId: string) {
    if (!confirm('Удалить пользователя?')) return;
    
    setErr('');
    setSavingId(userId);
    try {
      const { errors } = await deleteUserMutation({
        variables: { id: userId },
      });
      
      if (errors) {
        throw new Error(errors[0]?.message ?? 'Failed to delete');
      }
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <div style={{ opacity: 0.8 }}>Загрузка...</div>;
  if (err) return <div style={{ color: 'var(--danger)' }}>{err}</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ opacity: 0.75 }}>Админов: {adminsCount}</div>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--surface-3)',
          }}
        >
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.8 }}>
              <th style={{ padding: 12 }}>User</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border-soft)' }}>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {u.hasAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/user/avatar/${u.id}`}
                        alt="avatar"
                        width={28}
                        height={28}
                        style={{ borderRadius: 999, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid var(--border)',
                        }}
                      />
                    )}
                    <div style={{ fontWeight: 700 }}>{u.username}</div>
                  </div>
                </td>
                <td style={{ padding: 12, opacity: 0.9 }}>{u.email}</td>
                <td style={{ padding: 12 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={u.isAdmin}
                      disabled={savingId === u.id}
                      onChange={(e) => toggleAdmin(u.id, e.target.checked)}
                    />
                    <span style={{ opacity: 0.85 }}>
                      {savingId === u.id ? '...' : u.isAdmin ? 'admin' : 'user'}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={() => refetch()}>
          Обновить список
        </button>
      </div>
    </div>
  );
}

