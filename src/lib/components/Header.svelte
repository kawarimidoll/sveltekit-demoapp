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
</script>

<div>
  <a href='/'>TOP</a>

  {#each availableLanguageTags as languageTag}
    <button onclick={() => switchToLanguage(languageTag)}>
      {#if languageTag === currentLanguageTag()}
        *
      {/if}
      {languageTag}
    </button>
  {/each}
</div>
