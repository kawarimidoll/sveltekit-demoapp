<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { Input, Select } from '@shared/components';
  import * as table from '@shared/db/schema';
  import { format } from '@std/datetime';
  import Table from './Table.svelte';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
  const adminAttrs: {
    id?: string;
    name: string;
    email: string;
    level?: string;
    status?: string;
  } = $state({
    id: undefined,
    name: '',
    email: '',
    level: undefined,
    status: undefined,
  });
  let isUpdate = $state(false);
  let checked = $state(false);
  function drawerOpen(admin: Partial<typeof data.admins[number]>) {
    checked = true;
    isUpdate = !!admin.id;
    adminAttrs.id = admin.id;
    adminAttrs.name = admin.name ?? '';
    adminAttrs.email = admin.email ?? '';
    adminAttrs.level = admin.level ?? 'limited';
    adminAttrs.status = admin.status ?? 'active';
  }
  function sort(name: string) {
    const url = new URL($page.url);
    // none -> asc -> desc
    if (url.searchParams.has('sort', name)) {
      if (!url.searchParams.has('order')) {
        url.searchParams.set('order', 'asc');
      }
      else if (url.searchParams.get('order') === 'asc') {
        url.searchParams.set('order', 'desc');
      }
      else {
        url.searchParams.delete('sort');
        url.searchParams.delete('order');
      }
    }
    else {
      url.searchParams.set('sort', name);
      url.searchParams.set('order', 'asc');
    }
    return url.toString();
  }
  function orderIcon(name: string) {
    if ($page.url.searchParams.has('sort', name)) {
      if ($page.url.searchParams.get('order') === 'desc') {
        return 'desc';
      }
      else {
        return 'asc';
      }
    }
    return 'none';
  }
</script>

<div class='drawer drawer-end'>
  <input id='drawer' type='checkbox' class='drawer-toggle' bind:checked={checked} />
  <div class='drawer-content'>

    <section class='m-auto w-full'>
      <div class='mb-4 mt-8 flex'>
        <h2 class='my-0 mr-8 block'>Admins</h2>
        <button class='block btn btn-primary drawer-button' onclick={() => {
          drawerOpen({});
        }}>Create admin</button>
      </div>

      <div>
        <p class='text-sm'>Total: {data.count}</p>
      </div>

      <label for='modal' class='btn'>
        <span class='i-octicon-filter-16'></span>
        Filter
      </label>

      <Table>
        {#snippet thead()}
          <tr>
            <!-- <th>ID</th> -->
            <th>
              <a href={sort('name')} class='not-prose block h-full w-full' data-sveltekit-preload-data='tap'>
                Name
                {#if orderIcon('name') === 'asc'}
                  <div class='i-octicon-arrow-up-16 inline-block'></div>
                {:else if orderIcon('name') === 'desc'}
                  <div class='i-octicon-arrow-down-16 inline-block'></div>
                {:else}
                  <div class='i-octicon-arrow-both-16 inline-block rotate-90'></div>
                {/if}
              </a>
            </th>
            <th>
              <a href={sort('email')} class='not-prose block h-full w-full'>
                Email <div class='i-octicon-arrow-both-16 inline-block rotate-90'></div>
                {#if orderIcon('email') === 'asc'}
                  <div class='i-octicon-arrow-up-16 inline-block'></div>
                {:else if orderIcon('email') === 'desc'}
                  <div class='i-octicon-arrow-down-16 inline-block'></div>
                {:else}
                  <div class='i-octicon-arrow-both-16 inline-block rotate-90'></div>
                {/if}
              </a>
            </th>
            <th>Level</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Action</th>
          </tr>
        {/snippet}
        {#snippet tbody()}
          {#each data.admins as admin}
            <tr class='hover:bg-gray-100 dark:hover:bg-neutral-700'>
              <!-- <td>{admin.id}</td> -->
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.level}</td>
              <td>{admin.status}</td>
              <td>
                {format(admin.createdAt, 'yyyy-MM-dd')}<br>
                {format(admin.createdAt, 'HH:mm:ss')}
              </td>
              <td>
                {format(admin.updatedAt, 'yyyy-MM-dd')}<br>
                {format(admin.updatedAt, 'HH:mm:ss')}
              </td>
              <td>
                <button class='btn btn-primary drawer-button' onclick={() => {
                  drawerOpen(admin);
                }}>Edit</button>
              </td>
            </tr>
          {/each}
        {/snippet}
      </Table>
      <div class='join'>
        {#if data.prevUrl}
          <a href={data.firstUrl} title='first page' class='btn join-item'>«</a>
          <a href={data.prevUrl} title='previous page' class='btn join-item'>«</a>
        {:else}
          <button class='btn join-item' disabled>«</button>
          <button class='btn join-item' disabled>«</button>
        {/if}
        <button class='btn join-item'>Page {data.page}</button>
        {#if data.nextUrl}
          <a href={data.nextUrl} title='next page' class='btn join-item'>»</a>
          <a href={data.lastUrl} title='last page' class='btn join-item'>»</a>
        {:else}
          <button class='btn join-item' disabled>»</button>
          <button class='btn join-item' disabled>»</button>
        {/if}
      </div>
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
            <h2>{isUpdate ? 'Update Admin' : 'Create Admin'}</h2>
          </div>
          <input type='hidden' name='id' bind:value={adminAttrs.id} />
          <Input required type='text' name='name' bind:value={adminAttrs.name} placeholder='Name' icon='i-octicon-person-16' />
          <Input required type='email' name='email' bind:value={adminAttrs.email} placeholder='Email' icon='i-octicon-mail-16' />
          <Select required name='level' bind:value={adminAttrs.level} options={table.adminLevel.enumValues} label='Level' />
          <Select required name='status' bind:value={adminAttrs.status} options={table.adminStatus.enumValues} label='Status' />
          <div>
            {#if isUpdate}
              Notification email will be sent to the email address if the email address is changed.
            {:else}
              Initial password will be generated and sent to the email address.
            {/if}
            Please double check the email address.
          </div>
          <button class='w-full btn btn-primary'>{isUpdate ? 'Update Admin' : 'Create Admin'}</button>
          <p style='color: red'>{form?.message ?? ''}</p>
        </form>
      </div>
    </div>
  </div>
</div>

<input type='checkbox' id='modal' class='modal-toggle' />
<div class='modal' role='dialog'>
  <div class='modal-box'>
    <h3 class='text-lg font-bold'>Filter</h3>
    <!-- filters -->
    <form class='space-y-2' method='get' action='?'>
      <div class='space x-2 flex'>
        <Input type='search' name='search' placeholder='Search by Name or Email' />
      </div>
      <div class='space x-2 flex'>
        <h5>Level</h5>
        {#each table.adminLevel.enumValues as value}
          <label>
            <input type='checkbox' name='levels' {value} checked={data.levels.includes(value)} />
            {value}
          </label>
        {/each}
      </div>
      <div class='space x-2 flex'>
        <h5>Status</h5>
        {#each table.adminStatus.enumValues as value}
          <label>
            <input type='checkbox' name='statuses' {value} checked={data.statuses.includes(value)} />
            {value}
          </label>
        {/each}
      </div>
      <div class='modal-action'>
        <label for='modal' class='btn'>Close</label>
        <button class='btn btn-primary'>Search</button>
      </div>
    </form>
  </div>
  <label class='modal-backdrop' for='modal'>Close</label>
</div>
