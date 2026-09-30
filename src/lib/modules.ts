import { indexSchema, moduleSchema, type Block, type Chapter, type Module } from './schema';

// Every module-XX.json in content/modules is picked up automatically.
const files = import.meta.glob<unknown>('/content/modules/module-*.json', { eager: true, import: 'default' });
const indexFile = import.meta.glob<unknown>('/content/modules/index.json', { eager: true, import: 'default' });

function load(): Module[] {
  const parsed = Object.entries(files).map(([path, data]) => {
    const result = moduleSchema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
      throw new Error(`Invalid module file ${path}\n${issues}`);
    }
    return result.data;
  });

  const slugs = new Set<string>();
  for (const m of parsed) {
    if (slugs.has(m.slug)) throw new Error(`Two module files use the slug "${m.slug}"`);
    slugs.add(m.slug);
  }

  const index = indexSchema.parse(Object.values(indexFile)[0] ?? { modules: [] });
  const position = (m: Module) => {
    const i = index.modules.indexOf(m.slug);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return parsed.sort((a, b) => position(a) - position(b) || a.moduleNumber - b.moduleNumber);
}

export const modules: Module[] = load();
export const liveModules = modules.filter((m) => m.status === 'live');

export const learnPath = '/learn';
export const modulePath = (m: Module) => `${learnPath}/${m.slug}`;
export const chapterPath = (m: Module, c: Chapter) => `${modulePath(m)}/${c.slug}`;

export const totalMinutes = (m: Module) => m.chapters.reduce((sum, c) => sum + c.readMinutes, 0);

/** Stable id for a heading block, used for anchors and "On this page". */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function chapterHeadings(c: Chapter): { id: string; text: string }[] {
  return c.blocks
    .filter((b): b is Block & { heading: string } => typeof b.heading === 'string')
    .map((b) => ({ id: headingId(b.heading), text: b.heading }));
}

export function chapterDescription(c: Chapter): string {
  if (c.description) return c.description;
  const first = c.blocks.find((b) => b.type === 'paragraph' && b.text);
  const text = first && first.type === 'paragraph' && first.text ? first.text : c.takeaway;
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text;
}
