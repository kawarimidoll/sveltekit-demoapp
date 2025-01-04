import { presetDaisy } from '@ameinhardt/unocss-preset-daisy';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify({ prefix: 'uno-', prefixedOnly: true }),
    presetTypography(),
    presetDaisy({
      themes: ['emerald', 'dracula'],
      darkTheme: 'dracula',
      logs: false,
    }),
    presetAnimations(),
    presetShadcn(),
  ],

  // https://github.com/hyoban/unocss-preset-shadcn#usage
  // By default, `.ts` and `.js` files are NOT extracted.
  // It's necessary to add the following configuration to use shadcn-svelte.
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        '(components|src)/**/*.{js,ts}',
      ],
    },
  },

  // https://github.com/unocss/unocss/blob/8aa8d3c90aeca7ccb1b33134d3aab001d7b15db3/examples/sveltekit-scoped/src/routes/Prose.svelte
  safelist: ['prose'],
});
