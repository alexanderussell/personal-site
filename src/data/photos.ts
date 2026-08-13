/**
 * Photo slots across the site.
 *
 * ── How to fill these in ────────────────────────────────────────────────
 * Every slot renders a labelled placeholder until `src` is set. Drop the file
 * in `public/images/` and set `src` to its path — nothing else to change.
 *
 *   src: ''                        → placeholder with the hint text
 *   src: '/images/portrait.jpg'    → the real photo
 *
 * `alt` is not optional. It is read aloud to anyone using a screen reader and
 * shown if the image fails to load, so write what the photo actually depicts
 * rather than repeating the caption.
 * ────────────────────────────────────────────────────────────────────────
 */

export type Photo = {
  /** Path under `public/`. Empty string renders the placeholder. */
  src: string;
  /** Describe the image. Required — see note above. */
  alt: string;
  /** Shown in the placeholder so you know what belongs in this slot. */
  hint: string;
  /** Optional caption rendered under the photo. */
  caption?: string;
  aspect?: 'portrait' | 'landscape' | 'square';
};

/** Homepage hero. The one photo most visitors will ever see. */
export const heroPortrait: Photo = {
  src: '',
  alt: '',
  hint: 'Hero portrait — head and shoulders, looking at camera',
  aspect: 'square',
};

/** About page header portrait. Can be the same shot as the hero, or a looser one. */
export const aboutPortrait: Photo = {
  src: '',
  alt: '',
  hint: 'About portrait — more relaxed than the hero',
  aspect: 'portrait',
};

/**
 * About page gallery strip. Four photos that show a life, not a résumé —
 * working, building, somewhere that means something.
 */
export const aboutGallery: Photo[] = [
  {
    src: '',
    alt: '',
    hint: 'At work — desk, screen, or the making of something',
    aspect: 'landscape',
  },
  {
    src: '',
    alt: '',
    hint: 'Something built — a project, a prototype, a physical thing',
    aspect: 'landscape',
  },
  {
    src: '',
    alt: '',
    hint: 'Somewhere that matters — a place, a trip, a room',
    aspect: 'landscape',
  },
  {
    src: '',
    alt: '',
    hint: 'People — collaborators, family, a room you were in',
    aspect: 'landscape',
  },
];
