/**
 * Chapter progress, saved in localStorage. Every read and write is wrapped in try/catch so the page
 * still works in private windows or when storage is blocked.
 *
 * DOM hooks (all driven by data attributes, so any module works):
 *   [data-check][data-module][data-chapter]      shown when that chapter is complete
 *   [data-progress][data-module][data-total]     text set to "NN%"
 *   [data-progress-bar][data-module][data-total] role="progressbar", inner [data-fill] width set
 *   [data-mark-complete][data-module][data-chapter]  toggle button
 *   [data-start][data-module][data-chapters]     "Start" link switches to "Continue" at the next open chapter
 */

const KEY = 'ss-learn-progress-v1';
type Store = Record<string, string[]>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* Storage blocked. Progress lasts for this page view only. */
  }
}

let memory: Store = read();

export function completed(module: string): Set<string> {
  return new Set(memory[module] ?? []);
}

export function setComplete(module: string, chapter: string, done: boolean) {
  const set = completed(module);
  if (done) set.add(chapter);
  else set.delete(chapter);
  memory = { ...memory, [module]: [...set] };
  write(memory);
  render();
}

function percent(module: string, total: number, chapters?: string[]): number {
  if (!total) return 0;
  const set = completed(module);
  const count = chapters ? chapters.filter((c) => set.has(c)).length : set.size;
  return Math.round((Math.min(count, total) / total) * 100);
}

function chaptersOf(el: HTMLElement): string[] | undefined {
  try {
    return el.dataset.chapters ? (JSON.parse(el.dataset.chapters) as string[]) : undefined;
  } catch {
    return undefined;
  }
}

export function render() {
  document.querySelectorAll<HTMLElement>('[data-check]').forEach((el) => {
    el.hidden = !completed(el.dataset.module!).has(el.dataset.chapter!);
  });

  document.querySelectorAll<HTMLElement>('[data-progress]').forEach((el) => {
    el.textContent = `${percent(el.dataset.module!, Number(el.dataset.total), chaptersOf(el))}%`;
  });

  document.querySelectorAll<HTMLElement>('[data-progress-bar]').forEach((el) => {
    const p = percent(el.dataset.module!, Number(el.dataset.total), chaptersOf(el));
    el.setAttribute('aria-valuenow', String(p));
    const fill = el.querySelector<HTMLElement>('[data-fill]');
    if (fill) fill.style.width = `${p}%`;
  });

  document.querySelectorAll<HTMLButtonElement>('[data-mark-complete]').forEach((btn) => {
    const done = completed(btn.dataset.module!).has(btn.dataset.chapter!);
    btn.setAttribute('aria-pressed', String(done));
    const label = btn.querySelector('[data-label]');
    if (label) label.textContent = done ? 'Completed' : 'Mark as complete';
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-start]').forEach((a) => {
    const slugs = chaptersOf(a) ?? [];
    const set = completed(a.dataset.module!);
    const next = slugs.find((s) => !set.has(s));
    const any = slugs.some((s) => set.has(s));
    if (any && next) {
      a.href = `${a.dataset.base}/${next}`;
      a.textContent = 'Continue where you left off';
    }
  });
}

let wired = false;
export function initProgress() {
  if (wired) return;
  wired = true;

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-mark-complete]');
    if (!btn) return;
    const done = btn.getAttribute('aria-pressed') === 'true';
    setComplete(btn.dataset.module!, btn.dataset.chapter!, !done);
  });

  // Keep several open tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      memory = read();
      render();
    }
  });

  render();
}
