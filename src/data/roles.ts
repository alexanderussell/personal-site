/**
 * Career history — the spine of /work.
 *
 * Case studies attach to a role via the `company` field on a `work` entry, so
 * the company string here must match the case study's frontmatter exactly.
 *
 * ── Needs your input ────────────────────────────────────────────────────
 * The entries below carry only what is already stated on the site today.
 * Dates and titles were deliberately left blank rather than guessed:
 *
 *   • `start` / `end` — add these and the timeline gains its date rail
 *   • `title`         — your actual title for each role
 *   • earlier roles   — the agencies, dev shops, and startups, which are
 *                       currently one summarising entry rather than real ones
 *
 * The timeline renders correctly with any of these missing, so fill them in
 * as they're confirmed rather than all at once.
 * ────────────────────────────────────────────────────────────────────────
 */

export type Role = {
  /** Must match the `company` field on related work entries. */
  company: string;
  /** Job title. Omitted from the render when absent. */
  title?: string;
  /** Year or `YYYY-MM`. Omitted from the render when absent. */
  start?: string;
  /** Same format as `start`. `null` means current. */
  end?: string | null;
  /** External link for the company name. */
  url?: string;
  /** A short paragraph. What the work was and what changed because of it. */
  narrative: string;
  /** Set true for a summarising entry that stands in for several roles. */
  summary?: boolean;
};

export const roles: Role[] = [
  {
    company: 'Marriott International',
    url: 'https://marriott.com',
    end: null,
    narrative:
      'Leading UX for developer tools: the internal platforms engineering teams use to ship infrastructure. Design systems built to be depended on, for users who would rather drop down to the raw API.',
  },
  {
    company: 'Collectively Made',
    url: 'https://collectivelymade.com',
    narrative:
      'A design collective I started. Client work across brand systems and product builds, with a rotating cast of collaborators.',
  },
  {
    company: 'Agencies, dev shops, and startups',
    summary: true,
    narrative:
      'Years of wearing every hat, from brand systems through full product builds. The reps that taste is downstream of.',
  },
];

/** Roles that have at least one published case study attached. */
export function rolesWithWork(companies: Set<string>): Role[] {
  return roles.filter((role) => companies.has(role.company));
}
