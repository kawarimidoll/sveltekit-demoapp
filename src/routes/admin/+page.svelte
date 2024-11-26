<script lang='ts'>
  import type { PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data }: { data: PageServerData } = $props();
  const admin = data!.admin;

  import * as m from '$lib/paraglide/messages.js';
</script>

<h1>this is admin page.</h1>

<p>{m.welcome({ name: admin.name })}</p>
<p>{m.yourId({ id: admin.id })}</p>
<form method='post' action='?/logout' use:enhance>
  <button>{m.logout()}</button>
</form>
