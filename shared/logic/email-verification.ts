import type { RequestEvent } from '@sveltejs/kit';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { and, eq } from 'drizzle-orm';
import { deleteCookie, setCookie } from './cookie';
import { generateRandomCode } from './utils';

export async function getEmailVerification(email: string, code: string): Promise<table.EmailVerification | null> {
  const [existingRecord] = await db
    .select()
    .from(table.emailVerification)
    .where(
      and(
        eq(table.emailVerification.email, email),
        eq(table.emailVerification.code, code),
      ),
    );

  return existingRecord;
}

export async function createEmailVerification(email: string): Promise<table.EmailVerification> {
  await deleteEmailVerification(email);

  const code = generateRandomCode(12);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  const [insertedRecord] = await db
    .insert(table.emailVerification)
    .values({ email, code, expiresAt })
    .returning();

  return insertedRecord;
}

export async function deleteEmailVerification(email: string): Promise<void> {
  await db.delete(table.emailVerification).where(eq(table.emailVerification.email, email));
}

export function sendVerificationEmail(email: string, code: string): void {
  // NOTE: use send mail api in production
  console.log('--- Verification Email ---');
  console.log(`To ${email}:`);
  console.log(`Your verification code is: ${code}`);
  console.log('This will be expired in 10 minutes.');
  console.log('--------------------------');
}

const cookieName = 'email-verification-cookie';

export function setEmailVerificationCookie(event: RequestEvent, verification: table.EmailVerification): void {
  setCookie(event, cookieName, verification.email, verification.expiresAt);
}

export function getEmailVerificationCookie(event: RequestEvent) {
  return event.cookies.get(cookieName);
}
export function deleteEmailVerificationCookie(event: RequestEvent): void {
  deleteCookie(event, cookieName);
}
