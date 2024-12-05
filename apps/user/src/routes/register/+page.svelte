<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
</script>

<h1>Register</h1>
<form method='post' action='?/register' use:enhance>
  <label>
    Email
    <input type='hidden' name='email' value={data.email} />
    {data.email}
  </label>
  <label>
    Verification code
    <input type='text' name='code' required />
  </label>
  <label>
    Password
    <input type='password' name='password' required />
  </label>
  <button>Register</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>

<div>
  <a href='/verify-email'>Change email?</a>
</div>
<form method='post' action='/verify-email?/request_verify' use:enhance>
  <input type='hidden' name='email' value={data.email} />
  Code expired? <button>Resend code</button>
</form>
<div>
  Already have an account? <a href='/login'>Sign in</a>
</div>

<div>
  <p>What's 'Weak password'?</p>
  <p>We validate your password strength in an anonymized form.</p>
  <p><a href='https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange'>The validation API</a>  is run by <a href='https://haveibeenpwned.com/'>Have I been Pwned</a>.</p>
</div>
