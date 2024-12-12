<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { Input } from '$lib/components';

  const { form }: { form: ActionData } = $props();
</script>

<section class='m-auto w-full sm:max-w-md'>
  <form class='space-y-2' method='post' action='?/request_verify' use:enhance>
    <div class='mb-4 text-center'>
      <h2>Register</h2>
    </div>
    <Input required type='email' name='email' placeholder='email' icon='i-octicon-mail-16' />
    <button class='w-full btn btn-primary'>Send verification code</button>
    <p style='color: red'>{form?.message ?? ''}</p>
  </form>
  <div class='mt-4'>
    Already have an account? <a href='/login'>Sign in</a>
  </div>
</section>
