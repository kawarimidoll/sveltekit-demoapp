<script lang='ts'>
  import { buttonVariants } from '$lib/components/ui/button';
  import { cn } from '$lib/utils.js';
  import { Pagination as PaginationPrimitive } from 'bits-ui';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
  <span class='i-lucide-chevron-left size-4'></span>
  <span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
  bind:ref
  class={cn(
    buttonVariants({
      variant: 'ghost',
      class: 'gap-1 pl-2.5',
    }),
    className,
  )}
  children={children || Fallback}
  {...restProps}
/>
