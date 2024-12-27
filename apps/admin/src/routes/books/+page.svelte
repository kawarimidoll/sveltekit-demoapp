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
    publisherId: string;
    authorIds: string[];
    publishDate: Date;
  } = $state({
    id: undefined,
    title: '',
    publisherId: '',
    authorIds: [''],
    publishDate: new Date(),
  });
  let isUpdate = $state(false);
  let checked = $state(false);
  function drawerOpen(book: Partial<typeof data.books[number]>) {
    checked = true;
    isUpdate = !!book.id;
    bookAttrs.id = book.id;
    bookAttrs.title = book.title ?? '';
    bookAttrs.publisherId = book.publisherId ?? 'zqd57ak80av0ndp8ugkhmi4n';
    bookAttrs.authorIds = book.authors?.map(a => a.id) ?? [''];
    bookAttrs.publishDate = book.publishDate ?? new Date();
  }

  function addAuthor() {
    bookAttrs.authorIds.push('');
  }
  function removeAuthor(i: number) {
    bookAttrs.authorIds.splice(i, 1);
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
              <td>
                {#if book.publisher?.name || 'no publisher'}
                  {book.publisher.name}
                  <a href='?search={book.publisher.name}'>Search</a>
                  <a href='/publishers?search={book.publisher.name}'>Edit</a>
                {:else}
                  no publisher
                {/if}
              </td>
              <td>
                {#each book.authors as author}
                  <div>
                    {author.name}
                    <a href='?search={author.name}'>Search</a>
                    <a href='/authors?search={author.name}'>Edit</a>
                  </div>
                {/each}
              </td>
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
          <Input required type='text' name='publisherId' bind:value={bookAttrs.publisherId} placeholder='Publisher ID' icon='i-fluent-building-16-regular' />
          {#each bookAttrs.authorIds as _, i}
            <div class='flex'>
              <Input required type='text' name='authorIds' bind:value={bookAttrs.authorIds[i]} placeholder='Author ID' icon='i-octicon-person-16' />
              {#if bookAttrs.authorIds.length > 1}
                <button type='button'
                        class='btn btn-sm'
                        aria-label='remove author'
                        disabled={bookAttrs.authorIds.length === 0}
                        onclick={() => removeAuthor(i)}>
                  <span class='i-octicon-x-16'></span>
                </button>
              {:else}
                <div class='dropdown dropdown-end dropdown-bottom dropdown-hover'>
                  <button type='button'
                          class='btn btn-sm'
                          aria-label='remove author'
                          disabled={true}>
                    <span class='i-octicon-x-16'></span>
                  </button>
                  <div class='dropdown-content'>
                    At least one author is required
                  </div>
                </div>
              {/if}
            </div>
          {/each}

          <div>
            <button type='button'
                    class='btn btn-sm'
                    aria-label='add author'
                    onclick={addAuthor}>
              <span class='i-octicon-plus-16'></span>
              Add author
            </button>
          </div>
          <input required type='date' name='publishDate' value={format(bookAttrs.publishDate, 'yyyy-MM-dd')} />
          <button class='w-full btn btn-primary'>{isUpdate ? 'Update Book' : 'Create Book'}</button>
          <p style='color: red'>{form?.message ?? ''}</p>
        </form>
      </div>
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
