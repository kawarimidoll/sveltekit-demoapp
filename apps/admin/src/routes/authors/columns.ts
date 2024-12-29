import type { schema } from '@shared/db';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { format } from '@std/datetime';
import DataTableActions from './data-table-actions.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import DataTableColumnHeader from './data-table-column-header.svelte';

export const columns: ColumnDef<typeof schema.author.$inferSelect>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        'checked': table.getIsAllPageRowsSelected(),
        'indeterminate':
          table.getIsSomePageRowsSelected()
          && !table.getIsAllPageRowsSelected(),
        'onCheckedChange': value => table.toggleAllPageRowsSelected(!!value),
        'controlledChecked': true,
        'aria-label': 'Select all',
        'class': 'translate-y-[2px]',
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        'checked': row.getIsSelected(),
        'onCheckedChange': value => row.toggleSelected(!!value),
        'controlledChecked': true,
        'aria-label': 'Select row',
        'class': 'translate-y-[2px]',
      }),
    enableSorting: false,
    enableHiding: false,
  },
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
    header: ({ column }) => {
      return renderComponent(DataTableColumnHeader, {
        column,
        title: 'Created at',
      });
    },
    cell: ({ row }) => format(row.getValue('createdAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return renderComponent(DataTableColumnHeader, {
        column,
        title: 'Updated at',
      });
    },
    cell: ({ row }) => format(row.getValue('updatedAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { id: row.original.id });
    },
    enableSorting: false,
    enableHiding: false,
  },
];
