<script lang='ts'>
  import type { PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data }: { data: PageServerData } = $props();

  import * as m from '$lib/paraglide/messages.js';
</script>

{#if data?.user == null}
  <h1>{m.helloWorld()}</h1>
  <p><a href='/login'>{m.login()}</a></p>
{:else}
  <h1>{m.welcome({ name: data.user.username })}</h1>
  <p>{m.yourId({ id: data.user.id })}</p>
  <form method='post' action='?/logout' use:enhance>
    <button>{m.logout()}</button>
  </form>
{/if}
