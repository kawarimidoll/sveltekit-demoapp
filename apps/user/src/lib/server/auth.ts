import type { RequestEvent } from '@sveltejs/kit';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { deleteCookie, setCookie } from '@shared/logic/cookie';
import { encodeSessionToken } from '@shared/logic/session-token';
import { eq } from 'drizzle-orm';

export { generateSessionToken } from '@shared/logic/session-token';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EXPIRATION_DAYS = DAY_IN_MS * 30;

export const sessionCookieName = 'user-auth-session';

export function isAuth(event: RequestEvent) {
  return event.locals.session && event.locals.user;
}

export async function createSession(token: string, userId: string) {
  const encodedToken = encodeSessionToken(token);
  await db.insert(table.userSession).values({
    encodedToken,
    userId,
    expiresAt: new Date(Date.now() + EXPIRATION_DAYS),
  });
  return session;
}

export async function validateSessionToken(token: string) {
  const encodedToken = encodeSessionToken(token);
  const [result] = await db
    .select({
      // Adjust user table here to tweak returned data
      user: { id: table.user.id, username: table.user.username, email: table.user.email },
      session: table.userSession,
    })
    .from(table.userSession)
    .innerJoin(table.user, eq(table.userSession.userId, table.user.id))
    .where(eq(table.userSession.encodedToken, encodedToken));

  if (!result) {
    return { session: null, user: null };
  }
  const { session, user } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(table.userSession).where(eq(table.userSession.encodedToken, encodedToken));
    return { session: null, user: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - EXPIRATION_DAYS / 2;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + EXPIRATION_DAYS);
    await db
      .update(table.userSession)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.userSession.encodedToken, encodedToken));
  }

  return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(encodedToken: string) {
  await db.delete(table.userSession).where(eq(table.userSession.encodedToken, encodedToken));
}

export async function invalidateAllSession(userId: string) {
  await db.delete(table.userSession).where(eq(table.userSession.userId, userId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  setCookie(event, sessionCookieName, token, expiresAt);
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  deleteCookie(event, sessionCookieName);
}
