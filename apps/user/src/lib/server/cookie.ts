import type { RequestEvent } from '@sveltejs/kit';

export function setCookie(event: RequestEvent, name: string, value: string, expiresAt: Date) {
  // the `secure` flag is not required here because
  // SvelteKit automatically sets the flag when deployed to production
  event.cookies.set(name, value, {
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export function deleteCookie(event: RequestEvent, name: string) {
  event.cookies.delete(name, {
    path: '/',
    maxAge: 0,
  });
}
