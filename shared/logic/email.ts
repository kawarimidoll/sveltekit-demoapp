import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { eq } from 'drizzle-orm';

export function verifyEmailInput(email: unknown): email is string {
  return (
    typeof email === 'string'
    && /^.[^\n\r@\u2028\u2029]*@.[^\n\r.\u2028\u2029]*\..+$/.test(email)
    && email.length < 256
  );
}

export async function checkUserEmailAvailability(email: string): Promise<boolean> {
  const [user] = await db.select()
    .from(table.user)
    .where(eq(table.user.email, email))
    .limit(1);

  // blank user means email isn't used
  return user == null;
}

export async function checkAdminEmailAvailability(email: string): Promise<boolean> {
  const [admin] = await db.select()
    .from(table.admin)
    .where(eq(table.admin.email, email))
    .limit(1);

  // blank admin means email isn't used
  return admin == null;
}
