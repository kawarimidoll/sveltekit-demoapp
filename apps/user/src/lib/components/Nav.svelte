<script lang='ts'>
  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import * as m from '$lib/paraglide/messages.js';
  import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';

  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route($page.url.pathname);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }

  const { data } = $props();
  const name = data.user?.username || 'SvelteKit User';
</script>

<div>
  <a href='/'>top</a>
</div>
<div>{m.hello_world({ name })}</div>
<div>
  {#each availableLanguageTags as item}
    <button onclick={() => switchToLanguage(item)}>
      {item === languageTag() ? '*' : ''}{item}
    </button>
  {/each}
</div>
{#if data.user != null}
  <form method='post' action='/logout' use:enhance>
    <button>Sign out</button>
  </form>
{/if}
