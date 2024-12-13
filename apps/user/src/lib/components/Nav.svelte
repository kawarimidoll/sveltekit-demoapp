<script lang='ts'>
  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import * as m from '$lib/paraglide/messages.js';
  import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
  import { TwIndicator } from '@shared/components';
  import { setTheme, theme } from 'mode-watcher';
  import { AvatarBeam } from 'svelte-boring-avatars';

  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route($page.url.pathname);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }

  // TODO: color is changed by changing prefer-color-scheme,
  // but not changed by changing the mode in the dropdown...
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
    <a class='text-xl btn btn-ghost' href='/'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html m.navTitle()}
    </a>
    <TwIndicator />
  </div>

  <div class='flex-none gap-2'>
    <div class='form-control'>
      <input type='text' placeholder='[WIP] Search' class='w-24 input input-bordered md:w-auto' />
    </div>

    <div class='dropdown dropdown-end'>
      <div tabindex='0' role='button' class='m-1 btn btn-circle btn-ghost'>
        <div class='grid size-6'>
          <div class='i-octicon-sun-16 col-start-1 row-start-1'></div>
          <div class='i-octicon-moon-16 col-start-2 row-start-2 -ml-1 -mt-2'></div>
        </div>
      </div>
      <div class='rounded-box bg-base-100 z-[1] w-36 p-2 shadow menu dropdown-content'>
        <ul class='gap-1 menu menu-sm'>
          {#each modes as item}
            <li>
              <button
                class='btn btn-sm hover:btn-accent'
                class:btn-neutral={item.name === $theme}
                class:btn-outline={item.name !== $theme}
                onclick={() => setTheme(item.name)}
              >
                <span class={`inline ${item.icon}`}></span>
                {item.name}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class='dropdown dropdown-end'>
      <div tabindex='0' role='button' class='m-1 btn btn-circle btn-ghost'>
        <span class='i-fluent-translate-16-regular size-6'></span>
      </div>
      <div class='rounded-box bg-base-100 z-[1] w-26 p-2 shadow menu dropdown-content'>
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
      </div>
    </div>

    <div class='dropdown dropdown-end'>
      <div tabindex='0' role='button' class='m-1 btn btn-circle btn-ghost'>
        {#if data.user != null}
          <AvatarBeam name={data.user.id} />
        {:else}
          <span class='i-octicon-person-add-16 size-6'></span>
        {/if}
      </div>
      <div class='rounded-box bg-base-100 z-[1] w-26 p-2 shadow menu dropdown-content'>
        {#if data.user != null}
          <a class='link' href='/mypage'>mypage</a>
          <a class='link' href='/settings'>settings</a>
          <form method='post' action='/logout' use:enhance>
            <button class='btn btn-link btn-sm'>Sign out</button>
          </form>
        {:else}
          <a class='link' href='/login'>login</a>
        {/if}
      </div>
    </div>

  </div>
</div>
