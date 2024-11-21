<script lang='ts'>
  import TwIndicator from '$lib/components/dev/tw-indicator.svelte';
  import Header from '$lib/components/Header.svelte';
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';

  import 'uno.css';
  import '@unocss/reset/tailwind-compat.css';

  const { children } = $props();
</script>

<TwIndicator />

<ParaglideJS {i18n}>
  <Header />
  {@render children()}
</ParaglideJS>
