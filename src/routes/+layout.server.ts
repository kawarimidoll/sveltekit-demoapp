import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  console.log('layout load');
  console.log(locals);
  return {
    user: locals.user,
    admin: locals.admin,
  };
};
