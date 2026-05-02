import { useMemo, useState } from 'react';
import { drawChart } from '../../lib/chart';
import { buildSeries, mockAIC } from '../../lib/arima-mock';

const HIST = buildSeries(60, 42);

type Props = {
  width?: number;
  height?: number;
  fc?: number;
  initialP?: number;
  initialD?: number;
  initialQ?: number;
};

export default function ArimaFigure({
  width = 560,
  height = 240,
  fc = 24,
  initialP = 2,
  initialD = 1,
  initialQ = 2,
}: Props) {
  const [p, setP] = useState(initialP);
  const [d, setD] = useState(initialD);
  const [q, setQ] = useState(initialQ);

  const svgInner = useMemo(
    () => drawChart({ width, height, hist: HIST, fc, p, d, q }),
    [width, height, fc, p, d, q]
  );
  const { aic, bic } = useMemo(() => mockAIC(p, d, q), [p, d, q]);

  return (
    <>
      <div className="chart-cell">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: `${height}px`, display: 'block' }}
          dangerouslySetInnerHTML={{ __html: svgInner }}
        />
      </div>
      <div className="controls">
        <Slider name="p · AR order" k="p" min={0} max={5} value={p} onChange={setP} />
        <Slider name="d · differences" k="d" min={0} max={2} value={d} onChange={setD} />
        <Slider name="q · MA order" k="q" min={0} max={5} value={q} onChange={setQ} />
        <div className="stat-row">
          <span>
            AIC <b>{aic.toFixed(1)}</b>
          </span>
          <span>
            BIC <b>{bic.toFixed(1)}</b>
          </span>
        </div>
      </div>
    </>
  );
}

function Slider({
  name,
  k,
  min,
  max,
  value,
  onChange,
}: {
  name: string;
  k: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="ctrl-grp">
      <div className="ctrl-lbl">
        <span className="name">
          <span className="k">{name}</span>
        </span>
        <span className="v">{value}</span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={1}
        value={value}
        data-k={k}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}
