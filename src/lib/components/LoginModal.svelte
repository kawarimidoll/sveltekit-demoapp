<script lang='ts'>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { i18n } from '$lib/i18n';
  import * as m from '$lib/paraglide/messages.js';
  import { languageTag } from '$lib/paraglide/runtime';
  import Input from './Input.svelte';

  let { isOpen = $bindable(false), form } = $props();

  function hideModal(forward?: string) {
    isOpen = false;

    if (forward) {
      const canonicalPath = i18n.route(forward);
      const localisedPath = i18n.resolveRoute(canonicalPath, languageTag());
      goto(localisedPath);
    }
  }
</script>

<div class='modal' class:modal-open={isOpen} role='dialog'>
  <div class='modal-box'>
    <div class='mb-4 text-center'>
      <h3 class='text-lg font-bold'>{m.login()}</h3>
    </div>
    <form class='space-y-2' method='post' action='?/login' use:enhance>
      <Input type='text' name='username' placeholder='username' icon='i-octicon-person-fill-16' />
      <Input type='password' name='password' placeholder='password' icon='i-octicon-key' />
      <button class='w-full btn btn-primary'>{m.login()}</button>
      <p style='color: red'>{form?.message ?? ''}</p>
    </form>
    <div class='divider'>OR</div>
    <div class='flex justify-evenly text-right text-sm'>
      <button class='btn btn-link' onclick={() => hideModal('/forgot-password')}>Forgot your password?</button>
      <button class='btn btn-link' onclick={() => hideModal('/register')}>Don't have an account?</button>
    </div>
  </div>
  <label class='modal-backdrop'>
    <input type='checkbox' bind:checked={isOpen} class='modal-toggle' />
  </label>
</div>
