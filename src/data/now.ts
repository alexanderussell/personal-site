/**
 * The "now" strip on /about. Update by hand (for now) — keep it honest,
 * keep it short, and bump `updated` whenever anything changes.
 */
export const now: {
  updated: Date;
  items: { label: string; text: string; href?: string }[];
} = {
  updated: new Date('2026-06-10'),
  items: [
    {
      label: 'Writing',
      text: 'Designing with AI — the book',
      href: '/book',
    },
    {
      label: 'Chewing on',
      text: "Where the next generation's taste comes from, now that AI has eaten the reps",
      href: '/notes/the-ladder-pulled-up',
    },
    {
      label: 'Building',
      text: 'This site, in public — experiments and all',
      href: '/experiments',
    },
    {
      label: 'Listening',
      text: "Dad's records. The collection keeps growing",
      href: '/experiments/ask-dads-records',
    },
  ],
};
