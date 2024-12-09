<script lang='ts'>
  import type { PageServerData } from './$types';
  import { format } from '@std/datetime';
  import Table from './Table.svelte';
  // import { enhance } from '$app/forms';
  // import { Input } from '@shared/components';

  const { data }: { data: PageServerData } = $props();
</script>

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
