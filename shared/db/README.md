# db

db module

## tips

When adding `notNull` column, it may cause an error because it doesn't have
value after created even if it has default value.

To work around it:

1. add column without `notNull` specifier
2. run update script to add default values

```ts
// update.ts
import { db } from '@shared/db';
import * as table from '@shared/db/schema';

async function main() {
  console.log('update');
  console.log('start');
  await db.update(table.updateTarget).set({ newColumn: DEFAULT_VALUE });
  console.log('end');
}

main();
```

3. apply `notNull` specifier
