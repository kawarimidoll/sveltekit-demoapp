import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { i18nRedirect } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  // if user is not logged in, this value will be undefined
  return { user: event.locals.user };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    await auth.invalidateSession(event.locals.session.encodedToken);
    auth.deleteSessionTokenCookie(event);

    return i18nRedirect(event.url, '/');
  },
};
