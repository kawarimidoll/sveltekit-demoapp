<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';
  import * as m from '$lib/paraglide/messages.js';

  const { form }: { form: ActionData } = $props();

</script>

<section class='m-auto w-full sm:max-w-md'>
  <form class='space-y-2' method='post' action='?/login' use:enhance>
    <div class='mb-4 text-center'>
      <h3 class='text-lg font-bold'>{m.login()}</h3>
    </div>
    <Input type='text' name='username' placeholder='username' icon='i-octicon-person-fill-16' />
    <Input type='password' name='password' placeholder='password' icon='i-octicon-key' />
    <button class='w-full btn btn-primary'>{m.login()}</button>
    <p style='color: red'>{form?.message ?? ''}</p>
  </form>
</section>
