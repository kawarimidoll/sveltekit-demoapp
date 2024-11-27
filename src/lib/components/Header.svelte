<script lang='ts'>
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import LangSelect from './LangSelect.svelte';
  import LoginModal from './LoginModal.svelte';

  const isAdmin = i18n.route($page.url.pathname).startsWith('/admin');

  const { form } = $props();

  let modalOpen = $state(false);
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
      <button aria-label='user-login' class='bg-transparent' onclick={() => modalOpen = true}>
        <div class='i-octicon-person-fill-16 size-6'></div>
      </button>
    </div>
  </div>
</header>

<LoginModal bind:isOpen={modalOpen} {form} />
