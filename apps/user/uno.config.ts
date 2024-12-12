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
    presetDaisy({ logs: false }),
  ],

  // https://github.com/unocss/unocss/blob/8aa8d3c90aeca7ccb1b33134d3aab001d7b15db3/examples/sveltekit-scoped/src/routes/Prose.svelte
  safelist: ['prose'],
});
