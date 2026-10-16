/**
 * Small site-wide facts that appear in chrome.
 *
 * ── Needs your input ────────────────────────────────────────────────────
 * `location` is blank, so the footer's location/time detail does not render.
 * Fill both fields in and it appears — leave them blank and nothing shows.
 * Left empty deliberately rather than guessed, since a wrong city in the
 * footer is worse than no city.
 *
 *   location: 'Washington, DC'
 *   timeZone: 'America/New_York'   // IANA name — must be valid
 * ────────────────────────────────────────────────────────────────────────
 */
export const site = {
  /** Short display name, e.g. "Washington, DC". Blank hides the footer detail. */
  location: '',
  /** IANA timezone, e.g. "America/New_York". Required if `location` is set. */
  timeZone: '',
  email: 'alex@collectivelymade.com',
};

/** True only when both fields are filled, so the footer can't render half a detail. */
export const hasLocation = site.location.trim().length > 0 && site.timeZone.trim().length > 0;
