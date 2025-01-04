<script lang='ts' generics='TData'>
  import type { Table } from '@tanstack/table-core';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Input } from '$lib/components/ui/input';

  const { table }: { table: Table<TData> } = $props();

  let globalFilterValue = $state('');
  $effect(() => {
    table.setGlobalFilter(globalFilterValue);
    return () => '';
  });
  table.setGlobalFilter('');
</script>

<div class='flex items-center justify-between'>
  <div class='flex flex-1 items-center space-x-2'>
    <Input
      placeholder='Filter...'
      bind:value={globalFilterValue}
      class='h-8 max-w-sm'
      resetIf={() => globalFilterValue !== ''}
    />
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
