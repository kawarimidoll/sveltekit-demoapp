import type { RequestEvent } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
  if (!event.locals.admin) {
    const canonicalPath = i18n.route(event.url.pathname);
    if (canonicalPath !== '/login') {
      return redirect(302, i18n.resolveRoute('/login'));
    }
    return {};
  }

  const { admin } = event.locals;
  return {
    admin,
    isSuper: admin.level === 'super',
  };
}
