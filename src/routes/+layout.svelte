<script lang='ts'>
  import TwIndicator from '$lib/components/dev/tw-indicator.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import { ModeWatcher } from 'mode-watcher';

  import 'uno.css';
  import '@unocss/reset/tailwind-compat.css';

  const { children } = $props();
</script>

<ModeWatcher />
<TwIndicator />

<ParaglideJS {i18n}>
  <Nav />
  {@render children()}
</ParaglideJS>
