// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/user-auth').SessionValidationResult['user'];
      userSession: import('$lib/server/user-auth').SessionValidationResult['session'];
      admin: import('$lib/server/admin-auth').SessionValidationResult['admin'];
      adminSession: import('$lib/server/admin-auth').SessionValidationResult['session'];
    }
  }
}

export {};
