import { i18n } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';

export function i18nRedirect(from: URL, to: string) {
  const lang = i18n.getLanguageFromUrl(from);
  return redirect(302, i18n.resolveRoute(to, lang));
}
