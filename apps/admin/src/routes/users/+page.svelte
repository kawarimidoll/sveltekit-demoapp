<script lang='ts'>
  import type { PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Table } from '$lib/components';
  import { Input } from '@shared/components';
  import { format } from '@std/datetime';

  const { data }: { data: PageServerData } = $props();
  let checked = $state(false);
  let selectedUserId = $state('');
  function drawerOpen(user: typeof data.users[number]) {
    checked = true;
    selectedUserId = user.id;
  }
</script>

<div class='drawer drawer-end'>
  <input id='drawer' type='checkbox' class='drawer-toggle' bind:checked={checked} />
  <div class='drawer-content'>

    <section class='m-auto w-full'>
      <div class='mb-4 mt-8 flex'>
        <h2 class='my-0 mr-8 block'>Users</h2>
      </div>

      <div class='flex space-x-2'>
        <div class='text-sm'>Total: {data.count}</div>
        <label for='modal' class='btn btn-sm'>
          <span class='i-octicon-filter-16'></span>
          Filter
        </label>
      </div>

      <Table headers={[
        { display: 'Userame', sort: 'username' },
        { display: 'Email', sort: 'email' },
        { display: 'Created at' },
        { display: 'Updated at' },
        { display: data.admin.level === 'super' ? 'Action' : '' },
      ]} pagination={data.pagination}>
        {#snippet tbody()}
          {#each data.users as user}
            <tr class='hover:bg-gray-100 dark:hover:bg-neutral-700'>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {format(user.createdAt, 'yyyy-MM-dd')}<br>
                {format(user.createdAt, 'HH:mm:ss')}
              </td>
              <td>
                {format(user.updatedAt, 'yyyy-MM-dd')}<br>
                {format(user.updatedAt, 'HH:mm:ss')}
              </td>
              {#if data.admin.level === 'super'}
                <td>
                  <button class='btn btn-circle btn-outline drawer-button'
                          aria-label='edit admin'
                          onclick={() => { drawerOpen(user); }}>
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
      <!-- TODO: implement force logout -->
      <form class='space-y-2' method='post' action='/?force_logout' use:enhance>
        <div class='mb-4 text-center'>
          <h3 class='my-0'>Force logout</h3>
        </div>
        <input type='hidden' name='id' bind:value={selectedUserId} />
        <div>
          Force log out this admin from all devices.
        </div>
        <button class='w-full btn btn-primary'>Log out</button>
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
               placeholder='Search by Name or Email'
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
