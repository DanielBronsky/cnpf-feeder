/**
 * POST /api/auth/set-cookie
 * Устанавливает cookie с JWT токеном после успешного GraphQL логина
 * Это необходимо, так как cookie от Backend (localhost:4000) не доступна для Frontend (localhost:3000)
 */
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.token) {
    console.error('[set-cookie] Token required but not provided');
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  console.log('[set-cookie] Setting cookie with token:', body.token.substring(0, 20) + '...');
  
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, body.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  console.log('[set-cookie] Cookie set successfully');
  return res;
}
