const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,40,000 style. Losses use a real minus sign: −₹2,00,000. */
export function formatINR(value: number, opts: { sign?: boolean } = {}): string {
  const abs = inr.format(Math.abs(Math.round(value)));
  if (value < 0) return `−₹${abs}`;
  if (opts.sign && value > 0) return `+₹${abs}`;
  return `₹${abs}`;
}

/** Accepts "1200", "1,200", "₹1,200" or " 1 200 ". Returns null when it is not a number. */
export function parseAmount(input: string): number | null {
  const cleaned = input.replace(/[₹,\s]/g, '').replace(/−/g, '-');
  if (cleaned === '' || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(Math.abs(rounded)) : Math.abs(rounded).toFixed(1);
  return `${rounded < 0 ? '−' : ''}${text}%`;
}
