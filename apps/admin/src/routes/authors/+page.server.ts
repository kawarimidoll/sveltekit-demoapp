import type { RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { insertSchema, updateSchema } from './schema';

export const load: PageServerLoad = async () => {
  const authors = await db.query.author.findMany();
  return {
    authors,
    insertForm: await superValidate(zod(insertSchema)),
    updateForm: await superValidate(zod(updateSchema)),
  };
};

export const actions: Actions = {
  create: async (event: RequestEvent) => {
    const formData = await event.request.formData();
    console.log(formData);

    const form = await superValidate(formData, zod(insertSchema));
    console.log(form);

    if (!form.valid) {
      return fail(400, { form });
    }

    const { name, description } = form.data;

    try {
      await db
        .insert(schema.author)
        .values({ name, description });
    }
    catch (e) {
      console.error(e);
      form.errors.push({ message: 'An error has occurred' });
      return fail(500, { form });
    }

    return { form };
  },
  update: async (event: RequestEvent) => {
    console.log('update');
    console.log(event);

    const formData = await event.request.formData();
    console.log(formData);

    const form = await superValidate(formData, zod(updateSchema));
    console.log(form);

    if (!form.valid) {
      console.log('invalid form');
      return fail(400, { form });
    }

    const { id, name, description } = form.data;

    try {
      await db
        .update(schema.author)
        .set({ name, description })
        .where(eq(schema.author.id, id));
    }
    catch (e) {
      console.error(e);
      form.errors.push({ message: 'An error has occurred' });
      return fail(500, { form });
    }

    console.log('Author updated!');

    return { form };
  },
};
