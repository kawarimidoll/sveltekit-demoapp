import type { Actions, PageServerLoad } from './$types';
import { checkEmailAvailability, verifyEmailInput } from '$lib/server/email';
import * as ev from '$lib/server/email-verification';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }

  return {};
};

export const actions: Actions = {
  request_verify: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');

    // check email
    if (!verifyEmailInput(email)) {
      return fail(400, { message: 'Invalid email' });
    }
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return fail(400, { message: 'Email is already used' });
    }

    try {
      const emailVerification = await ev.createEmailVerification(email);
      ev.setEmailVerificationCookie(event, emailVerification);
      ev.sendVerificationEmail(emailVerification.email, emailVerification.code);
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return redirect(302, '/register');
  },
};
