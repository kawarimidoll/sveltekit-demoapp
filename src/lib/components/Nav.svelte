<script lang='ts'>
  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import TwIndicator from '$lib/components/dev/tw-indicator.svelte';
  import { i18n } from '$lib/i18n';
  import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
  import { setMode, userPrefersMode } from 'mode-watcher';
  import Dropdown from './Dropdown.svelte';

  function isAdmin() {
    const canonicalPath = i18n.route($page.url.pathname);
    return canonicalPath.startsWith('/admin');
  }
  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route($page.url.pathname);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }

  type Mode = 'light' | 'dark' | 'system';
  const modes: { name: Mode; icon: string }[] = [
    { name: 'light', icon: 'i-octicon-sun-16' },
    { name: 'dark', icon: 'i-octicon-moon-16' },
    { name: 'system', icon: 'i-octicon-device-desktop-16' },
  ];

  const { data } = $props();
</script>

<div class='bg-base-100 navbar'>
  <div class='flex-1'>
    <a class='text-xl btn btn-ghost' href={isAdmin() ? '/admin' : '/'}>
      {isAdmin() ? 'Admin' : 'Top'}
    </a>
    <TwIndicator />
  </div>
  <div class='flex-none'>
    <Dropdown mainClass='w-36' triggerClass='btn-circle'>
      {#snippet trigger()}
        <div class='grid size-6'>
          <div class='i-octicon-sun-16 col-start-1 row-start-1'></div>
          <div class='i-octicon-moon-16 col-start-2 row-start-2 -ml-1 -mt-2'></div>
        </div>
      {/snippet}
      {#snippet main()}
        <ul class='gap-1 menu menu-sm'>
          {#each modes as item}
            <li>
              <button
                class='btn btn-sm'
                class:btn-neutral={item.name === $userPrefersMode}
                class:btn-outline={item.name !== $userPrefersMode}
                onclick={() => setMode(item.name)}
              >
                <span class={`inline ${item.icon}`}></span>
                {item.name}
              </button>
            </li>
          {/each}
        </ul>
      {/snippet}
    </Dropdown>
    <Dropdown triggerClass='btn-circle'>
      {#snippet trigger()}
        <span class='i-fluent-translate-16-regular size-6'></span>
      {/snippet}
      {#snippet main()}
        <ul class='gap-1 menu menu-sm'>
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
      {/snippet}
    </Dropdown>
    <Dropdown triggerClass='btn-circle avatar'>
      {#snippet trigger()}
        <div class='i-teenyicons-user-circle-solid size-8'></div>
      {/snippet}
      {#snippet main()}
        <ul>
          <li>
            <a class='link' href='/'>Top</a>
          </li>
          <li>
            {#if data?.user == null}
              <a class='link' href='/login'>Login</a>
            {:else}
              <form method='post' action='?/logout'>
                <button class='link'>Logout</button>
              </form>
            {/if}
          </li>
          <li>
            <a class='link' href='/admin'>Admin</a>
          </li>
        </ul>
      {/snippet}
    </Dropdown>
  </div>
</div>
