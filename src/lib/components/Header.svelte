<script lang='ts'>
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import LangSelect from './LangSelect.svelte';

  const isAdmin = i18n.route($page.url.pathname).startsWith('/admin');

  import { enhance } from '$app/forms';
  import * as m from '$lib/paraglide/messages.js';

  const { form } = $props();

  let isOpen = $state(true);
</script>

<header class='bg-background/75 border-border sticky top-0 z-50 border-b backdrop-blur -mb-px'>
  <div class='max-w-8xl mx-auto h-16 flex items-center justify-between container'>
    {#if isAdmin}
      <a href='/admin'>Admin Top</a>
    {:else}
      <a href='/'>Top</a>
    {/if}

    <LangSelect />

    <div class='grid size-10 place-items-center border rounded-full'>
      <button aria-label='user-login' class='bg-transparent' onclick={() => (isOpen = true)}>
        <div class='i-octicon-person-fill-16 size-6'></div>
      </button>
    </div>
  </div>
</header>

<dialog class:modal-open={isOpen} class='modal' aria-modal='true'>
  <div class='modal-box'>
    <div class='mb-4 text-center'>
      <h3 class='text-lg font-bold'>{m.login()}</h3>
    </div>
    <form class='space-y-2' method='post' action='?/login' use:enhance>
      <label class='flex items-center gap-2 input input-bordered'>
        <div class='i-octicon-person-fill-16'></div>
        <input type='text' name='username' placeholder='username' class='grow' />
      </label>
      <label class='flex items-center gap-2 input input-bordered'>
        <div class='i-octicon-key'></div>
        <input type='password' name='password' placeholder='password' class='grow' />
      </label>
      <button class='w-full btn btn-primary'>{m.login()}</button>
      <p style='color: red'>{form?.message ?? ''}</p>
      <!-- <button class='btn w-full' formaction='?/register'>{m.register()}</button> -->
    </form>
    <div class='divider'>OR</div>
    <div class='flex justify-evenly text-right text-sm'>
      <p><a class='link-primary link' href='/forget_password'>Forget your password?</a></p>
      <p><a class='link-primary link' href='/register'>Don't have an account?</a></p>
    </div>
  </div>
  <form method='dialog' class='modal-backdrop'>
    <button class='cursor-default opacity-50' onclick={() => (isOpen = false)}>close</button>
  </form>
</dialog>
