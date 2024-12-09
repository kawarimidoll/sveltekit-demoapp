<script lang='ts'>
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';

  import 'uno.css';
  import '@unocss/reset/tailwind-compat.css';

  const { children } = $props();
</script>

<ParaglideJS {i18n}>
  <div class='h-12 w-full border-b'>
    <a class='text-xl btn btn-ghost' href='/'>Admin Top</a>
    <a class='link' href='/admins'>Admins</a>
  </div>
  <div class='mx-auto prose container'>
    {@render children()}
  </div>
</ParaglideJS>
