// components/charts/RegionSkillsHeatmap.jsx — Chart 7: Open Positions by Region & Skill
import { useState } from 'react';
import { regionSkillsHeatmap, SKILL_COLORS } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

function valueToColor(v, min, max) {
  const t = max === min ? 0.5 : (v - min) / (max - min);
  const r = Math.round(15 + t * (88 - 15));
  const g = Math.round(27 + t * (166 - 27));
  const b = Math.round(34 + t * (255 - 34));
  return `rgb(${r},${g},${b})`;
}

export default function RegionSkillsHeatmap() {
  const { skills, regions, values } = regionSkillsHeatmap;
  const months = Object.keys(values);
  const [selectedMonth, setSelectedMonth] = useState('May');

  // Compute min/max from current month's data
  const flat = values[selectedMonth].flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);

  const cellW = 70;
  const cellH = 38;
  const labelW = 100;
  const headerH = 30;
  const scaleW = 36;
  const scaleBarW = 12;
  const scalePad = 14;
  const totalW = labelW + regions.length * cellW + scaleW;
  const totalH = headerH + skills.length * cellH;
  const scaleX = labelW + regions.length * cellW + scalePad;
  const scaleBarH = totalH - headerH;
  const gradientId = 'heatGradient';

  // Build gradient stops from min→max using actual colors
  // const stops = [0, 0.25, 0.5, 0.75, 1].map((t) => {
  //   const v = min + t * (max - min);
  //   return { offset: `${(1 - t) * 100}%`, color: valueToColor(v, min, max) };
  // });
// Replace the stops computation with this
  const stops = [
    { offset: '0%',   color: valueToColor(max, min, max) },
    { offset: '25%',  color: valueToColor(min + (max - min) * 0.75, min, max) },
    { offset: '50%',  color: valueToColor(min + (max - min) * 0.5,  min, max) },
    { offset: '75%',  color: valueToColor(min + (max - min) * 0.25, min, max) },
    { offset: '100%', color: valueToColor(min, min, max) },
  ];
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      {/* Month toggle */}
      <div style={{ display: 'flex', gap: 6 }}>
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              border: `1px solid ${selectedMonth === month ? PALETTE.accent ?? '#58A6FF' : PALETTE.muted ?? '#555'}`,
              background: selectedMonth === month ? (PALETTE.accent ?? '#58A6FF') : 'transparent',
              color: selectedMonth === month ? '#fff' : (PALETTE.muted ?? '#aaa'),
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: selectedMonth === month ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Heatmap + scale */}
      <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '100%', fontFamily: "'JetBrains Mono', monospace" }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            {stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>

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

        {/* Skill rows */}
        {skills.map((s, ri) => (
          <g key={s}>
            <text x={labelW - 6} y={headerH + ri * cellH + cellH / 2 + 4}
              textAnchor="end" fill={PALETTE.muted} fontSize={12}>{s}</text>
            {regions.map((r, ci) => {
              const v = values[selectedMonth][ri][ci];
              return (
                <g key={r}>
                  <rect
                    x={labelW + ci * cellW + 2} y={headerH + ri * cellH + 2}
                    width={cellW - 4} height={cellH - 4}
                    fill={valueToColor(v, min, max)} rx={4}
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

        {/* Gradient scale bar */}
        <rect
          x={scaleX} y={headerH}
          width={scaleBarW} height={scaleBarH}
          fill={`url(#${gradientId})`} rx={4}
        />
        {/* Max label */}
        <text x={scaleX + scaleBarW + 5} y={headerH + 8}
          fill={PALETTE.muted} fontSize={13} dominantBaseline="middle">{max}</text>
        {/* Mid label */}
        <text x={scaleX + scaleBarW + 5} y={headerH + scaleBarH / 2}
          fill={PALETTE.muted} fontSize={13} dominantBaseline="middle">
          {Math.round((min + max) / 2)}
        </text>
        {/* Min label */}
        <text x={scaleX + scaleBarW + 5} y={headerH + scaleBarH - 4}
          fill={PALETTE.muted} fontSize={13} dominantBaseline="middle">{min}</text>
      </svg>
    </div>
  );
}