<script lang='ts'>
  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';

  function isAdmin() {
    const canonicalPath = i18n.route($page.url.pathname);
    return canonicalPath.startsWith('/admin');
  }
  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route($page.url.pathname);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }
</script>

<div class='bg-base-100 navbar'>
  <div class='flex-1'>
    <a class='text-xl btn btn-ghost' href={isAdmin() ? '/admin' : '/'}>
      {isAdmin() ? 'Admin' : 'Top'}
    </a>
  </div>
  <div class='flex-none'>
    <ul class='px-1 menu menu-horizontal'>
      <li>
        <details>
          <summary><span class='i-fluent-translate-16-regular size-6'></span></summary>
          <ul class='rounded-t-none bg-base-100 p-2'>
            {#each availableLanguageTags as item}
              <li>
                <button
                  class={item === languageTag() ? 'btn btn-neutral' : 'btn btn-ghost'}
                  onclick={() => switchToLanguage(item)}
                >
                  {item}
                </button>
              </li>
            {/each}
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary><span class='i-octicon-person-fill-16 size-6'></span></summary>
          <ul class='rounded-t-none bg-base-100 p-2'>
            <li>User menu 1</li>
            <li>User menu 2</li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>
