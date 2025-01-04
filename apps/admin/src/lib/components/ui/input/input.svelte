<script lang='ts'>
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils.js';
  import { Button } from '../button';

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    resetIf = () => false,
    ...restProps
  }: WithElementRef<HTMLInputAttributes> & { resetIf?: () => boolean } = $props();
</script>

<div class='flex flex-1 items-center'>
  <input
    bind:this={ref}
    class={cn(
      'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className,
    )}
    bind:value
    {...restProps}
  />
  {#if resetIf()}
    <Button
      variant='ghost'
      onclick={() => value = ''}
      class='h-8 px-2 -ml-8'
    >
      <span class='i-lucide-x'></span>
    </Button>
  {/if}
</div>
