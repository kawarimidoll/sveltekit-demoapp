import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    event.locals.admin = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, admin } = await auth.validateSessionToken(sessionToken);
  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  }
  else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.admin = admin;
  event.locals.session = session;

  return resolve(event);
};

const handleParaglide: Handle = i18n.handle();
export const handle: Handle = sequence(handleAuth, handleParaglide);
