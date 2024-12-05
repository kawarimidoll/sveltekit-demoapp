<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  const { form }: { form: ActionData } = $props();
</script>

<h1>Login</h1>
<form method='post' action='?/login' use:enhance>
  <label>
    Email
    <input type='email' name='email' required />
  </label>
  <label>
    Password
    <input type='password' name='password' required />
  </label>
  <button>Login</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>

<div>
  Don't have an account? <a href='/register'>Create account</a>
</div>
