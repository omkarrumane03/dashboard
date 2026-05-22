import { useState, useMemo } from 'react';
import { forecastRegionSkill } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

// Modified color mapping function to take dynamic min and max values
function valueToColor(v, min, max) {
  // Prevent division by zero if all values are identical
  const range = max - min || 1;
  const t = (v - min) / range;
  
  // viridis-inspired color scale: deep purple → teal → yellow
  const r = Math.round(68 + t * (253 - 68));
  const g = Math.round(1  + t * (231 - 1));
  const b = Math.round(84 + t * (37  - 84));
  return `rgb(${r},${g},${b})`;
}

export default function ForecastRegionHeatmap() {
  // 1. Month state control panel setup (Defaulting to June forecast)
  const [selectedMonth, setSelectedMonth] = useState('Jun_F');
  
  const futureMonths = ['Jun_F', 'Jul_F', 'Aug_F'];
  const monthLabels = { Jun_F: 'June', Jul_F: 'July', Aug_F: 'August' };

  const { skills, regions } = forecastRegionSkill;
  
  // 2. Safely grab or fall back to the active month's matrix layer
  // (In case your notebookData structure is forecastRegionSkill.values[month])
  const currentValues = useMemo(() => {
    if (forecastRegionSkill.values && forecastRegionSkill.values[selectedMonth]) {
      return forecastRegionSkill.values[selectedMonth];
    }
    // Fallback alignment if values is still structured flatly as a default layout
    return forecastRegionSkill.values || [];
  }, [selectedMonth]);

  // 3. Dynamically compute bounds strictly from the active month's dataset
  const { minValue, maxValue } = useMemo(() => {
    if (!currentValues.length) return { minValue: 38, maxValue: 113 };
    const flatValues = currentValues.flat();
    return {
      minValue: Math.min(...flatValues),
      maxValue: Math.max(...flatValues)
    };
  }, [currentValues]);

  // Dimensions for Layout architecture
  const cellW = 70;
  const cellH = 38;
  const labelW = 100;
  const headerH = 30;
  
  // Add space on the right side of the main grid for the Legend scale block
  const gridW = labelW + regions.length * cellW;
  const scaleW = 60; 
  const totalW = gridW + scaleW;
  const totalH = headerH + skills.length * cellH;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: '8px' }}>
      
      {/* Month Selector UI Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        {futureMonths.map((month) => {
          const isActive = selectedMonth === month;
          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              style={{
                background: isActive ? PALETTE.accent : 'transparent',
                border: `1px solid ${isActive ? PALETTE.accent : PALETTE.border}`,
                borderRadius: 6,
                padding: '4px 12px',
                cursor: 'pointer',
                color: isActive ? '#000' : PALETTE.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                transition: 'all 0.2s ease',
              }}
            >
              {monthLabels[month]}
            </button>
          );
        })}
      </div>

      {/* Main Heatmap Visualization with Dynamic Scale */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '100%', fontFamily: "'JetBrains Mono', monospace" }}>
          
          {/* Render Columns Headers (Regions) */}
          {regions.map((r, ci) => (
            <text key={r} x={labelW + ci * cellW + cellW / 2} y={headerH - 6}
              textAnchor="middle" fill={PALETTE.muted} fontSize={12}>{r}</text>
          ))}
          
          {/* Render Rows (Skills & Heatmap Cells) */}
          {skills.map((s, ri) => (
            <g key={s}>
              <text x={labelW - 6} y={headerH + ri * cellH + cellH / 2 + 4}
                textAnchor="end" fill={PALETTE.muted} fontSize={13}>{s}</text>
              {regions.map((r, ci) => {
                const v = currentValues[ri]?.[ci] ?? 0;
                return (
                  <g key={r}>
                    <rect
                      x={labelW + ci * cellW + 2} y={headerH + ri * cellH + 2}
                      width={cellW - 4} height={cellH - 4}
                      fill={valueToColor(v, minValue, maxValue)} rx={4}
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

          {/* DYNAMIC GRADATION SCALE BAR */}
          <g transform={`translate(${gridW + 20}, ${headerH + 4})`}>
            {/* Define a linear gradient inside the SVG mapping the current min/max colors */}
            <defs>
              <linearGradient id="heatmapGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={valueToColor(minValue, minValue, maxValue)} />
                <stop offset="50%" stopColor={valueToColor((minValue + maxValue) / 2, minValue, maxValue)} />
                <stop offset="100%" stopColor={valueToColor(maxValue, minValue, maxValue)} />
              </linearGradient>
            </defs>
            
            {/* Scale Bar */}
            <rect 
              width={15} 
              height={skills.length * cellH - 4} 
              fill="url(#heatmapGradient)" 
              rx={2}
            />
            
            {/* Top Maximum Value Text Label */}
            <text 
              x={22} 
              y={10} 
              fill={PALETTE.text} 
              fontSize={11} 
              fontWeight={600}
            >
              {maxValue}
            </text>
            
            {/* Bottom Minimum Value Text Label */}
            <text 
              x={22} 
              y={skills.length * cellH - 8} 
              fill={PALETTE.muted} 
              fontSize={11} 
              fontWeight={600}
            >
              {minValue}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}