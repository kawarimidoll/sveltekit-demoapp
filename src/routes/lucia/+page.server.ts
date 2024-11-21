import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/lucia/login');
  }
  return { user: event.locals.user };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    await auth.invalidateSession(event.locals.session.encodedToken);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/lucia/login');
  },
};
