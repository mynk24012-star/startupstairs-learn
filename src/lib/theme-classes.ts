import type { Theme } from './art';

// Static class names so Tailwind can see them. One entry per theme colour.
export const themeClasses: Record<Theme, { panel: string; tint: string }> = {
  orange: { panel: 'bg-card-orange', tint: 'bg-tint-orange' },
  red: { panel: 'bg-card-red', tint: 'bg-tint-red' },
  amber: { panel: 'bg-card-amber', tint: 'bg-tint-amber' },
  peach: { panel: 'bg-card-peach', tint: 'bg-tint-peach' },
  rose: { panel: 'bg-card-rose', tint: 'bg-tint-rose' },
};
