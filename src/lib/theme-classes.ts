import type { Theme } from './art';

// Static class names so Tailwind can see them. One entry per theme colour.
export const themeClasses: Record<Theme, { panel: string; tint: string }> = {
  sun: { panel: 'bg-card-sun', tint: 'bg-tint-sun' },
  sky: { panel: 'bg-card-sky', tint: 'bg-tint-sky' },
  leaf: { panel: 'bg-card-leaf', tint: 'bg-tint-leaf' },
  coral: { panel: 'bg-card-coral', tint: 'bg-tint-coral' },
  lilac: { panel: 'bg-card-lilac', tint: 'bg-tint-lilac' },
};
