<script lang='ts'>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  // ref: https://github.com/sveltejs/svelte.dev/blob/main/apps/svelte.dev/src/routes/%2Berror.svelte
  // we don't want to use <svelte:window bind:online> here,
  // because we only care about the online state when the page first loads
  const online = browser ? navigator.onLine : true;
</script>

<svelte:head>
  <title>{$page.status}</title>
</svelte:head>

<div class='text-center'>
  {#if online}
    <h1>{$page.status}</h1>
    <!-- NOTE: $page.error must be present because this is an error page -->
    <p>{$page.error?.message ?? 'Something went wrong!!!'}</p>
  {:else}
    <h1>It looks like you're offline</h1>
    <p>Reload the page once you've found the internet.</p>
  {/if}
</div>
