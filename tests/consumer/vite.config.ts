import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const tailwind = process.env.CONSUMER_TAILWIND === '1';
export default defineConfig({
  plugins: [
    ...(tailwind ? [tailwindcss()] : []),
    {
      name: 'fixture-ssr',
      transformIndexHtml: (html) =>
        html.replace(
          '<!--ssr-->',
          readFileSync(new URL('./ssr.html', import.meta.url), 'utf8'),
        ),
    },
  ],
  resolve: {
    alias: {
      'consumer-styles': fileURLToPath(
        new URL(tailwind ? './tailwind.css' : './plain.css', import.meta.url),
      ),
    },
  },
  build: {
    outDir: 'out',
    emptyOutDir: true,
    rolldownOptions: {
      onwarn(warning, warn) {
        // This is a client-only fixture bundle. The library's emitted modules retain their directives.
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('use client')
        )
          return;
        warn(warning);
      },
    },
  },
  preview: { host: '127.0.0.1', port: 5181, strictPort: true },
});
