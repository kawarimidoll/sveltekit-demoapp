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
    presetDaisy(),
  ],

  safelist: ['prose'],
});
