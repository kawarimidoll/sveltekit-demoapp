import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const { locals, url } = event;
  if (!locals.admin) {
    if (url.pathname !== '/admin/login') {
      return redirect(302, `/admin/login?redirectTo=${url.pathname}`);
    }
    return;
  }
  return { admin: locals.admin };
};
