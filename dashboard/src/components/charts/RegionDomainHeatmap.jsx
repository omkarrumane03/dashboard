// components/charts/RegionDomainHeatmap.jsx — Chart 7: Open Positions by Region & Domain
import { regionDomainHeatmap, DOMAIN_COLORS } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

// map value 25–95 → color intensity
function valueToColor(v, min = 25, max = 95) {
  const t = (v - min) / (max - min);
  // Deep navy → bright accent blue
  const r = Math.round(15 + t * (88 - 15));
  const g = Math.round(27 + t * (166 - 27));
  const b = Math.round(34 + t * (255 - 34));
  return `rgb(${r},${g},${b})`;
}

export default function RegionDomainHeatmap() {
  const { domains, regions, values } = regionDomainHeatmap;
  const cellW = 70;
  const cellH = 38;
  const labelW = 100;
  const headerH = 30;
  const totalW = labelW + regions.length * cellW;
  const totalH = headerH + domains.length * cellH;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '100%', fontFamily: "'JetBrains Mono', monospace" }}>
        {/* Region headers */}
        {regions.map((r, ci) => (
          <text key={r} 
          x={labelW + ci * cellW + cellW / 2} 
          y={headerH - 6}
          textAnchor="middle" 
          fill={PALETTE.muted} 
          fontSize={12}>
            {r}
          </text>
        ))}
        {/* Domain rows */}
        {domains.map((d, ri) => (
          <g key={d}>
            <text x={labelW - 6} y={headerH + ri * cellH + cellH / 2 + 4}
              textAnchor="end" fill={PALETTE.muted} fontSize={12}>{d}</text>
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
                    textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>
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
