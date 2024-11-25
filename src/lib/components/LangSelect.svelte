<script lang='ts'>
  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
  import { createSelect, melt } from '@melt-ui/svelte';

  import { fade } from 'svelte/transition';

  function langToOption(lang: string): SelectOption<Theme> {
    return { value: lang, label: lang };
  }

  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route($page.url.pathname);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }

  const {
    elements: { trigger, menu, option },
    states: { selectedLabel, open },
  } = createSelect<string>({
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true,
    },
    forceVisible: true,
    defaultSelected: langToOption(languageTag()),
    loop: false,
    onSelectedChange: ({ next, curr }) => {
      if (next.value === curr.value) {
        return next;
      }
      switchToLanguage(next.value);
    },
  });
</script>

<div class='w-16 flex flex-col gap-1'>
  <button use:melt={$trigger} aria-label='Open theme switcher'>
    {$selectedLabel || 'Select'}
  </button>
  {#if $open}
    <div
      class='z-50 border'
      use:melt={$menu}
      transition:fade={{ duration: 150 }}
    >
      {#each (availableLanguageTags) as item}
        <div use:melt={$option(langToOption(item))}>
          {item}
          {#if item === languageTag()}
            *
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
