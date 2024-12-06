import type { RequestEvent } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
  if (event.locals.user === null) {
    return redirect(302, i18n.resolveRoute('/login'));
  }
  return { user: event.locals.user };
}
