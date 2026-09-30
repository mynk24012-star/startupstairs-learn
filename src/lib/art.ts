/**
 * Illustration library. A module or chapter picks a scene by key in its JSON file
 * ("cover" on a module, "hero" on a chapter). New scenes go in src/components/art/ and are
 * registered here and in Scene.astro. Content never needs code for a new module: any scene can be reused.
 */
export const sceneKeys = [
  'stairs',
  'unit-journey',
  'profit-bars',
  'cost-receipt',
  'two-stairs',
  'five-shops',
  'practice-cake',
  'coins',
  'calendar-costs',
  'magnet',
  'timeline',
  'price-tag',
] as const;
export type SceneKey = (typeof sceneKeys)[number];

export const themes = ['orange', 'red', 'amber', 'peach', 'rose'] as const;
export type Theme = (typeof themes)[number];

/** Default colour when a module sets none: cycles by module number. */
export const themeFor = (moduleNumber: number, theme?: Theme): Theme => theme ?? themes[(moduleNumber - 1) % themes.length]!;
