<script lang='ts'>
  import type { PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.admin.name}!</h1>
<p>Your admin ID is {data.admin.id}.</p>
<form method='post' action='/logout' use:enhance>
  <button>Sign out</button>
</form>
