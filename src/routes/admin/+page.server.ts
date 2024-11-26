import type { Actions } from './$types';
import * as auth from '$lib/server/admin-auth';
import { i18nRedirect } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.adminSession) {
      return fail(401);
    }
    await auth.invalidateSession(event.locals.adminSession.encodedToken);
    auth.deleteSessionTokenCookie(event);

    return i18nRedirect(event.url, '/admin');
  },
};
