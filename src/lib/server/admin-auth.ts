import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EXPIRATION_DAYS = DAY_IN_MS * 30;

export const sessionCookieName = 'demo-admin-auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);
  return token;
}

function encodeSessionToken(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(token: string, adminId: string) {
  const encodedToken = encodeSessionToken(token);
  const session: table.AdminSession = {
    encodedToken,
    adminId,
    expiresAt: new Date(Date.now() + EXPIRATION_DAYS),
  };
  await db.insert(table.adminSession).values(session);
  return session;
}

export async function validateSessionToken(token: string) {
  const encodedToken = encodeSessionToken(token);
  const [result] = await db
    .select({
      // Adjust admin table here to tweak returned data
      admin: { id: table.admin.id, email: table.admin.email },
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
    await db.delete(table.adminSession).where(eq(table.adminSession.encodedToken, session.encodedToken));
    return { session: null, admin: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - EXPIRATION_DAYS / 2;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + EXPIRATION_DAYS);
    await db
      .update(table.adminSession)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.adminSession.encodedToken, session.encodedToken));
  }

  return { session, admin };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(encodedToken: string) {
  await db.delete(table.adminSession).where(eq(table.adminSession.encodedToken, encodedToken));
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
