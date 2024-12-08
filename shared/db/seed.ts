import { reset } from 'drizzle-seed';
import { hashPassword } from '../../apps/user/src/lib/server/password';
import { db } from './index';
import * as schema from './schema';

async function insertUser(email: string) {
  // super easy password for dev
  const password = 'hello123';
  const passwordHash = await hashPassword(password);
  const username = email.replace(/@.+$/, '');

  await db
    .insert(schema.user)
    .values({ email, passwordHash, username });
}
async function insertAdmin(email: string, level: string) {
  // super easy password for dev
  const password = 'hello123';
  const passwordHash = await hashPassword(password);
  const name = email.replace(/@.+$/, '');

  await db
    .insert(schema.admin)
    .values({ email, passwordHash, name, level });
}
async function main() {
  console.log('seed start');

  await reset(db, schema);

  const userEmails = [
    'hello@example.com',
    'user0@example.com',
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
    'user4@example.com',
    'user5@example.com',
    'user6@example.com',
    'user7@example.com',
    'user8@example.com',
    'user9@example.com',
  ];
  await Promise.all([
    ...userEmails.map(email => insertUser(email)),
    insertAdmin('admin@example.com', 'super'),
    insertAdmin('staff1@example.com', 'normal'),
    insertAdmin('staff2@example.com', 'normal'),
    insertAdmin('staff3@example.com', 'limited'),
  ]);

  console.log('seed completed');
}

main();
