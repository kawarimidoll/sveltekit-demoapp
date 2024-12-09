import type { RequestEvent } from '@sveltejs/kit';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { deleteCookie, setCookie } from '@shared/logic/cookie';
import { encodeSessionToken } from '@shared/logic/session-token';
import { eq } from 'drizzle-orm';

export { generateSessionToken } from '@shared/logic/session-token';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EXPIRATION_DAYS = DAY_IN_MS * 30;

export const sessionCookieName = 'admin-auth-session';

export function isAuth(event: RequestEvent) {
  return event.locals.session && event.locals.admin;
}

export async function createSession(token: string, adminId: string) {
  const encodedToken = encodeSessionToken(token);
  const [insertedSession] = await db
    .insert(table.adminSession)
    .values({
      encodedToken,
      adminId,
      expiresAt: new Date(Date.now() + EXPIRATION_DAYS),
    })
    .returning();
  return insertedSession;
}

export async function validateSessionToken(token: string) {
  const encodedToken = encodeSessionToken(token);
  const [result] = await db
    .select({
      // Adjust admin table here to tweak returned data
      admin: { id: table.admin.id, name: table.admin.name, email: table.admin.email },
      session: table.adminSession,
    })
    .from(table.adminSession)
    .innerJoin(table.admin, eq(table.adminSession.adminId, table.admin.id))
    .where(eq(table.adminSession.encodedToken, encodedToken));

  if (!result) {
    return { session: null, admin: null };
  }
  const { session, admin } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(table.adminSession).where(eq(table.adminSession.encodedToken, encodedToken));
    return { session: null, admin: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - EXPIRATION_DAYS / 2;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + EXPIRATION_DAYS);
    await db
      .update(table.adminSession)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.adminSession.encodedToken, encodedToken));
  }

  return { session, admin };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(encodedToken: string) {
  await db.delete(table.adminSession).where(eq(table.adminSession.encodedToken, encodedToken));
}

export async function invalidateAllSession(adminId: string) {
  await db.delete(table.adminSession).where(eq(table.adminSession.adminId, adminId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  setCookie(event, sessionCookieName, token, expiresAt);
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  deleteCookie(event, sessionCookieName);
}
