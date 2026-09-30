# Startup Stairs Business School

This is the free course section of startupstairs.in, served under `/learn`. It is a static site built with Astro,
Tailwind CSS v4 and TypeScript.

- `/learn` is the course home with all modules
- `/learn/<module-slug>` is the module overview
- `/learn/<module-slug>/<chapter-slug>` is one chapter

Design and writing rules are in [CLAUDE.md](./CLAUDE.md). Read them before changing anything.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:4321/learn
npm run build     # type check + build into dist/
npm run preview   # serve the built site
```

Node 22 or newer.

## Add a new module

You only add one JSON file. You do not change any code.

1. Create `content/modules/module-XX.json`, where `XX` is the two-digit module number (for example `module-02.json`).
   If a "coming soon" file already exists for that module, edit it instead.
2. Add the module's `slug` to `content/modules/index.json` in the position where it should appear. If you skip this
   step, the module still appears, sorted by `moduleNumber` after the listed ones.
3. Run `npm run build`. If a field is wrong, the build stops and names the file and field.

The course list, the sidebar, the chapter labels, previous and next, progress, "On this page" and the sitemap all
update by themselves.

### Module fields

| Field | Required | Notes |
|---|---|---|
| `moduleNumber` | yes | 1, 2, 3 ... |
| `slug` | yes | The URL part, lowercase words joined by hyphens: `cac-and-payback` |
| `title` | yes | `CAC and Payback` |
| `summary` | yes | One sentence. Also used for the page description |
| `status` | yes | `"live"` builds pages. `"soon"` shows a "Coming soon" row only |
| `businesses` | no | Business presets reused by the `calculator` and `examples` blocks (see below) |
| `chapters` | yes | Use `[]` for a `"soon"` module |

### Chapter fields

| Field | Required | Notes |
|---|---|---|
| `slug` | yes | `what-is-cac` |
| `title` | yes | Shown as the page heading |
| `readMinutes` | yes | Whole number |
| `description` | no | Meta description, 170 characters at most. Defaults to the first paragraph |
| `videoId` | no | YouTube video id (see below). If you leave it out, the page shows "Video coming soon" |
| `videoCaption` | no | Text under the video |
| `blocks` | yes | The chapter content, in order |
| `takeaway` | yes | One or two sentences for the Key takeaway box |

### Block types

Any block can have a `"heading"`. It becomes a section heading and a link in "On this page".

```jsonc
{ "type": "paragraph", "heading": "Optional", "text": "A paragraph.", "items": ["Optional", "bullet list"] }

{ "type": "table", "caption": "Optional", "columns": [{ "label": "Cost" }, { "label": "Amount", "numeric": true }],
  "rows": [["Packaging", "₹30"]] }
// "numeric": true right aligns the column and uses the mono font. Write amounts as text: "₹1,40,000".

{ "type": "formula", "text": "Profit per unit = Revenue per unit − Cost per unit", "note": "Optional line below" }

{ "type": "callout", "title": "Optional", "text": "A short note in a grey box." }

{ "type": "calculator", "intro": "Optional", "businesses": ["restaurant", "salon"] }
// Leave out "businesses" to use every business in the module.

{ "type": "examples", "items": [{ "business": "restaurant", "note": "100 orders earn ₹16,000." }] }

{ "type": "quiz", "intro": "Optional",
  "questions": [{ "label": "Total cost per cake", "answer": 1200 }],
  "answerKey": ["Total cost per unit is ₹1,200."] }
// If a reader gets every answer right, the chapter is marked complete.
```

A business in the module's `businesses` list looks like this:

```json
{ "id": "restaurant", "label": "Restaurant order", "unit": "One order", "price": 500,
  "costs": [{ "label": "Ingredients", "amount": 150 }, { "label": "Packaging", "amount": 30 }] }
```

### Add a YouTube video

1. Upload the video to YouTube as **Unlisted**.
2. Copy the id from the link. It is the 11 characters after `v=` or after `youtu.be/`:
   `https://www.youtube.com/watch?v=AbCdEfGhIjK` gives `AbCdEfGhIjK`.
3. Add it to the chapter: `"videoId": "AbCdEfGhIjK"`. Paste only the id, not the full link. The build checks this.

The video loads from `youtube-nocookie.com` and only when the reader scrolls near it.

## Logo

The header loads the logo from `https://startupstairs.in/logos/SS2.png`. To serve a local copy instead, put the file
at `public/logos/SS2.png`. The build picks it up and sizes it to 32px high.

## Deploy on Netlify

`netlify.toml` already sets this up:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22
- `/` redirects to `/learn`

To deploy, connect the repo in Netlify ("Add new site" > "Import an existing project"). There is nothing to fill in
by hand. If the section moves to a different domain, change `site` in `astro.config.mjs` and the sitemap line in
`public/robots.txt`.

## Progress

Completed chapters are saved in the reader's browser (`localStorage`, key `ss-learn-progress-v1`). There are no
accounts and no server. If storage is blocked, the page still works but progress is not saved.
