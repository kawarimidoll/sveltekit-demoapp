// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import type { SessionValidationResult } from '$lib/server/auth';
import type { ParaglideLocals } from '@inlang/paraglide-sveltekit';

declare global {
  namespace App {
    interface Locals {
      user: SessionValidationResult['user'];
      session: SessionValidationResult['userSession'];
      paraglide: ParaglideLocals<AvailableLanguageTag>;
    }
  }
}

export {};
