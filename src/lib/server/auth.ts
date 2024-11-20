import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EXPIRATION_DAYS = DAY_IN_MS * 30;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);
  return token;
}

export function encodeSessionToken(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(token: string, userId: string) {
  const encodedToken = encodeSessionToken(token);
  const session: table.Session = {
    encodedToken,
    userId,
    expiresAt: new Date(Date.now() + EXPIRATION_DAYS),
  };
  await db.insert(table.session).values(session);
  return session;
}

export async function validateSessionToken(token: string) {
  const encodedToken = encodeSessionToken(token);
  const [result] = await db
    .select({
      // Adjust user table here to tweak returned data
      user: { id: table.user.id, username: table.user.username },
      session: table.session,
    })
    .from(table.session)
    .innerJoin(table.user, eq(table.session.userId, table.user.id))
    .where(eq(table.session.encodedToken, encodedToken));

  if (!result) {
    return { session: null, user: null };
  }
  const { session, user } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(table.session).where(eq(table.session.encodedToken, session.encodedToken));
    return { session: null, user: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - EXPIRATION_DAYS / 2;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + EXPIRATION_DAYS);
    await db
      .update(table.session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.session.encodedToken, session.encodedToken));
  }

  return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(encodedToken: string) {
  await db.delete(table.session).where(eq(table.session.encodedToken, encodedToken));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  // the `secure` flag is not required here because
  // SvelteKit automatically sets the flag when deployed to production
  event.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(sessionCookieName, {
    path: '/',
  });
}
