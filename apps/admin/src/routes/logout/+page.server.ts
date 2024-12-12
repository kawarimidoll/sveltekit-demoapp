import type { Actions, RequestEvent } from './$types';
import { i18n } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    if (!event.locals.session) {
      console.log('not login');
      return fail(401);
    }
    await auth.invalidateSession(event.locals.session.encodedToken);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, i18n.resolveRoute('/login'));
  },
};
