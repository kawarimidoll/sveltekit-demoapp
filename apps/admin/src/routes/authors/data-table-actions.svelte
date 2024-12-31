<script lang='ts'>
  import type { schema } from '@shared/db';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { toast } from 'svelte-sonner';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { updateSchema, type UpdateSchema } from './schema';

  type Props = {
    form: SuperValidated<Infer<UpdateSchema>>;
    data: typeof schema.author.$inferSelect;
  };
  const { form: formSrc, data }: Props = $props();

  const form = superForm(formSrc, {
    validators: zodClient(updateSchema),
  });

  const { form: formData, enhance } = form;

  function copyId() {
    navigator.clipboard.writeText(data.id);
    toast.success('ID copied to clipboard');
  }

  let dialogOpen = $state(false);

  function open() {
    formData.set(data);
    dialogOpen = true;
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
    <DropdownMenu.Item onclick={open}>
      Edit
    </DropdownMenu.Item>
    <DropdownMenu.Item>View books</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit author</Dialog.Title>
      <Dialog.Description>
        Make changes to author here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <form method='POST' action='?/update' use:enhance>
      <input type='hidden' name='id' bind:value={$formData.id} />
      <Form.Field {form} name='name'>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.Description>This is author's display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name='description'>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Input {...props} bind:value={$formData.description} />
          {/snippet}
        </Form.Control>
        <Form.Description>This is author's description.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Dialog.Footer>
        <Form.Button>Save changes</Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
