/**
 * Lab entries that have an interactive preview component wired up in
 * `src/components/ExperimentRenderer.astro`.
 *
 * Kept as data rather than inferred, because `ExperimentRenderer` resolves its
 * components through inline conditionals — there is nothing to introspect. An
 * entry missing from this list still gets a card, just without a preview,
 * which is the correct degradation for a write-up that has no demo.
 *
 * Adding an experiment means touching this list and `ExperimentRenderer`.
 * That duplication is noted in docs/parking-lot.md.
 */
export const RENDERABLE_LAB_IDS = new Set([
  'generative-logo',
  'ask-dads-records',
]);

export function hasPreview(id: string): boolean {
  return RENDERABLE_LAB_IDS.has(id);
}
