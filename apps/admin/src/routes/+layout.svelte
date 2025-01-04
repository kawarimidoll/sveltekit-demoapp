<script lang='ts'>
  import SiteHeader from '$lib/components/site-header.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import { ModeWatcher } from 'mode-watcher';

  import 'uno.css';
  // Tailwind reset minus the background color override for buttons
  // add background-color: transparent; when needed
  import '@unocss/reset/tailwind-compat.css';

  const { children } = $props();
</script>

<ModeWatcher />
<ParaglideJS {i18n}>
  <Toaster closeButton />
  <SiteHeader />
  <div class='mx-auto prose container'>
    {@render children()}
  </div>
</ParaglideJS>
