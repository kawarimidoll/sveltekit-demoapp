import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';

export async function load(event: RequestEvent): LayoutServerLoad {
  if (!event.locals.admin) {
    const canonicalPath = i18n.route(event.url.pathname);
    if (canonicalPath !== '/login') {
      return redirect(302, i18n.resolveRoute('/login'));
    }
    return {};
  }
  return { admin: event.locals.admin };
}
