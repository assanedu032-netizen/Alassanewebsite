// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Site URL — utilisé pour le sitemap, les balises canoniques et Open Graph.
// TODO: remplacer par le domaine final une fois Netlify configuré.
export default defineConfig({
  site: 'https://alassane-coaching.netlify.app',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
