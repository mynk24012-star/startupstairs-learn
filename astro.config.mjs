// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://startupstairs.in',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  redirects: { '/': '/learn' },
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname.startsWith('/learn'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
