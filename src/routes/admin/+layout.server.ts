import type { LayoutServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import { i18nRedirect } from '$lib/server/utils';

export const load: LayoutServerLoad = async (event) => {
  const { locals, url } = event;
  if (!locals.admin) {
    const canonicalPath = i18n.route(url.pathname);
    if (canonicalPath !== '/admin/login') {
      // FIXME: i18nRedirect removes the query string
      return i18nRedirect(url, `/admin/login?redirectTo=${url.pathname}`);
    }
    return;
  }
  return { admin: locals.admin };
};
