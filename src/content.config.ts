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
});

const logs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/logs' }),
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

export const collections = { logs, guides, experiments };
