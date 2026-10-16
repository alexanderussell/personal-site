import { getCollection } from 'astro:content';

/**
 * The normalized shape every Writing *listing* renders from.
 *
 * Listings consume this type and nothing else — no direct `getCollection` calls
 * in index pages or cards. That indirection is the point: publishing may move to
 * a platform (Substack is under consideration), and when it does, the change is
 * a new producer of `WritingEntry[]` rather than a rewrite of every listing.
 *
 * Detail pages still render straight from their own collections. A feed source
 * can participate in listings; it can't participate in MDX rendering, so the
 * seam is drawn exactly where a second source could actually plug in.
 */
export type WritingEntry = {
  /** Stable identifier — `"notes/the-ladder-pulled-up"`, or a feed GUID later. */
  ref: string;
  title: string;
  description: string;
  date: Date;
  href: string;
  /** Which kind of writing this is. Drives the icon and label in listings. */
  kind: 'note' | 'guide';
  /** Growth stage, when the piece declares one. */
  status?: 'seedling' | 'growing' | 'evergreen';
};

/**
 * Load all published writing as one chronologically sorted list.
 *
 * Drafts are excluded here rather than by callers, so no listing can leak one by
 * forgetting to filter.
 */
export async function getWritingEntries(): Promise<WritingEntry[]> {
  const [notes, guides] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft),
  ]);

  return [
    ...notes.map((entry) => toWritingEntry(entry, 'note')),
    ...guides.map((entry) => toWritingEntry(entry, 'guide')),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}

type SourceEntry = {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    status?: 'seedling' | 'growing' | 'evergreen';
  };
};

/** Map one collection entry onto the normalized shape. */
function toWritingEntry(entry: SourceEntry, kind: WritingEntry['kind']): WritingEntry {
  // Detail URLs keep their existing namespaces (/notes/*, /guides/*) even though
  // the listings merge. Rewriting them would invalidate every newsletter link
  // already sent, for no reader-visible gain.
  const collection = `${kind}s`;

  return {
    ref: `${collection}/${entry.id}`,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    href: `/${collection}/${entry.id}`,
    kind,
    status: entry.data.status,
  };
}
