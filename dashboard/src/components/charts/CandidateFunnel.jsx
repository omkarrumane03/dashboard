// components/charts/CandidateFunnel.jsx — Chart 15: Candidate Funnel
import { useState, useMemo } from 'react';
import { candidateFunnelMonthly } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const STAGE_COLORS = ['#58a6ff', '#3fb950', '#f0883e', '#d2a8ff', '#ffa657'];

export default function CandidateFunnelMonthly() {
  // 1. Initialize state with 'May' as default
  const [selectedMonths, setSelectedMonths] = useState(['May']);

  const months = ['Feb', 'Mar', 'Apr', 'May'];
  const stages = ['Applied', 'Screening', 'Technical', 'Offer', 'Joined'];

  // 2. Aggregate data based on selected months
  const aggregatedData = useMemo(() => {
    return stages.map(stage => {
      const totalCount = candidateFunnelMonthly
        .filter(d => d.stage === stage && selectedMonths.includes(d.month))
        .reduce((sum, curr) => sum + curr.count, 0);
      
      return { stage, count: totalCount };
    });
  }, [selectedMonths]);

  const max = aggregatedData[0]?.count || 1;

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        return prev.length > 1 ? prev.filter(m => m !== month) : prev;
      }
      return [...prev, month];
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12, padding: '0 8px' }}>
      
      {/* Month Selection Toggle */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
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

      {/* Funnel Visualization */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, flex: 1 }}>
        {aggregatedData.map((d, i) => {
          const pct = (d.count / max) * 100;
          const dropPct = i > 0
            ? (((aggregatedData[i - 1].count - d.count) / aggregatedData[i - 1].count) * 100).toFixed(0)
            : null;

          return (
            <div key={d.stage}>
              {dropPct && (
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: PALETTE.red, marginBottom: 2, textAlign: 'center' }}>
                  ▼ {dropPct}% drop-off
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 100, fontSize: 12, color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', flexShrink: 0 }}>
                  {d.stage}
                </div>
                <div style={{ flex: 1, position: 'relative', height: 28 }}>
                  <div style={{
                    position: 'absolute', left: `${(100 - pct) / 2}%`,
                    width: `${pct}%`, height: '100%',
                    background: STAGE_COLORS[i % STAGE_COLORS.length],
                    borderRadius: 4,
                    opacity: 0.85,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s ease-out'
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      {d.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}