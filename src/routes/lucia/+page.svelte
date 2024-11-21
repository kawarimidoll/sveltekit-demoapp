<script lang='ts'>
  import type { PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data }: { data: PageServerData } = $props();

  import * as m from '$lib/paraglide/messages.js';
</script>

<h1>{m.welcome({ name: data.user.username })}</h1>
<p>Your user ID is {data.user.id}.</p>
<form method='post' action='?/logout' use:enhance>
  <button>Sign out</button>
</form>
