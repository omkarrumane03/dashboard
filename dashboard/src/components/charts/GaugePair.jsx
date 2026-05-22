// components/charts/GaugePair.jsx — Chart 8: Offer Acceptance & Joining Rate
import { useState, useMemo } from 'react';
import { offerMetricsMonthly } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

function Gauge({ value, label, sub, color }) {
  const radius = 52;
  const strokeW = 12;
  const circumference = Math.PI * radius; // half circle
  const filled = (value / 100) * circumference;
  const cx = 80, cy = 72;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <svg width={160} height={100} viewBox="0 0 160 90">
        {/* Background arc */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none" stroke={PALETTE.border} strokeWidth={strokeW} strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        {/* Value */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill={PALETTE.text}
          fontSize={24} fontWeight={700} fontFamily="'JetBrains Mono', monospace">
          {value}%
        </text>
        {/* Red threshold line at 90 */}
        {label === 'Offer Acceptance Rate' && (() => {
          const angle = Math.PI * (1 - 90 / 100);
          const tx = cx + radius * Math.cos(angle);
          const ty = cy - radius * Math.sin(angle);
          return <circle cx={tx} cy={ty} r={4} fill={PALETTE.red} />;
        })()}
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: PALETTE.text, textAlign: 'center' }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: PALETTE.muted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export default function GaugePair() {
  // 1. Initialize multi-select state defaulting to 'May'
  const [selectedMonths, setSelectedMonths] = useState(['May']);
  const months = ['Feb', 'Mar', 'Apr', 'May'];

  // 2. Average the rates across all active selected months
  const aggregatedMetrics = useMemo(() => {
    const activeData = offerMetricsMonthly.filter(d => selectedMonths.includes(d.month));
    
    if (activeData.length === 0) return { acceptRate: 0, joinRate: 0 };

    const sumAccept = activeData.reduce((acc, curr) => acc + curr.acceptRate, 0);
    const sumJoin = activeData.reduce((acc, curr) => acc + curr.joinRate, 0);

    return {
      acceptRate: Math.round(sumAccept / activeData.length),
      joinRate: Math.round(sumJoin / activeData.length),
    };
  }, [selectedMonths]);

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        // Enforce that at least one month stays selected so the gauges aren't empty
        return prev.length > 1 ? prev.filter(m => m !== month) : prev;
      }
      return [...prev, month];
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
      
      {/* Month Multi-Select Control Panel */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        <span style={{ color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, width: '100%', textAlign: 'center', marginBottom: 4 }}></span>
        {months.map((month) => {
          const isActive = selectedMonths.includes(month);
          return (
            <button
              key={month}
              onClick={() => handleMonthToggle(month)}
              style={{
                background: isActive ? PALETTE.accent : 'transparent',
                border: `1px solid ${isActive ? PALETTE.accent : PALETTE.border}`,
                borderRadius: 6,
                padding: '2px 10px',
                cursor: 'pointer',
                color: isActive ? '#000' : PALETTE.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                transition: 'all 0.2s ease',
              }}
            >
              {month}
            </button>
          );
        })}
      </div>

      {/* Gauges Render Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <Gauge 
          value={aggregatedMetrics.acceptRate} 
          label="Offer Acceptance Rate" 
          sub="Averaged Rate" 
          color={PALETTE.accent} 
        />
        <div style={{ width: 1, height: 80, background: PALETTE.border }} />
        <Gauge 
          value={aggregatedMetrics.joinRate}   
          label="Joining Rate"           
          sub="Averaged Rate" 
          color={PALETTE.green} 
        />
      </div>
    </div>
  );
}