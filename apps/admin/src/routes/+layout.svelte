<script lang='ts'>
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';

  import 'uno.css';
  import '@unocss/reset/tailwind-compat.css';

  const { children } = $props();
</script>

<ParaglideJS {i18n}>
  <div class='mx-auto prose container'>
    {@render children()}
  </div>
</ParaglideJS>
