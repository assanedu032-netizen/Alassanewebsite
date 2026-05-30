# Alassane Coaching

Site vitrine + blog (français) pour vendre le livre **« Les Secrets de la Détente
Verticale »** et convertir vers **Athletik Hub**. Construit en **Astro + Tailwind**,
déployable sur **Netlify**.

> La source de vérité du projet est [`CLAUDE.md`](./CLAUDE.md) (stack, identité,
> prix, programmes, règles de contenu). En cas de doute, il prime.

## Stack

- **Astro 5** (SSG) — pages `.astro`, blog en content collections Markdown
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — couleurs/polices en variables (`src/styles/global.css`)
- **React** (îlots Astro) — uniquement le popup quiz Athletik Hub
- **Netlify** — hébergement + Netlify Forms (contact + newsletter)

## Démarrage

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:4321
npm run build    # build de production dans /dist
npm run preview  # prévisualise le build
```

## Structure

```
src/
├── assets/            # photos réelles d'Alassane (optimisées en WebP au build)
├── components/        # Navbar, Footer, Newsletter, VideoEmbed, quiz/QuizPopup.tsx
├── config/site.ts     # liens, réseaux, prix, 6 programmes (source unique)
├── content/blog/      # articles Markdown (vide = blog « en construction »)
├── content.config.ts  # schéma de la collection blog
├── layouts/           # BaseLayout (SEO/OG/JSON-LD réutilisable)
├── pages/             # /, /livre, /a-propos, /contact, /blog, /blog/[slug], /mentions-legales
└── styles/global.css  # @theme : navy #1B2A4A, or #C5A44E, crème #F5F3EE
```

## Pages

| URL | Rôle |
| --- | --- |
| `/` | Accueil — hook, valeur, système, histoire, newsletter |
| `/livre` | Page de vente principale (BEFORE/AFTER/BRIDGE) |
| `/a-propos` | Storytelling & crédibilité |
| `/contact` | Formulaire Netlify + FAQ + réseaux |
| `/blog` | **En construction** (structure technique prête) |
| `/blog/[slug]` | Template d'article (généré quand un `.md` non-draft existe) |

## À compléter (TODO)

- Liens **Amazon KDP** (Kindle / Papier) → `src/config/site.ts` (boutons en « Bientôt disponible »)
- Liens **YouTube** / **TikTok** et **email pro** → `src/config/site.ts`
- Intégration **Brevo/Mailchimp** pour la newsletter (capture Netlify Forms en attendant)
- **Liens YouTube** des vidéos → composant `VideoEmbed` (placeholder propre en attendant)
- Domaine final → `site` dans `astro.config.mjs`, `robots.txt`, mentions légales

## Déploiement Netlify

Le fichier [`netlify.toml`](./netlify.toml) configure le build (`npm run build` → `dist`).
Netlify détecte automatiquement les formulaires (`data-netlify="true"` + honeypot anti-spam).
