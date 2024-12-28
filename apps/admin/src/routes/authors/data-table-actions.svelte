<script lang='ts'>
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { toast } from 'svelte-sonner';

  const { id }: { id: string } = $props();
  function copyId() {
    navigator.clipboard.writeText(id);
    toast.success('ID copied to clipboard');
  }
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
      <DropdownMenu.Item onclick={copyId}>
        Copy ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Edit author</DropdownMenu.Item>
    <DropdownMenu.Item>View books</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
