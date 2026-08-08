// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Site URL — utilisé pour le sitemap, les balises canoniques et Open Graph.
// Domaine final du projet (à connecter sur Netlify quand prêt).
export default defineConfig({
  site: 'https://alassanecoaching.com',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
