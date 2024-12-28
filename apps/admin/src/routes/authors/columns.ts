import type { schema } from '@shared/db';
import type { ColumnDef } from '@tanstack/table-core';

import { format } from '@std/datetime';

export const columns: ColumnDef<typeof schema.author.$inferSelect>[] = [
  // Name
  // Description
  // Created at
  // Updated at
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({ row }) => format(row.getValue('createdAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated at',
    cell: ({ row }) => format(row.getValue('updatedAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
];
