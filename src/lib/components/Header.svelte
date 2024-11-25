<script lang='ts'>
  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import { availableLanguageTags, languageTag as currentLanguageTag } from '$lib/paraglide/runtime';

  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route($page.url.pathname);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }

  const isAdmin = i18n.route($page.url.pathname).startsWith('/admin');
</script>

<header class='bg-background/75 border-border sticky top-0 z-50 border-b backdrop-blur -mb-px'>
  <div class='max-w-8xl mx-auto h-16 flex items-center justify-between container'>
    {#if isAdmin}
      <a href='/admin'>Admin Top</a>
    {:else}
      <a href='/'>Top</a>
    {/if}

    {#each availableLanguageTags as languageTag}
      <button onclick={() => switchToLanguage(languageTag)}>
        {#if languageTag === currentLanguageTag()}
          *
        {/if}
        {languageTag}
      </button>
    {/each}
  </div>
</header>
