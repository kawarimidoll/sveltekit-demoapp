<script lang='ts'>
  import { buttonVariants } from '$lib/components/ui/button';
  import { cn } from '$lib/utils.js';
  import { Pagination as PaginationPrimitive } from 'bits-ui';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: PaginationPrimitive.NextButtonProps = $props();
</script>

{#snippet Fallback()}
  <span>Next</span>
  <span class='i-lucide-chevron-right size-4'></span>
{/snippet}

<PaginationPrimitive.NextButton
  bind:ref
  class={cn(
    buttonVariants({
      variant: 'ghost',
      class: 'gap-1 pr-2.5',
    }),
    className,
  )}
  children={children || Fallback}
  {...restProps}
/>
