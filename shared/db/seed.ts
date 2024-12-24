import { rangeIterator } from '@hugoalh/range-iterator';
import { hashPassword } from '@shared/logic/password';
import { sample } from '@std/collections/sample';
import { reset } from 'drizzle-seed';
import { db, handler, schema } from './index';
import list from './ndc_list.json';

function nums(max: number) {
  return Array.from(rangeIterator(1, max));
}

async function insertGenre(code: string, description: string) {
  await db
    .insert(schema.genre)
    .values({ code, description });
}

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
    ...Object.entries(list)
      .map(([code, description]) => insertGenre(code, description)),
    insertGenre('N/A', 'unknown genre'),
    insertUser('hello@example.com'),
    ...nums(40).map(n => insertUser(`user${n}@example.com`)),
    insertAdmin('admin@example.com', 'super'),
    ...nums(20).map(n => insertAdmin(`member${n}@example.com`, 'normal')),
    ...nums(20).map(n => insertAdmin(`supporter${n}@example.com`, 'limited')),
  ]);

  const publishers = await db.insert(schema.publisher)
    .values(nums(10).map(n => ({ name: `publisher${n}` })))
    .returning({ id: schema.publisher.id });
  const authors = await db.insert(schema.author)
    .values(nums(10).map(n => ({ name: `author${n}` })))
    .returning({ id: schema.author.id });

  // set 10 years ago
  const publishDate = new Date();
  publishDate.setFullYear(publishDate.getFullYear() - 10);

  const books = await Promise.all(
    nums(20).map((n) => {
      const title = `book${n}`;
      const publisherId = sample(publishers)!.id;
      const authorId = n < 2
        ? [sample(authors)!.id, sample(authors)!.id]
        : sample(authors)!.id;
      return handler.insertBook({ title, publisherId, authorId, publishDate });
    }),
  );

  console.log({ publishers, authors, books });

  console.log('seed completed');
}

main();
