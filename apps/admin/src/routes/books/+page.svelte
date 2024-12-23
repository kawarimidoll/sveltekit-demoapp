<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Table } from '$lib/components';
  import { Input } from '@shared/components';
  import { format } from '@std/datetime';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
  const bookAttrs: {
    id?: string;
    title: string;
    email: string;
    level?: string;
    status?: string;
  } = $state({
    id: undefined,
    title: '',
    email: '',
    level: undefined,
    status: undefined,
  });
  let isUpdate = $state(false);
  let checked = $state(false);
  function drawerOpen(book: Partial<typeof data.books[number]>) {
    checked = true;
    isUpdate = !!book.id;
    bookAttrs.id = book.id;
    bookAttrs.title = book.title ?? '';
  }
</script>

<div class='drawer drawer-end'>
  <input id='drawer' type='checkbox' class='drawer-toggle' bind:checked={checked} />
  <div class='drawer-content'>

    <section class='m-auto w-full'>
      <div class='mb-4 mt-8 flex'>
        <h2 class='my-0 mr-8 block'>Books</h2>
        {#if data.isSuper}
          <button class='block btn btn-primary drawer-button' onclick={() => {
            drawerOpen({});
          }}>Create book</button>
        {/if}
      </div>

      <div class='flex space-x-2'>
        <div class='text-sm'>Total: {data.count}</div>
        <label for='modal' class='btn btn-sm'>
          <span class='i-octicon-filter-16'></span>
          Filter
        </label>
      </div>

      <Table headers={[
        { display: 'Title', sort: 'title' },
        { display: 'Publisher' },
        { display: 'Author' },
        { display: 'Published at' },
        { display: 'Created at' },
        { display: 'Updated at' },
        { display: data.isSuper ? 'Action' : '' },
      ]} pagination={data.pagination}>
        {#snippet tbody()}
          {#each data.books as book}
            <tr class='hover:bg-gray-100 dark:hover:bg-neutral-700'>
              <td>{book.title}</td>
              <td>{book.publisher?.name || 'no publisher'}</td>
              {#each book.authors as author}
                <td>{author.name}</td>
              {/each}
              <td>{format(book.publishDate, 'yyyy-MM-dd')}</td>
              <td>
                {format(book.createdAt, 'yyyy-MM-dd')}<br>
                {format(book.createdAt, 'HH:mm:ss')}
              </td>
              <td>
                {format(book.updatedAt, 'yyyy-MM-dd')}<br>
                {format(book.updatedAt, 'HH:mm:ss')}
              </td>
              {#if data.isSuper}
                <td>
                  <button class='btn btn-circle btn-outline drawer-button'
                          aria-label='edit book'
                          onclick={() => { drawerOpen(book); }}>
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
      <div>
        <form class='space-y-2' method='post' action={isUpdate ? '?/update' : '?/create'} use:enhance>
          <div class='mb-4 text-center'>
            <h2 class='my-0'>{isUpdate ? 'Update Book' : 'Create Book'}</h2>
          </div>
          <input type='hidden' name='id' bind:value={bookAttrs.id} />
          <Input required type='text' name='title' bind:value={bookAttrs.title} placeholder='Title' icon='i-octicon-person-16' />
          <button class='w-full btn btn-primary'>{isUpdate ? 'Update Book' : 'Create Book'}</button>
          <p style='color: red'>{form?.message ?? ''}</p>
        </form>
      </div>
      {#if isUpdate}
        <div class='divider'></div>
        <div>
          <!-- TODO: implement force logout -->
          <form class='space-y-2' method='post' action='/?force_logout' use:enhance>
            <div class='mb-4 text-center'>
              <h3 class='my-0'>Force logout</h3>
            </div>
            <input type='hidden' name='id' bind:value={bookAttrs.id} />
            <div>
              Force log out this book from all devices.
            </div>
            <button class='w-full btn btn-primary'>Log out</button>
            <p style='color: red'>{form?.message ?? ''}</p>
          </form>
        </div>
      {/if}
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
               placeholder='Search by Title' />
      </div>
      <div class='modal-action'>
        <label for='modal' class='btn'>Close</label>
        <button class='btn btn-primary'>Search</button>
      </div>
    </form>
  </div>
  <label class='modal-backdrop' for='modal'>Close</label>
</div>
