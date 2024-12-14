<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Table } from '$lib/components';
  import { Input, Select } from '@shared/components';
  import * as table from '@shared/db/schema';
  import { format } from '@std/datetime';

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
</script>

<div class='drawer drawer-end'>
  <input id='drawer' type='checkbox' class='drawer-toggle' bind:checked={checked} />
  <div class='drawer-content'>

    <section class='m-auto w-full'>
      <div class='mb-4 mt-8 flex'>
        <h2 class='my-0 mr-8 block'>Admins</h2>
        {#if data.admin.level === 'super'}
          <button class='block btn btn-primary drawer-button' onclick={() => {
            drawerOpen({});
          }}>Create admin</button>
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
        { display: 'Name', sort: 'name' },
        { display: 'Email', sort: 'email' },
        { display: 'Level' },
        { display: 'Status' },
        { display: 'Created at' },
        { display: 'Updated at' },
        { display: data.admin.level === 'super' ? 'Action' : '' },
      ]} pagination={data.pagination}>
        {#snippet tbody()}
          {#each data.admins as admin}
            <tr class='hover:bg-gray-100 dark:hover:bg-neutral-700'>
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
              {#if data.admin.level === 'super'}
                <td>
                  <button class='btn btn-circle btn-outline drawer-button'
                          aria-label='edit admin'
                          onclick={() => { drawerOpen(admin); }}>
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
            <h2 class='my-0'>{isUpdate ? 'Update Admin' : 'Create Admin'}</h2>
          </div>
          <input type='hidden' name='id' bind:value={adminAttrs.id} />
          <Input required type='text' name='name' bind:value={adminAttrs.name} placeholder='Name' icon='i-octicon-person-16' />
          <Input required type='email' name='email' bind:value={adminAttrs.email} placeholder='Email' icon='i-octicon-mail-16' />
          <Select required name='level' bind:value={adminAttrs.level} options={table.admin.level.enumValues} label='Level' />
          <Select required name='status' bind:value={adminAttrs.status} options={table.admin.status.enumValues} label='Status' />
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
      {#if isUpdate}
        <div class='divider'></div>
        <div>
          <!-- TODO: implement force logout -->
          <form class='space-y-2' method='post' action='/?force_logout' use:enhance>
            <div class='mb-4 text-center'>
              <h3 class='my-0'>Force logout</h3>
            </div>
            <input type='hidden' name='id' bind:value={adminAttrs.id} />
            <div>
              Force log out this admin from all devices.
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
               placeholder='Search by Name or Email' />
      </div>
      <div class='flex space-x-2'>
        <h5>Level</h5>
        {#each table.admin.level.enumValues as value}
          <label>
            <input type='checkbox' name='levels' {value} checked={data.levels.includes(value)} />
            {value}
          </label>
        {/each}
      </div>
      <div class='flex space-x-2'>
        <h5>Status</h5>
        {#each table.admin.status.enumValues as value}
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
