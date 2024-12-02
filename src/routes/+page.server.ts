import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/user-auth';
import { i18nRedirect } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  // if user is not logged in, this value will be undefined
  return { user: event.locals.user };
};

export const actions: Actions = {
  logout: async (event) => {
    console.log('logout action');
    if (!event.locals.userSession) {
      return fail(401);
    }
    await auth.invalidateSession(event.locals.userSession.encodedToken);
    auth.deleteSessionTokenCookie(event);

    return i18nRedirect(event.url, '/');
  },
};
