<script lang='ts' module>
  type TData = unknown;
  type TValue = unknown;
</script>

<script lang='ts' generics='TData, TValue'>
  import type { Column } from '@tanstack/table-core';
  import type { WithoutChildren } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '$lib/components/ui/button/index.js';

  type Props = HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
  };

  const { column, title }: WithoutChildren<Props> = $props();
</script>

{#if !column?.getCanSort()}
  <div>
    {title}
  </div>
{:else}
  <div>
    <Button
      variant='ghost'
      size='sm'
      class='h-8 -ml-3 data-[state=open]:bg-accent'
      onclick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      <span>{title}</span>
      {#if column.getIsSorted() === 'desc'}
        <div class='i-lucide-arrow-down ml-2 size-4'></div>
      {:else if column.getIsSorted() === 'asc'}
        <div class='i-lucide-arrow-up ml-2 size-4'></div>
      {:else}
        <div class='i-lucide-chevrons-up-down ml-2 size-4'></div>
      {/if}
    </Button>
  </div>
{/if}
