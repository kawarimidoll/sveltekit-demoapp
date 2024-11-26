import presetDaisy from '@vsilk/unocss-preset-daisyui';
import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import presetAnimations from 'unocss-preset-animations';

export default defineConfig({
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  presets: [
    presetUno(),
    presetAttributify({ prefix: 'uno-', prefixedOnly: true }),
    presetAnimations(),
    presetDaisy(),
  ],
});
