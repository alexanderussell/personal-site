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

const lab = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: sharedSchema,
});

/**
 * Portfolio case studies. Deliberately NOT an extension of `sharedSchema` —
 * case studies and essays share almost no fields, and merging them would put
 * optional portfolio metadata on every note.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Completion or publish date — orders case studies within a role. */
    date: z.coerce.date(),
    company: z.string(),
    role: z.string(),
    /** Human-readable duration, e.g. "~3 months". Not a date range. */
    timeline: z.string().optional(),
    tags: z.array(z.string()).optional(),
    /**
     * Measured result. Omitted entirely when NDA prevents sharing numbers —
     * the case study renders without the section rather than with an empty one.
     */
    outcome: z.string().optional(),
    /** Surfaces on the homepage Work preview. */
    featured: z.boolean().default(false),
    /** Figma Slides embed URL. Populated only if U9 ships. */
    figma: z.string().url().optional(),
    /** Video walkthrough URL. Populated only if U9 ships. */
    video: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, guides, lab, work };
