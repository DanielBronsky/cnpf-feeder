/**
 * src/lib/currentUser.ts
 * Серверный helper: достаёт текущего пользователя по JWT cookie (cnpf_auth).
 *
 * Используется в server components и API routes.
 */

import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

import { AUTH_COOKIE, verifyAuthToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  hasAvatar: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  
  if (!token) {
    console.log('[getCurrentUser] No token found in cookies');
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);
    console.log('[getCurrentUser] Token verified, userId:', payload.sub);
    
    const db = await getDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(payload.sub) },
      { projection: { email: 1, username: 1, isAdmin: 1, hasAvatar: 1 } }
    );

    if (!user) {
      console.log('[getCurrentUser] User not found in database for userId:', payload.sub);
      return null;
    }

    console.log('[getCurrentUser] User found:', user.email);
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username ?? user.email,
      isAdmin: Boolean(user.isAdmin),
      hasAvatar: Boolean(user.hasAvatar),
    };
  } catch (error) {
    console.error('[getCurrentUser] Error:', error);
    return null;
  }
}

