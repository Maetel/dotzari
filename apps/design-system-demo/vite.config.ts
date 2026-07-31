import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/design-system/',
  plugins: [svelte()],
  build: {
    outDir: '../../docs/design-explorations/design-system',
    emptyOutDir: true,
  },
});
