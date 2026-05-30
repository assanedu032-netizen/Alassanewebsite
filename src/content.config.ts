import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  Collection « blog » — structure technique PRÊTE mais NON publiée (CLAUDE.md §7).
  Le blog est « en construction » côté public. Aucun faux article n'est livré.

  Pour publier plus tard : déposer des fichiers .md dans src/content/blog/
  avec le frontmatter ci-dessous. Le template /blog/[slug] les rendra
  automatiquement, et /blog listera les articles dont draft !== true.

  Catégories prévues : Entraînement · Nutrition · Science · Mindset · Témoignages.
*/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      category: z.enum([
        'Entraînement',
        'Nutrition',
        'Science',
        'Mindset',
        'Témoignages',
      ]),
      readingTime: z.string().optional(), // ex. "6 min"
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
