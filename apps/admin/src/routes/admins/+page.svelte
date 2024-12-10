<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Input, Select } from '@shared/components';
  import * as table from '@shared/db/schema';
  import { format } from '@std/datetime';
  import Table from './Table.svelte';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
  const adminAttrs = {
    name: '',
    email: '',
    level: undefined,
    status: undefined,
  };
</script>

<div class='drawer drawer-end'>
  <input id='drawer' type='checkbox' class='drawer-toggle' />
  <div class='drawer-content'>
    <label for='drawer' class='btn btn-primary drawer-button'>Create Admin</label>
  </div>
  <div class='drawer-side'>
    <label for='drawer' aria-label='close drawer' class='drawer-overlay'></label>
    <div class='text-base-content min-h-full w-80 bg-gray-200 p-4 menu'>
      <div>
        <label for='drawer' class='btn btn-outline drawer-button'>close</label>
      </div>
      <div>
        <form class='space-y-2' method='post' action='?/create' use:enhance>
          <div class='mb-4 text-center'>
            <h2>Create Admin</h2>
          </div>
          <Input required type='text' name='name' placeholder='Name' icon='i-octicon-person-16' />
          <Input required type='email' name='email' placeholder='Email' icon='i-octicon-mail-16' />
          <Select required name='level' bind:value={adminAttrs.level} options={table.adminLevel.enumValues} label='Level' />
          <Select required name='status' bind:value={adminAttrs.status} options={table.adminStatus.enumValues} label='Status' />
          <div>
            Initial password will be generated and sent to the email address.
            Please double check the email address.
          </div>
          <button class='w-full btn btn-primary'>Create Admin</button>
          <p style='color: red'>{form?.message ?? ''}</p>
        </form>
      </div>
    </div>
  </div>
</div>

<section class='m-auto w-full'>
  <Table title='Admins'>
    {#snippet thead()}
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Level</th>
        <th>Status</th>
        <th>Created at</th>
        <th>Action</th>
      </tr>
    {/snippet}
    {#snippet tbody()}
      {#each data.admins as admin}
        <tr class='hover:bg-gray-100 dark:hover:bg-neutral-700'>
          <td>{admin.id}</td>
          <td>{admin.name}</td>
          <td>{admin.email}</td>
          <td>{admin.level}</td>
          <td>{admin.status}</td>
          <td>{format(admin.createdAt, 'yyyy-MM-dd HH:mm:ss')}</td>
          <td></td>
        </tr>
      {/each}
    {/snippet}
  </Table>
  <div>
    'Create at' is local time
  </div>
</section>
