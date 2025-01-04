<script lang='ts' module>
  type TData = unknown;
  type TValue = unknown;
</script>

<script lang='ts' generics='TData, TValue'>
  import type {
    ColumnDef,
    ColumnFiltersState,
    GlobalFilterTableState,
    PaginationState,
    RowSelectionState,
    SortingState,
    VisibilityState,
  } from '@tanstack/table-core';
  import { buttonVariants } from '$lib/components/ui/button';
  import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Drawer from '$lib/components/ui/drawer';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from '@tanstack/table-core';
  import { toast } from 'svelte-sonner';
  import { MediaQuery } from 'svelte/reactivity';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';

  import { zodClient } from 'sveltekit-superforms/adapters';
  import DataTablePagination from './data-table-pagination.svelte';
  import DataTableToolbar from './data-table-toolbar.svelte';
  import { insertSchema, type InsertSchema } from './schema';

  type Props = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    form: SuperValidated<Infer<InsertSchema>>;
  };
  const { columns, data, form: formSrc }: Props = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let columnVisibility = $state<VisibilityState>({});
  let rowSelection = $state<RowSelectionState>({});
  let globalFilter = $state<GlobalFilterTableState>({ globalFilter: '' });

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    state: {
      get pagination() {
        return pagination;
      },
      get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      },
      get columnVisibility() {
        return columnVisibility;
      },
      get rowSelection() {
        return rowSelection;
      },
      get globalFilter() {
        return globalFilter;
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      }
      else {
        pagination = updater;
      }
    },
    enableRowSelection: true,
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      }
      else {
        sorting = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      }
      else {
        columnFilters = updater;
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === 'function') {
        columnVisibility = updater(columnVisibility);
      }
      else {
        columnVisibility = updater;
      }
    },
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        rowSelection = updater(rowSelection);
      }
      else {
        rowSelection = updater;
      }
    },
    onGlobalFilterChange: (updater) => {
      if (typeof updater === 'function') {
        globalFilter = updater(globalFilter);
      }
      else {
        globalFilter = updater;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: 'includesString',
  });

  let open = $state(false);

  const form = superForm(formSrc, {
    validators: zodClient(insertSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`${f.data.name} is created.`);
        // TODO this doesn't work well
        open = false;
      }
      else {
        toast.error('Please fix the errors in the form.');
      }
    },
  });
  const { form: formData, enhance } = form;

  function openEditor() {
    open = true;
  }

  const isDesktop = new MediaQuery('(min-width: 768px)');
  const Component = $derived(isDesktop.current ? Dialog : Drawer);
  const formPadding = $derived(isDesktop.current ? '' : 'px-4');
</script>

<DataTableToolbar {table} addFn={openEditor} />

<div class='my-4 border rounded-md'>
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && 'selected'}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class='h-24 text-center'>
            No results.
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

<DataTablePagination {table} />

<Component.Root bind:open>
  <Component.Content>
    <Component.Header>
      <Component.Title>Edit author</Component.Title>
      <Component.Description>
        Make changes to author here. Click save when you're done.
      </Component.Description>
    </Component.Header>
    <form method='POST' action='?/create' use:enhance>
      <Form.Field {form} name='name' class={formPadding}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.Description>This is author's display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name='description' class={formPadding}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Input {...props} bind:value={$formData.description} />
          {/snippet}
        </Form.Control>
        <Form.Description>This is author's description.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Component.Footer>
        <Form.Button>Save changes</Form.Button>
        <Component.Close
          class={buttonVariants({ variant: 'outline' })}
        >Cancel</Component.Close>
      </Component.Footer>
    </form>
  </Component.Content>
</Component.Root>
