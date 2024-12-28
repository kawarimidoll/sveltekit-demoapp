<script lang='ts'>
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

  const { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant='ghost'
        size='icon'
        class='relative size-8 p-0'
      >
        <span class='sr-only'>Open menu</span>
        <div class='i-lucide-ellipsis size-4'></div>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
        Copy ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Edit author</DropdownMenu.Item>
    <DropdownMenu.Item>View books</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
