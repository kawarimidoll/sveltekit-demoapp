import type { schema } from '@shared/db';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { format } from '@std/datetime';
import DataTableActions from './data-table-actions.svelte';
import DataTableColumnHeader from './data-table-column-header.svelte';

export const columns: ColumnDef<typeof schema.author.$inferSelect>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return renderComponent(DataTableColumnHeader, {
        column,
        title: 'Name',
      });
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return renderComponent(DataTableColumnHeader, {
        column,
        title: 'Description',
      });
    },
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
  {
    header: 'Actions',
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { id: row.original.id });
    },
    enableSorting: false,
    enableHiding: false,
  },
];
