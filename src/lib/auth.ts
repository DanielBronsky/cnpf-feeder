/**
 * src/lib/auth.ts
 * JWT-аутентификация: подпись/проверка токена и имя cookie.
 *
 * Токен хранится в httpOnly cookie (чтобы JS на клиенте не мог его прочитать).
 */
import { SignJWT, jwtVerify } from 'jose';

let cachedKey: Uint8Array | null = null;

function getKey() {
  if (cachedKey) return cachedKey;
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('Missing AUTH_SECRET in .env.local');
  cachedKey = new TextEncoder().encode(secret);
  return cachedKey;
}

export type AuthPayload = {
  sub: string; // userId
  email: string;
};

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getKey());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getKey());
  return payload as unknown as AuthPayload & { exp: number; iat: number };
}

export const AUTH_COOKIE = 'cnpf_auth';

