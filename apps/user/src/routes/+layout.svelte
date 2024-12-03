<script lang='ts'>
  import { Nav } from '$lib/components';
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';

  const { children } = $props();
</script>

<ParaglideJS {i18n}>
  <Nav />
  {@render children()}
</ParaglideJS>
