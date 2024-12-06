<script lang='ts'>
  import { Nav } from '$lib/components';
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';

  import 'uno.css';
  import '@unocss/reset/tailwind-compat.css';

  const { data, children } = $props();
</script>

<ParaglideJS {i18n}>
  <Nav {data} />
  <div class='mx-auto prose container'>
    {@render children()}
  </div>
</ParaglideJS>
