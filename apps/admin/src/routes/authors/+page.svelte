<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Table } from '$lib/components';
  import { Input } from '@shared/components';
  import { format } from '@std/datetime';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
  const authorAttrs: {
    id?: string;
    name: string;
    description: string;
  } = $state({
    id: undefined,
    name: '',
    description: '',
  });
  let isUpdate = $state(false);
  let checked = $state(false);
  function drawerOpen(author: Partial<typeof data.authors[number]>) {
    checked = true;
    isUpdate = !!author.id;
    authorAttrs.id = author.id;
    authorAttrs.name = author.name ?? '';
    authorAttrs.description = author.description ?? '';
    if (form) {
      form.message = '';
    }
  }
</script>

<div class='drawer drawer-end'>
  <input id='drawer' type='checkbox' class='drawer-toggle' bind:checked />
  <div class='drawer-content'>

    <section class='m-auto w-full'>
      <div class='mb-4 mt-8 flex'>
        <h2 class='my-0 mr-8 block'>Authors</h2>
        {#if data.isSuper}
          <button class='block btn btn-primary drawer-button' onclick={() => {
            drawerOpen({});
          }}>Create author</button>
        {/if}
      </div>

      <div class='flex space-x-2'>
        <div class='text-sm'>Total: {data.count}</div>
        <label for='modal' class='btn btn-sm'>
          <span class='i-octicon-filter-16'></span>
          Filter
        </label>
      </div>

      {#if data.authors.length === 0}
        <div class='my-8 w-full text-center'>No authors found!</div>
      {/if}
      <Table headers={[
        { display: 'Name', sort: 'name' },
        { display: 'Description', sort: 'description' },
        { display: 'Created at' },
        { display: 'Updated at' },
        { display: data.isSuper ? 'Action' : '' },
      ]} pagination={data.pagination}>
        {#snippet tbody()}
          {#each data.authors as author}
            <tr class='hover:bg-gray-100 dark:hover:bg-neutral-700'>
              <td>{author.name}</td>
              <td>{author.description}</td>
              <td>
                {format(author.createdAt, 'yyyy-MM-dd')}<br>
                {format(author.createdAt, 'HH:mm:ss')}
              </td>
              <td>
                {format(author.updatedAt, 'yyyy-MM-dd')}<br>
                {format(author.updatedAt, 'HH:mm:ss')}
              </td>
              {#if data.isSuper}
                <td>
                  <button class='btn btn-circle btn-outline drawer-button btn-sm'
                          aria-label='edit author'
                          onclick={() => { drawerOpen(author); }}>
                    <span class='i-octicon-pencil'></span>
                  </button>
                </td>
              {/if}
            </tr>
          {/each}
        {/snippet}
      </Table>
      <div>
        'Create at' is local time
      </div>
    </section>

  </div>
  <div class='drawer-side'>
    <label for='drawer' aria-label='close drawer' class='drawer-overlay'></label>
    <div class='text-base-content min-h-full w-80 bg-gray-200 p-4 menu'>
      <div>
        <label for='drawer' class='btn btn-outline drawer-button'>close</label>
      </div>
      <form class='space-y-2' method='post' action={isUpdate ? '?/update' : '?/create'} use:enhance>
        <div class='mb-4 text-center'>
          <h2 class='my-0'>{isUpdate ? 'Update Author' : 'Create Author'}</h2>
        </div>
        <input type='hidden' name='id' bind:value={authorAttrs.id} />
        <Input required name='name' bind:value={authorAttrs.name} placeholder='Name' icon='i-fluent-people-edit-16-regular' />
        <Input name='description' bind:value={authorAttrs.description} placeholder='Description' icon='i-octicon-comment-16' />
        <button class='w-full btn btn-primary'>{isUpdate ? 'Update Author' : 'Create Author'}</button>
        <p style='color: red'>{form?.message ?? ''}</p>
      </form>
    </div>
  </div>
</div>

<input type='checkbox' id='modal' class='modal-toggle' />
<div class='modal' role='dialog'>
  <div class='modal-box'>
    <h3 class='not-prose text-lg font-bold'>Filter</h3>
    <!-- filters -->
    <form class='space-y-2' method='get' action='?'>
      <div class='flex space-x-2'>
        <Input type='search' name='search' wrapperClass='w-full'
               placeholder='Search by Name or Description'
               bind:value={data.search} />
      </div>
      <div class='modal-action'>
        <label for='modal' class='btn'>Close</label>
        <button class='btn btn-primary'>Search</button>
      </div>
    </form>
  </div>
  <label class='modal-backdrop' for='modal'>Close</label>
</div>
