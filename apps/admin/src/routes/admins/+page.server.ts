import type { RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
// import { i18n } from '$lib/i18n';
// import * as auth from '$lib/server/auth';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
// import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (_event: RequestEvent) => {
  const admins = await db.select().from(table.admin);
  return { admins };
};
