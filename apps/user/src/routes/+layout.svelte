<script lang='ts'>
  import { page } from '$app/state';
  import { Hero, Nav } from '$lib/components';
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import { ModeWatcher } from 'mode-watcher';

  import 'uno.css';
  import '@unocss/reset/tailwind-compat.css';

  const { data, children } = $props();
</script>

<ModeWatcher />

<ParaglideJS {i18n}>
  <Nav {data} />
  {#if data.user == null && i18n.route(page.url.pathname) === '/'}
    <!-- show hero only on the top page -->
    <Hero />
  {:else}
    <div class='mx-auto prose container'>
      {@render children()}
    </div>
  {/if}
</ParaglideJS>

<style>
/* NOTE: some styles don't work as expected, */
/* so I have to define them in global scope */
:global {
  .bg-base-100 {
    background-color: oklch(var(--b1));
  }
}
</style>
