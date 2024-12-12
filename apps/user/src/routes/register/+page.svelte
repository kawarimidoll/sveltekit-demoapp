<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Input } from '$lib/components';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
</script>

<section class='m-auto w-full sm:max-w-md'>
  <form class='space-y-2' method='post' action='?/register' use:enhance>
    <div class='mb-4 text-center'>
      <h2>Register</h2>
    </div>
    <input type='hidden' name='email' value={data.email} />
    <Input disabled type='email' value={data.email} icon='i-octicon-mail-16' />
    <Input required type='text' name='code' placeholder='Verification code' icon='i-octicon-shield-lock-16' />
    <Input required type='password' name='password' placeholder='password' icon='i-octicon-key' />
    <button class='w-full btn btn-primary'>Register</button>
    <p style='color: red'>{form?.message ?? ''}</p>
  </form>
  <div class='mt-4'>
    Already have an account? <a href='/login'>Sign in</a>
  </div>
  <div>
    <form method='post' action='/verify-email?/request_verify' use:enhance>
      <input type='hidden' name='email' value={data.email} />
      Code expired? <button>Resend code</button>
    </form>
  </div>
  <div>
    Use different email? <a href='/verify-email'>Request code again</a>
  </div>
</section>

<div class='bg-base-200 collapse'>
  <input type='checkbox' />
  <div class='text-xl font-medium collapse-title'>What's <span class='italic'>Weak password</span> ?</div>
  <div class='collapse-content'>
    <p>We validate your password strength in an anonymized form.</p>
    <p><a href='https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange'>The validation API</a>  is run by <a href='https://haveibeenpwned.com/'>Have I been Pwned</a>.</p>
  </div>
</div>
