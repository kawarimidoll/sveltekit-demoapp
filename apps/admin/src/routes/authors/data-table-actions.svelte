<script lang='ts'>
  import type { schema } from '@shared/db';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Drawer from '$lib/components/ui/drawer';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { toast } from 'svelte-sonner';
  import { MediaQuery } from 'svelte/reactivity';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { updateSchema, type UpdateSchema } from './schema';

  type Props = {
    form: SuperValidated<Infer<UpdateSchema>>;
    data: typeof schema.author.$inferSelect;
  };
  const { form: formSrc, data }: Props = $props();

  let open = $state(false);

  const form = superForm(formSrc, {
    validators: zodClient(updateSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`${f.data.name} is updated.`);
        // TODO this doesn't work well
        open = false;
      }
      else {
        toast.error('Please fix the errors in the form.');
      }
    },
  });

  const { form: formData, enhance } = form;

  function copyId() {
    navigator.clipboard.writeText(data.id);
    toast.success('ID copied to clipboard');
  }

  function openEditor() {
    formData.set(data);
    open = true;
  }

  const isDesktop = new MediaQuery('(min-width: 768px)');
  const Component = $derived(isDesktop.current ? Dialog : Drawer);
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
    <DropdownMenu.Item onclick={openEditor}>
      Edit
    </DropdownMenu.Item>
    <DropdownMenu.Item>View books</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Component.Root bind:open>
  <Component.Content>
    <Component.Header>
      <Component.Title>Edit author</Component.Title>
      <Component.Description>
        Make changes to author here. Click save when you're done.
      </Component.Description>
    </Component.Header>
    <form method='POST' action='?/update' use:enhance>
      <input type='hidden' name='id' bind:value={$formData.id} />
      <Form.Field {form} name='name' class={isDesktop.current ? '' : 'px-4'}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.Description>This is author's display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name='description' class={isDesktop.current ? '' : 'px-4'}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Input {...props} bind:value={$formData.description} />
          {/snippet}
        </Form.Control>
        <Form.Description>This is author's description.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Component.Footer>
        <Form.Button>Save changes</Form.Button>
        <Component.Close
          class={buttonVariants({ variant: 'outline' })}
        >Cancel</Component.Close>
      </Component.Footer>
    </form>
  </Component.Content>
</Component.Root>
