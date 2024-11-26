// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/user-auth').SessionValidationResult['user'];
      userSession: import('$lib/server/user-auth').SessionValidationResult['userSession'];
    }
  }
}

export {};
