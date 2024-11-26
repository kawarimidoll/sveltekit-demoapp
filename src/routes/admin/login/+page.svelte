<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import * as m from '$lib/paraglide/messages.js';

  const { form }: { form: ActionData } = $props();

</script>

<h1>{m.login()}/{m.register()}</h1>
<form method='post' action='?/login' use:enhance>
  <label>
    email
    <input type='email' name='email' />
  </label>
  <label>
    password
    <input type='password' name='password' />
  </label>
  <button>{m.login()}</button>
  <button formaction='?/register'>{m.register()}</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>
