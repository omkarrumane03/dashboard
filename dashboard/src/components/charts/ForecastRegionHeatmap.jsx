// components/charts/ForecastRegionHeatmap.jsx — Chart 20: Forecasted Openings by Region & Domain
import { forecastRegionDomain } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

function valueToColor(v) {
  const t = (v - 38) / (113 - 38);
  // viridis-inspired: deep purple → teal → yellow
  const r = Math.round(68 + t * (253 - 68));
  const g = Math.round(1  + t * (231 - 1));
  const b = Math.round(84 + t * (37  - 84));
  return `rgb(${r},${g},${b})`;
}

export default function ForecastRegionHeatmap() {
  const { domains, regions, values } = forecastRegionDomain;
  const cellW = 70;
  const cellH = 38;
  const labelW = 100;
  const headerH = 30;
  const totalW = labelW + regions.length * cellW;
  const totalH = headerH + domains.length * cellH;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '100%', fontFamily: "'JetBrains Mono', monospace" }}>
        {regions.map((r, ci) => (
          <text key={r} x={labelW + ci * cellW + cellW / 2} y={headerH - 6}
            textAnchor="middle" fill={PALETTE.muted} fontSize={9}>{r}</text>
        ))}
        {domains.map((d, ri) => (
          <g key={d}>
            <text x={labelW - 6} y={headerH + ri * cellH + cellH / 2 + 4}
              textAnchor="end" fill={PALETTE.muted} fontSize={9}>{d}</text>
            {regions.map((r, ci) => {
              const v = values[ri][ci];
              return (
                <g key={r}>
                  <rect
                    x={labelW + ci * cellW + 2} y={headerH + ri * cellH + 2}
                    width={cellW - 4} height={cellH - 4}
                    fill={valueToColor(v)} rx={4}
                  />
                  <text
                    x={labelW + ci * cellW + cellW / 2}
                    y={headerH + ri * cellH + cellH / 2 + 4}
                    textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>
                    {v}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
