import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sharedSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  subtitle: z.string().optional(),
  number: z.union([z.string(), z.number()]).optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
  /** Growth stage of the thinking — rendered as a badge on the post page. */
  status: z.enum(['seedling', 'growing', 'evergreen']).optional(),
  /** Explicit related pieces as "collection/slug" refs, e.g. "notes/we-swapped-the-motor". */
  related: z.array(z.string()).optional(),
  /** Provenance — what prompted this piece. Rendered as a quiet line in the header. */
  via: z.string().optional(),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: sharedSchema,
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: sharedSchema,
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiments' }),
  schema: sharedSchema,
});

export const collections = { notes, guides, experiments };
