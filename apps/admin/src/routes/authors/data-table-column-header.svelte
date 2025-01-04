<script lang='ts' module>
  type TData = unknown;
  type TValue = unknown;
</script>

<script lang='ts' generics='TData, TValue'>
  import type { Column } from '@tanstack/table-core';
  import type { WithoutChildren } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { cn } from '$lib/utils';

  type Props = HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
  };

  const { column, class: className, title, ...restProps }: WithoutChildren<Props> = $props();
</script>

{#if !column?.getCanSort() && !column?.getCanHide()}
  <div class={className} {...restProps}>
    {title}
  </div>
{:else}
  <div class={cn('flex items-center', className)} {...restProps}>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            variant='ghost'
            size='sm'
            class='h-8 -ml-3 data-[state=open]:bg-accent'
          >
            <span>
              {title}
            </span>
            {#if column.getCanSort()}
              {#if column.getIsSorted() === 'desc'}
                <div class='i-lucide-arrow-down ml-2 size-4'></div>
              {:else if column.getIsSorted() === 'asc'}
                <div class='i-lucide-arrow-up ml-2 size-4'></div>
              {:else}
                <div class='i-lucide-chevrons-up-down ml-2 size-4'></div>
              {/if}
            {/if}
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align='start'>
        {#if column.getCanSort()}
          <DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
            <div class='i-lucide-arrow-up mr-2 size-3.5 text-muted-foreground/70'></div>
            Asc
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
            <div class='i-lucide-arrow-down mr-2 size-3.5 text-muted-foreground/70'></div>
            Desc
          </DropdownMenu.Item>
        {/if}
        {#if column.getCanSort() && column.getCanHide()}
          <DropdownMenu.Separator />
        {/if}
        {#if column.getCanHide()}
          <DropdownMenu.Item onclick={() => column.toggleVisibility(false)}>
            <div class='i-lucide-eye-off mr-2 size-3.5 text-muted-foreground/70'></div>
            Hide
          </DropdownMenu.Item>
        {/if}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
{/if}
