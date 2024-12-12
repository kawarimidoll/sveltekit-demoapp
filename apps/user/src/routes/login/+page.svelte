<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { Input } from '$lib/components';

  const { form }: { form: ActionData } = $props();
</script>

<section class='m-auto w-full sm:max-w-md'>
  <form class='space-y-2' method='post' action='?/login' use:enhance>
    <div class='mb-4 text-center'>
      <h2>Login</h2>
    </div>
    <Input required type='email' name='email' placeholder='email' icon='i-octicon-mail-16' />
    <Input required type='password' name='password' placeholder='password' icon='i-octicon-key' />
    <button class='w-full btn btn-primary'>Login</button>
    <p style='color: red'>{form?.message ?? ''}</p>
  </form>
  <div class='mt-4'>
    Don't have an account? <a href='/register'>Create account</a>
  </div>
</section>
