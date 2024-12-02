<script lang='ts'>
  // This page works only when there's no admin in DB, otherwise 404

  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';
  import * as m from '$lib/paraglide/messages.js';

  const { form }: { form: ActionData } = $props();
</script>

<section class='m-auto w-full sm:max-w-md'>
  <form class='space-y-2' method='post' action='?/register' use:enhance>
    <div class='mb-4 text-center'>
      <h3 class='text-lg font-bold'>1st Admin {m.register()}</h3>
    </div>
    <Input type='email' name='email' placeholder='email' icon='i-octicon-mail-16' />
    <!-- NOTE: password should be more than 16 characters, but here we use 3 because it's a demo -->
    <Input type='password' name='password' placeholder='password' minlength='3' icon='i-octicon-key' />
    <button class='w-full btn btn-primary'>{m.register()}</button>
    <p style='color: red'>{form?.message ?? ''}</p>
  </form>
</section>
