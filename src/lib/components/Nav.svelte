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
    <div class='dropdown dropdown-end'>
      <div tabindex='0' role='button' class='m-1 btn btn-ghost'>
        <span class='i-fluent-translate-16-regular size-6'></span>
        <span class='i-fluent-chevron-down-12-regular'></span>
      </div>
      <ul class='z-[1] w-26 gap-2 rounded-box bg-base-100 p-2 shadow menu dropdown-content'>
        {#each availableLanguageTags as item}
          <li>
            <button
              class='btn btn-sm'
              class:btn-neutral={item === languageTag()}
              class:btn-outline={item !== languageTag()}
              onclick={() => switchToLanguage(item)}
            >
              {item}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <div class='dropdown dropdown-end'>
      <div tabindex='0' role='button' class='m-1 btn btn-ghost'>
        <span class='i-octicon-person-fill-16 size-6'></span>
        <span class='i-fluent-chevron-down-12-regular'></span>
      </div>
      <ul class='z-[1] w-26 gap-2 rounded-box bg-base-100 p-2 shadow menu dropdown-content'>
        <li>
          <a class='link' href='/'>Top</a>
          <a class='link' href='/admin'>Admin</a>
        </li>
      </ul>
    </div>
  </div>
</div>
