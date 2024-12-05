<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  const { form }: { form: ActionData } = $props();
</script>

<h1>Register</h1>
<form method='post' action='?/request_verify' use:enhance>
  <label>
    Email
    <input type='email' name='email' required />
  </label>
  <button>Send verification code</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>

<div>
  Already have an account? <a href='/login'>Sign in</a>
</div>
