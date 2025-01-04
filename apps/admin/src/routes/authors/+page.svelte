<script lang='ts'>
  import type { PageServerData } from './$types';
  import { genColumns } from './columns.js';
  import DataTable from './data-table.svelte';

  const { data }: { data: PageServerData } = $props();
  const columns = genColumns(data.updateForm);
</script>

<div>
  <h2 class='text-2xl font-bold tracking-tight'>Authors</h2>
  <p class='text-muted-foreground'>You can manage authors in this page.</p>
</div>
<div class='not-prose'>
  <DataTable data={data.authors} {columns} form={data.insertForm} />
</div>
