<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  const { form }: { form: ActionData } = $props();
</script>

<h1>Register</h1>
<form method='post' action='?/register' use:enhance>
  <label>
    Email
    <input type='email' name='email' required />
  </label>
  <label>
    Username
    <input type='text' name='username' required />
  </label>
  <label>
    Password
    <input type='password' name='password' required />
  </label>
  <button>Register</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>

<div>
  Already have an account? <a href='/login'>Sign in</a>
</div>

<div>
  <p>What's 'Weak password'?</p>
  <p>We validate your password strength in an anonymized form.</p>
  <p><a href='https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange'>The validation API</a>  is run by <a href='https://haveibeenpwned.com/'>Have I been Pwned</a>.</p>
</div>
