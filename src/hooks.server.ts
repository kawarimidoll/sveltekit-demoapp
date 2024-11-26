import type { Handle, RequestEvent } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import * as adminAuth from '$lib/server/admin-auth';
// import * as table from '$lib/server/db/schema';
import * as userAuth from '$lib/server/user-auth';
import { sequence } from '@sveltejs/kit/hooks';

interface UserLocale {
  user: userAuth.SessionValidationResult['user'];
  userSession: userAuth.SessionValidationResult['session'];
}
async function handleUserSession(event: RequestEvent): Promise<UserLocale> {
  const sessionToken = event.cookies.get(userAuth.sessionCookieName);
  if (!sessionToken) {
    return { user: null, userSession: null };
  }

  const { session, user } = await userAuth.validateSessionToken(sessionToken);
  if (session) {
    userAuth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  }
  else {
    userAuth.deleteSessionTokenCookie(event);
  }

  return {
    user,
    userSession: session,
  };
}

interface AdminLocale {
  admin: adminAuth.SessionValidationResult['admin'];
  adminSession: adminAuth.SessionValidationResult['session'];
}
async function handleAdminSession(event: RequestEvent): Promise<AdminLocale> {
  const sessionToken = event.cookies.get(adminAuth.sessionCookieName);
  if (!sessionToken) {
    return { admin: null, adminSession: null };
  }

  const { session, admin } = await adminAuth.validateSessionToken(sessionToken);
  if (session) {
    adminAuth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  }
  else {
    adminAuth.deleteSessionTokenCookie(event);
  }

  return {
    admin,
    adminSession: session,
  };
}

const handleAuth: Handle = async ({ event, resolve }) => {
  console.log('main hook');
  event.locals = {
    ...event.locals,
    ...(await handleUserSession(event)),
    ...(await handleAdminSession(event)),
  };

  return resolve(event);
};

const handleParaglide: Handle = i18n.handle();
export const handle: Handle = sequence(handleAuth, handleParaglide);
