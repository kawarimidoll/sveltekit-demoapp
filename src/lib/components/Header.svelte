<script lang='ts'>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import { languageTag } from '$lib/paraglide/runtime';
  import LangSelect from './LangSelect.svelte';

  const isAdmin = i18n.route($page.url.pathname).startsWith('/admin');

  import { enhance } from '$app/forms';
  import * as m from '$lib/paraglide/messages.js';

  const { form } = $props();

  let isOpen = $state(false);
  function showModal() {
    isOpen = true;
  }
  function hideModal(forward?: string) {
    isOpen = false;

    if (forward) {
      const canonicalPath = i18n.route(forward);
      const localisedPath = i18n.resolveRoute(canonicalPath, languageTag());
      goto(localisedPath);
    }
  }
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
      <button aria-label='user-login' class='bg-transparent' onclick={showModal}>
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
    </form>
    <div class='divider'>OR</div>
    <div class='flex justify-evenly text-right text-sm'>
      <button class='btn btn-link' onclick={() => hideModal('/forgot-password')}>Forgot your password?</button>
      <button class='btn btn-link' onclick={() => hideModal('/register')}>Don't have an account?</button>
    </div>
  </div>
  <form method='dialog' class='modal-backdrop'>
    <button class='cursor-default opacity-50' onclick={() => hideModal()}>close</button>
  </form>
</dialog>
