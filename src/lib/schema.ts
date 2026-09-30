import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words joined by hyphens');

/** Optional on every block. Renders as an h2 with an anchor and appears in "On this page". */
const heading = z.string().min(1).optional();

const paragraphBlock = z
  .object({
    type: z.literal('paragraph'),
    heading,
    text: z.string().min(1).optional(),
    items: z.array(z.string().min(1)).optional(),
  })
  .refine((b) => b.text || b.items, 'A paragraph needs "text", "items" or both');

const tableColumn = z.object({
  label: z.string(),
  /** Right align, tabular numerals and mono font. Use for rupee amounts. */
  numeric: z.boolean().default(false),
});

const tableBlock = z.object({
  type: z.literal('table'),
  heading,
  caption: z.string().optional(),
  columns: z.array(tableColumn).min(1),
  rows: z.array(z.array(z.string())).min(1),
});

const formulaBlock = z.object({
  type: z.literal('formula'),
  heading,
  text: z.string().min(1),
  note: z.string().optional(),
});

const calloutBlock = z.object({
  type: z.literal('callout'),
  heading,
  title: z.string().optional(),
  text: z.string().min(1),
});

const calculatorBlock = z.object({
  type: z.literal('calculator'),
  heading,
  intro: z.string().optional(),
  /** Business ids from the module's "businesses" list. Defaults to all of them. */
  businesses: z.array(slug).optional(),
});

const examplesBlock = z.object({
  type: z.literal('examples'),
  heading,
  intro: z.string().optional(),
  items: z
    .array(
      z.object({
        business: slug,
        note: z.string().min(1),
      }),
    )
    .min(1),
});

const quizBlock = z.object({
  type: z.literal('quiz'),
  heading,
  intro: z.string().optional(),
  questions: z
    .array(
      z.object({
        label: z.string().min(1),
        answer: z.number(),
      }),
    )
    .min(1),
  /** Shown when the reader presses "Show answers". */
  answerKey: z.array(z.string().min(1)).min(1),
});

export const blockSchema = z.union([
  paragraphBlock,
  tableBlock,
  formulaBlock,
  calloutBlock,
  calculatorBlock,
  examplesBlock,
  quizBlock,
]);

const businessSchema = z.object({
  id: slug,
  /** Shown in the calculator dropdown and example tabs, e.g. "Restaurant order". */
  label: z.string().min(1),
  /** What one unit is, e.g. "One order". */
  unit: z.string().min(1),
  price: z.number().nonnegative(),
  costs: z
    .array(
      z.object({
        label: z.string().min(1),
        amount: z.number().nonnegative(),
      }),
    )
    .min(1),
});

const chapterSchema = z.object({
  slug,
  title: z.string().min(1),
  /** Used for the meta description. Falls back to the first paragraph. */
  description: z.string().max(170).optional(),
  readMinutes: z.number().int().positive(),
  /** Unlisted YouTube video id, 11 characters. Leave out to show "Video coming soon". */
  videoId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{11}$/, 'A YouTube id is the 11 characters after "v=" in the video link')
    .optional(),
  videoCaption: z.string().optional(),
  blocks: z.array(blockSchema).min(1),
  takeaway: z.string().min(1),
});

export const moduleSchema = z
  .object({
    moduleNumber: z.number().int().positive(),
    slug,
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['live', 'soon']),
    businesses: z.array(businessSchema).default([]),
    chapters: z.array(chapterSchema).default([]),
  })
  .superRefine((m, ctx) => {
    if (m.status === 'live' && m.chapters.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'A live module needs at least one chapter' });
    }
    const seen = new Set<string>();
    for (const c of m.chapters) {
      if (seen.has(c.slug)) ctx.addIssue({ code: 'custom', message: `Duplicate chapter slug "${c.slug}"` });
      seen.add(c.slug);
    }
    const ids = new Set(m.businesses.map((b) => b.id));
    const refs = m.chapters.flatMap((c) =>
      c.blocks.flatMap((b) =>
        b.type === 'calculator' ? (b.businesses ?? []) : b.type === 'examples' ? b.items.map((i) => i.business) : [],
      ),
    );
    for (const r of refs) {
      if (!ids.has(r)) ctx.addIssue({ code: 'custom', message: `Unknown business id "${r}"` });
    }
  });

export const indexSchema = z.object({
  modules: z.array(slug),
});

export type Module = z.infer<typeof moduleSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type Block = z.infer<typeof blockSchema>;
export type Business = z.infer<typeof businessSchema>;
