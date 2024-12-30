<script lang='ts' generics='TData'>
  import type { Table } from '@tanstack/table-core';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Input } from '$lib/components/ui/input';

  const { table }: { table: Table<TData> } = $props();
  const isFiltered = $derived(table.getState().columnFilters.length > 0);
</script>

<div class='flex items-center justify-between py-4'>
  <div class='flex flex-1 items-center space-x-2'>
    <Input
      placeholder='Filter names...'
      value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
      onchange={(e) => {
        table.getColumn('name')?.setFilterValue(e.currentTarget.value);
      }}
      oninput={(e) => {
        table.getColumn('name')?.setFilterValue(e.currentTarget.value);
      }}
      class='h-8 max-w-sm'
    />
    {#if isFiltered}
      <Button
        variant='ghost'
        onclick={() => table.resetColumnFilters()}
        class='h-8 px-2 lg:px-3'
      >
        Reset
        <span class='i-lucide-x'></span>
      </Button>
    {/if}
  </div>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class={buttonVariants({
        variant: 'outline',
        size: 'sm',
        class: 'ml-auto hidden h-8 md:flex',
      })}
    >
      <span class='i-lucide-settings-2'></span>
      View
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align='end'>
      <DropdownMenu.Group>
        <DropdownMenu.GroupHeading>Toggle columns</DropdownMenu.GroupHeading>
        <DropdownMenu.Separator />
        {#each table
          .getAllColumns()
          .filter(col => col.getCanHide()) as column (column.id)}
          <DropdownMenu.CheckboxItem
            class='capitalize'
            controlledChecked
            checked={column.getIsVisible()}
            onCheckedChange={value => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenu.CheckboxItem>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
