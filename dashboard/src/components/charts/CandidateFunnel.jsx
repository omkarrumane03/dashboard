// components/charts/CandidateFunnel.jsx
// v4 — Added Hires Confirmed stage to track post-selection drops

import React, { useState, useMemo } from 'react';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

// Extended to 5 colors to support the new stage
const STAGE_COLORS = ['#58a6ff', '#3fb950', '#f0883e', '#d2a8ff', '#da3637'];

function BarRow({ pct, color, count, passRate }) {
  const [hovered, setHovered] = useState(false);
  const barLeft = (100 - pct) / 2;

  return (
    <div style={{ flex: 1, position: 'relative', height: 30 }}>
      {/* Tooltip — outside the bar so overflow:hidden doesn't clip it */}
      {hovered && passRate !== null && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#161b22',
          border: `1px solid ${PALETTE.border}`,
          borderRadius: 6,
          padding: '5px 10px',
          zIndex: 200,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color }}>
            {passRate}% pass rate
          </span>
        </div>
      )}

      {/* The coloured bar */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          left: `${barLeft}%`,
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          opacity: hovered ? 1 : 0.85,
          transition: 'opacity 0.2s ease, width 0.4s ease-out, left 0.4s ease-out',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: passRate !== null ? 'pointer' : 'default',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', padding: '0 6px' }}>
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function CandidateFunnel() {
  const { filteredPipeline } = useDateRange();
  const [hoveredStage, setHoveredStage] = useState(null);

  const funnelData = useMemo(() => {
    const totalShared     = filteredPipeline.reduce((s, r) => s + (r.profilesShared || 0), 0);
    const totalL1Reject   = filteredPipeline.reduce((s, r) => s + (r.l1Reject      || 0), 0);
    const totalL2Reject   = filteredPipeline.reduce((s, r) => s + (r.l2Reject      || 0), 0);
    const totalSelections = filteredPipeline.reduce((s, r) => s + (r.selections    ?? 0), 0);
    const totalConfirmed  = filteredPipeline.reduce((s, r) => s + (r.finalConfirmed ?? 0), 0);

    const l1Passed = totalShared - totalL1Reject;
    const l2Passed = l1Passed   - totalL2Reject;

    return [
      { stage: 'Profiles Shared', count: totalShared,              passRate: null              },
      { stage: 'L1 Passed',       count: Math.max(0, l1Passed),   passRate: totalShared > 0   ? Math.round((Math.max(0, l1Passed) / totalShared) * 100)   : null },
      { stage: 'L2 Passed',       count: Math.max(0, l2Passed),   passRate: l1Passed > 0      ? Math.round((Math.max(0, l2Passed) / Math.max(1, l1Passed)) * 100) : null },
      { stage: 'Selections',      count: totalSelections,          passRate: l2Passed > 0      ? Math.round((totalSelections / Math.max(1, l2Passed)) * 100) : null },
      { stage: 'Hires Confirmed', count: totalConfirmed,           passRate: totalSelections > 0 ? Math.round((totalConfirmed / totalSelections) * 100) : null },
    ];
  }, [filteredPipeline]);

  const max = funnelData[0]?.count || 1;

  const getDropOffBreakdown = (stageIndex) => {
    const breakdowns = [];
    filteredPipeline.forEach((role) => {
      if (stageIndex === 1) {
        if (role.l1Reject > 0)
          breakdowns.push({ name: `${role.shortTitle} (L1 Fail)`, count: role.l1Reject });
      } else if (stageIndex === 2) {
        if (role.l2Reject > 0)
          breakdowns.push({ name: `${role.shortTitle} (L2 Fail)`, count: role.l2Reject });
      } else if (stageIndex === 3) {
        const l2Passed = role.profilesShared - role.l1Reject - role.l2Reject;
        const drop     = l2Passed - (role.selections ?? 0);
        if (drop > 0 && role.comment && role.comment !== 'In Process')
          breakdowns.push({ name: `${role.shortTitle} — ${role.comment}`, count: drop });
      } else if (stageIndex === 4) {
        // Drop-off breakdown between Selections and Hires Confirmed
        const selectionCount = role.selections ?? 0;
        const confirmedCount = role.finalConfirmed ?? 0;
        const drop = selectionCount - confirmedCount;
        if (drop > 0) {
          const reason = role.comment ? ` — ${role.comment}` : ' (Post-Selection Drop)';
          breakdowns.push({ name: `${role.shortTitle}${reason}`, count: drop });
        }
      }
    });
    return breakdowns.sort((a, b) => b.count - a.count);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 8px 0', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, flex: 1 }}>
        {funnelData.map((d, i) => {
          const pct            = (d.count / max) * 100;
          const prev           = funnelData[i - 1];
          const dropPct        = prev ? (((prev.count - d.count) / prev.count) * 100).toFixed(0) : null;
          const stageBreakdown = dropPct !== null ? getDropOffBreakdown(i) : [];

          return (
            <div key={d.stage} style={{ position: 'relative' }}>
              {dropPct !== null && dropPct > 0 && (
                <div
                  style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: PALETTE.red ?? '#F85149', marginBottom: 2, textAlign: 'center', cursor: 'pointer', display: 'inline-block', width: '100%' }}
                  onMouseEnter={() => setHoveredStage(i)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <span style={{ borderBottom: '1px dashed' }}>▼ {dropPct}% drop-off</span>
                  {hoveredStage === i && stageBreakdown.length > 0 && (
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#161b22', border: `1px solid ${PALETTE.border}`, borderRadius: 6, padding: '8px 12px', zIndex: 100, width: 280, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: 15, color: '#fff', marginBottom: 4, borderBottom: '1px solid #30363d', paddingBottom: 4 }}>
                        Loss Breakdown:
                      </div>
                      {stageBreakdown.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#c9d1d9', margin: '2px 0' }}>
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {item.name}</span>
                          <span style={{ color: PALETTE.red ?? '#F85149', fontWeight: 'bold', paddingLeft: 8 }}>-{item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Stage label */}
                <div style={{ width: 110, fontSize: 18, color: PALETTE.muted, fontFamily: "Inter, sans-serif", textAlign: 'right', flexShrink: 0 }}>
                  {d.stage}
                </div>

                {/* Bar */}
                <BarRow
                  pct={pct}
                  color={STAGE_COLORS[i % STAGE_COLORS.length]}
                  count={d.count}
                  passRate={d.passRate}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}