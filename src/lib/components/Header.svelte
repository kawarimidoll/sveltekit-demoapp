<script lang='ts'>
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import LangSelect from './LangSelect.svelte';

  const isAdmin = i18n.route($page.url.pathname).startsWith('/admin');
</script>

<header class='bg-background/75 border-border sticky top-0 z-50 border-b backdrop-blur -mb-px'>
  <div class='max-w-8xl mx-auto h-16 flex items-center justify-between container'>
    {#if isAdmin}
      <a href='/admin'>Admin Top</a>
    {:else}
      <a href='/'>Top</a>
    {/if}

    <LangSelect />
  </div>
</header>
