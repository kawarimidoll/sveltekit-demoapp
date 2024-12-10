import { rangeIterator } from '@hugoalh/range-iterator';
import { hashPassword } from '@shared/logic/password';
import { reset } from 'drizzle-seed';
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

  console.log('reset local db');
  await reset(db, schema);

  console.log('insert data');
  await Promise.all([
    insertUser('hello@example.com'),
    ...Array.from(rangeIterator(1, 40))
      .map(e => insertUser(`user${e}@example.com`)),
    insertAdmin('admin@example.com', 'super'),
    ...Array.from(rangeIterator(1, 20))
      .map(e => insertAdmin(`member${e}@example.com`, 'normal')),
    ...Array.from(rangeIterator(1, 20))
      .map(e => insertAdmin(`supporter${e}@example.com`, 'limited')),
  ]);

  console.log('seed completed');
}

main();
