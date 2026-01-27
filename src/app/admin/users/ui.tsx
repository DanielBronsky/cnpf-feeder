'use client';

/**
 * /admin/users UI (client)
 * Рендерит таблицу пользователей и позволяет переключать isAdmin.
 */

import { useEffect, useMemo, useState } from 'react';

type UserRow = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  hasAvatar: boolean;
  createdAt?: string;
};

export function AdminUsersClient() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const adminsCount = useMemo(() => rows.filter((r) => r.isAdmin).length, [rows]);

  async function load() {
    setErr('');
    setLoading(true);
    try {
      const r = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed to load');
      setRows(data.users ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggleAdmin(userId: string, next: boolean) {
    setErr('');
    setSavingId(userId);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ isAdmin: next }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed to update');
      setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: next } : u)));
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
        <button type="button" onClick={load}>
          Обновить список
        </button>
      </div>
    </div>
  );
}

