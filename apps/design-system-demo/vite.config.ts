import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/design-system/',
  plugins: [svelte()],
  server: {
    allowedHosts: ['.trycloudflare.com', 'dotzari.memos.my'],
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
  build: {
    outDir: '../../docs/design-explorations/design-system',
    emptyOutDir: true,
  },
});
