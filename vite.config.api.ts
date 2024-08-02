import { defineConfig } from 'vite';
import devServer from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/cloudflare';

export default defineConfig({
  plugins: [
    devServer({
      adapter,
      entry: 'api/server.ts',
    }),
  ],
  build: {
    outDir: 'build/server',
    target: 'esnext',
    rollupOptions: {
      input: 'api/server.ts',
      output: {
        entryFileNames: '_workers.js',
        footer: 'export default app'
      },
    },
  }
});
