export type Point = [number, number];

export function pathFromPoints(pts: Point[]): string {
  return pts
    .map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1))
    .join(' ');
}

export function smoothPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` Q${cx},${y0} ${cx},${(y0 + y1) / 2} T${x1},${y1}`;
  }
  return d;
}

export type ChartOptions = {
  width?: number;
  height?: number;
  hist: number[];
  fc?: number;
  p?: number;
  d?: number;
  q?: number;
  accent?: string;
  showBand?: boolean;
  smaller?: boolean;
};

/**
 * Returns SVG inner markup for the forecast chart.
 * Pure function (no DOM) so the same code runs in both islands and Astro pages.
 */
export function drawChart(opts: ChartOptions): string {
  const {
    width = 560,
    height = 240,
    hist,
    fc = 24,
    p = 2,
    d = 1,
    q = 2,
    accent = '#c0453a',
    showBand = true,
    smaller = false,
  } = opts;

  const padL = smaller ? 8 : 36;
  const padR = smaller ? 8 : 14;
  const padT = smaller ? 10 : 18;
  const padB = smaller ? 14 : 24;
  const W = width - padL - padR;
  const H = height - padT - padB;

  const all = hist.slice();
  const last = all[all.length - 1];
  const slope = (all[all.length - 1] - all[all.length - 12]) / 12;
  const fcArr: number[] = [];
  for (let i = 1; i <= fc; i++) {
    const damp = Math.exp(-i / (8 + q * 4));
    const wig = Math.sin(i / (3 + p)) * (12 - q * 1.5) * damp;
    const drift = slope * i * (d === 0 ? 0.2 : d === 1 ? 0.9 : 1.4);
    fcArr.push(last + drift + wig);
  }

  const series = all.concat(fcArr);
  const min = Math.min(...series) - 8;
  const max = Math.max(...series) + 8;
  const x = (i: number) => padL + (i / (series.length - 1)) * W;
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * H;

  let svg = '';

  // grid
  svg += `<g stroke="#e6e3dc" stroke-width="1">`;
  for (let g = 0; g <= 4; g++) {
    const yy = padT + (g / 4) * H;
    svg += `<line x1="${padL}" y1="${yy}" x2="${padL + W}" y2="${yy}" stroke-dasharray="2 4" />`;
  }
  svg += `</g>`;

  // history/forecast separator
  const sepX = x(all.length - 1);
  svg += `<line x1="${sepX}" y1="${padT}" x2="${sepX}" y2="${padT + H}" stroke="${accent}" stroke-opacity="0.35" stroke-width="1" stroke-dasharray="3 3"/>`;

  // confidence band
  if (showBand) {
    const upper: Point[] = fcArr.map((v, i) => [x(all.length + i), y(v + (i + 1) * 1.6)]);
    const lower: Point[] = fcArr
      .map((v, i): Point => [x(all.length + i), y(v - (i + 1) * 1.6)])
      .reverse();
    const start: Point = [x(all.length - 1), y(last)];
    const band: Point[] = [start, ...upper, ...lower];
    svg += `<path d="${pathFromPoints(band)} Z" fill="${accent}" fill-opacity="0.12" stroke="none"/>`;
  }

  // history line
  const hp: Point[] = all.map((v, i) => [x(i), y(v)]);
  svg += `<path d="${pathFromPoints(hp)}" fill="none" stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"/>`;

  // forecast line (dashed)
  const fp: Point[] = [[x(all.length - 1), y(last)], ...fcArr.map((v, i): Point => [x(all.length + i), y(v)])];
  svg += `<path d="${pathFromPoints(fp)}" fill="none" stroke="${accent}" stroke-width="1.8" stroke-dasharray="4 3" stroke-linecap="round"/>`;

  // last point dot
  svg += `<circle cx="${x(all.length - 1)}" cy="${y(last)}" r="3" fill="${accent}"/>`;

  // axis labels
  if (!smaller) {
    svg += `<g font-family="JetBrains Mono, monospace" font-size="10" fill="#94918c">`;
    svg += `<text x="${padL}" y="${padT - 6}">value</text>`;
    svg += `<text x="${padL + W}" y="${padT + H + 14}" text-anchor="end">t →</text>`;
    svg += `<text x="${sepX + 4}" y="${padT + 12}" fill="${accent}">forecast</text>`;
    svg += `</g>`;
  }
  return svg;
}
