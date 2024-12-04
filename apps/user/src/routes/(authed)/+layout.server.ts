import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { isAuth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function load(event: RequestEvent): LayoutServerLoad {
  if (!isAuth(event)) {
    return redirect(302, '/login');
  }
  return { user: event.locals.user };
}
