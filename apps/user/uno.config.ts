import presetDaisy from '@vsilk/unocss-preset-daisyui';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
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
    presetIcons(),
    presetAttributify({ prefix: 'uno-', prefixedOnly: true }),
    presetAnimations(),
    presetDaisy(),
  ],
});
