<script lang='ts'>
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils.js';
  import { DropdownMenu as DropdownMenuPrimitive, type WithoutChildrenOrChild } from 'bits-ui';

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    children: childrenProp,
    ...restProps
  }: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
    children?: Snippet;
  } = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
  bind:ref
  bind:checked
  bind:indeterminate
  class={cn(
    'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    className,
  )}
  {...restProps}
>
  {#snippet children({ checked, indeterminate })}
    <span class='absolute left-2 size-3.5 flex items-center justify-center'>
      {#if indeterminate}
        <div class='i-lucide-minus size-4'></div>
      {:else}
        <div class={cn('i-lucide-check size-4', !checked && 'text-transparent')}></div>
      {/if}
    </span>
    {@render childrenProp?.()}
  {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
