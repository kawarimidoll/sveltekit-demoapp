import { eq } from 'drizzle-orm';
import { db } from './db';
import * as table from './db/schema';

export function verifyEmailInput(email: string): boolean {
  return /^.[^\n\r@\u2028\u2029]*@.[^\n\r.\u2028\u2029]*\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): boolean {
  const [user] = await db.select()
    .from(table.user)
    .where(eq(table.user.email, email))
    .limit(10);

  // blank user means email isn't used
  return user == null;
}
