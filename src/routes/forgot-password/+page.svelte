<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import * as m from '$lib/paraglide/messages.js';

  const { form }: { form: ActionData } = $props();

</script>

<h1>Reset Password</h1>
<p>Enter your email address and we'll send you a link to reset your password.</p>
<form method='post' action='?/login' use:enhance>
  <label class='flex items-center gap-2 input input-bordered'>
    <div class='i-octicon-mail-16'></div>
    <input type='text' name='username' placeholder='username' class='grow' />
  </label>
  <button formaction='?/register'>{m.register()}</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>
