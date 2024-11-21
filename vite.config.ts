import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import extractorSvelte from '@unocss/extractor-svelte';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    UnoCSS({
      extractors: [extractorSvelte()],
    }),
    sveltekit(),
    paraglide({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
    }),
  ],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
