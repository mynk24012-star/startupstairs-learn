# Startup Stairs Business School: project rules

Free course section for startupstairs.in, served under `/learn`. Reference product: Zerodha Varsity.
Stack: Astro (static output) + Tailwind CSS v4 + TypeScript. No client framework. Interactive parts are small
plain TypeScript `<script>` islands.

## How content works (read this before adding a module)

- Every module is one JSON file: `content/modules/module-XX.json` (two digit number).
- `content/modules/index.json` lists module slugs in display order. A module file that is not listed still shows
  up, sorted by `moduleNumber` after the listed ones.
- The schema lives in `src/lib/schema.ts`. The build fails if a file does not match it. Fix the file, not the schema,
  unless you are adding a new feature on purpose.
- Everything is generated from data: the module list, the sidebar, chapter labels, previous and next, progress,
  "On this page", the sitemap and page meta. Never hardcode a module or chapter name in a component.
- Adding a module must never need a code or design change. If it does, the feature belongs in the schema and a
  block component, and should work for every module.
- Status `"soon"` modules need only `moduleNumber`, `slug`, `title`, `summary`, `status` and `"chapters": []`.
  No pages are built for them.

### Block types
`paragraph`, `table`, `formula`, `callout`, `calculator`, `examples`, `quiz`. Any block may carry a `heading`; it
renders as an `h2` with an anchor and appears in "On this page". Businesses used by `calculator`, `examples`
and quizzes are defined once in the module's `businesses` array and referenced by `id`.

## Design rules

Very clean, minimal, professional. Think Stripe Docs or Zerodha Varsity, not a playful edtech app.

### Colours (tokens in `src/styles/global.css`, never raw hex in components)
| Token | Value | Use |
|---|---|---|
| `ink` | #0F172B navy | Text, primary buttons |
| `accent` | #EA580C orange | Fills and rules only: active chapter bar, key takeaway left rule, progress bar |
| `accent-text` | #C2410C | Orange text and links. #EA580C fails WCAG AA as text on #FAFAFA (3.5:1), so text uses this darker shade |
| `bg` | #FAFAFA | Page background |
| `surface` | #FFFFFF | Cards, sidebar, inputs |
| `line` | #E1E5EE | All 1px borders and table rules |
| `muted` | #54607A | Secondary text |
| `sky` | #2BA6D4 | Only if really needed. Currently unused |
| `positive` / `negative` | #15803D / #B91C1C | Profit and loss numbers only |

- Orange is used sparingly. At most one orange-accented element that competes for attention per screen.
- Primary buttons are navy with white text. Secondary buttons are white with a 1px border.
- Light theme only for now. All colours are CSS variables so dark mode is a variable override later.

### Type
- Lora: `h1` and `h2` only.
- Roboto: everything else.
- JetBrains Mono: only rupee amounts and formulas in tables, calculators and formula blocks. Use `tabular-nums`.

### Shape and motion
- Radius 8px on cards and inputs, 10px on buttons. 1px borders.
- No shadows, except a very light one on the sticky sidebar if needed.
- Motion: only 150ms colour and hover transitions. Respect `prefers-reduced-motion`.

### Never use
Emojis, gradients, rotated or floating cards, mascots, bright colour blocks, big rounded pills, animated play
buttons, confetti, decorative icons, marketing hero banners, fake video players.

### Layout
- Chapter page, desktop: sticky left sidebar (module title, chapter list, check marks, progress %), centre reading
  column (max about 680px), right rail from 1200px (On this page, progress %).
- Reading order: chapter label ("Module 1 / Chapter 2 of 6"), title, optional video, blocks, key takeaway,
  Previous / Mark as complete / Next.
- Below 1024px the sidebar becomes a "Chapters" button that opens a drawer (`<dialog>`).
- No horizontal page scroll at 375px. Wide tables scroll inside their own wrapper.

### Tables
Thin row lines, right aligned numbers, tabular numerals, horizontal scroll inside a wrapper on mobile.

### Video
Plain 16:9 frame, thin border, caption. Takes an unlisted YouTube ID (`videoId`). With no ID, show the quiet
"Video coming soon" placeholder.

### Accessibility
Visible focus rings, one `h1` per page, semantic headings, `aria-current="page"` on the active chapter, WCAG AA
contrast, keyboard friendly tabs and inputs, `aria-live` for calculator and quiz results.

## Content rules

- Easy English. Short sentences. Write for a first time founder or a student.
- No em dashes or en dashes in copy. Use a full stop or a comma instead. (The minus sign in formulas is fine.)
- No jargon without a one line meaning the first time it appears.
- Money in Indian format with the rupee sign: ₹1,40,000. Use a real minus sign for losses: −₹2,00,000.
- Amounts are for teaching. The footer says they are not financial advice. Do not add real company data.
- Every chapter ends with a one or two sentence key takeaway.
- The last chapter of a module shows the quiet SS Scorecard link automatically. Do not add other promos.

## Quality bar (check before saying done)

- `npm run build` passes with zero errors and zero warnings (it runs `astro check` first).
- Lighthouse Performance, Accessibility and SEO 95+ on `/learn`, a module page and a chapter page.
- Unique title, meta description and Open Graph tags on every page. Sitemap generated.
- Works at 375px, 768px and 1440px with no horizontal page scroll.
