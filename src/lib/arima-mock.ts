/**
 * Deterministic mock series — same shape as the prototype's `buildSeries`.
 * Trend + biharmonic seasonality + uniform noise from a tiny LCG.
 * Used by the hero, ARIMA figure, and any chapter that wants a baseline series.
 */
export function buildSeries(n: number, seed: number): number[] {
  let s = seed;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const out: number[] = [];
  let v = 0;
  for (let i = 0; i < n; i++) {
    const trend = i * 0.8;
    const season = Math.sin(i / 6) * 12 + Math.cos(i / 11) * 6;
    const noise = (r() - 0.5) * 8;
    v = trend + season + noise + 50;
    out.push(v);
  }
  return out;
}

/** AIC / BIC mock — same shape as the prototype's `updateAIC`. */
export function mockAIC(p: number, d: number, q: number): { aic: number; bic: number } {
  const aic = 412 + p * 3.2 + q * 2.8 - d * 6.1 + (p === 2 && q === 2 ? -2.4 : 0);
  const bic = aic + 12.4 + p * 1.1 + q * 1.1;
  return { aic: +aic.toFixed(1), bic: +bic.toFixed(1) };
}

export const DEFAULT_HIST = buildSeries(60, 42);
