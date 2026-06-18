// components/charts/CandidateFunnel.jsx
import React, { useState, useMemo } from 'react';
import { orionFunnelData } from '../../data/notebookData';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const STAGE_COLORS = ['#58a6ff', '#3fb950', '#f0883e', '#d2a8ff', '#ffa657'];

export default function CandidateFunnel() {
  const { filteredPipeline } = useDateRange();
  const [hoveredStage, setHoveredStage] = useState(null);

  // Recompute funnel data from filteredPipeline
  const funnelData = useMemo(() => {
    const totalShared     = filteredPipeline.reduce((s, r) => s + (r.profilesShared || 0), 0);
    const totalL1Reject   = filteredPipeline.reduce((s, r) => s + (r.l1Reject || 0), 0);
    const totalZeko       = filteredPipeline.reduce((s, r) => s + (r.zekoReject || 0), 0);
    const totalL2Reject   = filteredPipeline.reduce((s, r) => s + (r.l2Reject || 0), 0);
    const totalF2F        = filteredPipeline.reduce((s, r) => s + (r.f2fFinalRound || 0), 0);
    const totalSelections = filteredPipeline.reduce((s, r) => s + (r.selections || 0), 0);

    const l1Passed = totalShared - totalL1Reject - totalZeko;
    const l2Passed = l1Passed - totalL2Reject;

    return [
      { stage: 'Profiles Shared',  count: totalShared     },
      { stage: 'L1 Passed',        count: Math.max(0, l1Passed)     },
      { stage: 'L2 Passed',        count: Math.max(0, l2Passed)     },
      // { stage: 'F2F / Final',      count: totalF2F        },
      { stage: 'Selections',       count: totalSelections },
    ];
  }, [filteredPipeline]);

  const max = funnelData[0]?.count || 1;

  const getDropOffBreakdown = (stageIndex) => {
    const breakdowns = [];
    filteredPipeline.forEach((role) => {
      if (stageIndex === 1) {
        const screeningDrop = role.zekoReject || 0;
        const l1Drop = role.l1Reject || 0;
        if (screeningDrop > 0) breakdowns.push({ name: `${role.shortTitle} (Screening/Zeko)`, count: screeningDrop });
        if (l1Drop > 0)        breakdowns.push({ name: `${role.shortTitle} (L1 Fail)`,        count: l1Drop        });
      } else if (stageIndex === 2) {
        if (role.l2Reject > 0) breakdowns.push({ name: role.shortTitle, count: role.l2Reject });
      } else if (stageIndex === 3) {
        const l2Passed   = role.profilesShared - (role.l1Reject + role.l2Reject + role.zekoReject);
        const reachedF2F = role.f2fFinalRound || 0;
        const drop       = l2Passed - reachedF2F - (role.selections || 0);
        if (drop > 0 && (role.status === 'On Hold' || role.status === 'Closed' || role.status === 'No Update')) {
          breakdowns.push({ name: `${role.shortTitle} (${role.status})`, count: drop });
        }
      } else if (stageIndex === 4) {
        if (role.status === 'Dropped' && role.selections > 0) {
          breakdowns.push({ name: `${role.shortTitle} (Vendor Conflict)`, count: role.selections });
        } else if (role.status === 'Partial Onboard') {
          breakdowns.push({ name: `${role.shortTitle} (C2C→C2H Change)`, count: 1 });
        }
      }
    });
    return breakdowns.sort((a, b) => b.count - a.count);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 8px 0', position: 'relative' }}>
      {/* <div style={{ textAlign: 'center', fontSize: 14, color: PALETTE.muted, fontFamily: "Inter, sans-serif" }}>
        {filteredPipeline.length} roles · filtered pipeline data
      </div> */}

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, flex: 1 }}>
        {funnelData.map((d, i) => {
          const pct         = (d.count / max) * 100;
          const prev        = funnelData[i - 1];
          const dropPct     = prev ? (((prev.count - d.count) / prev.count) * 100).toFixed(0) : null;
          const stageBreakdown = dropPct !== null ? getDropOffBreakdown(i) : [];

          return (
            <div key={d.stage} style={{ position: 'relative' }}>
              {dropPct !== null && (
                <div
                  style={{
                    fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: PALETTE.red ?? '#F85149', marginBottom: 2, textAlign: 'center',
                    cursor: 'pointer', display: 'inline-block', width: '100%',
                  }}
                  onMouseEnter={() => setHoveredStage(i)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <span style={{ borderBottom: '1px dashed' }}>▼ {dropPct}% drop-off</span>

                  {hoveredStage === i && stageBreakdown.length > 0 && (
                    <div style={{
                      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                      backgroundColor: '#161b22', border: `1px solid ${PALETTE.border}`,
                      borderRadius: 6, padding: '8px 12px', zIndex: 100,
                      width: 260, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', textAlign: 'left',
                    }}>
                      <div style={{ fontWeight: 'bold', fontSize: 14, color: '#fff', marginBottom: 4, borderBottom: '1px solid #30363d', paddingBottom: 4 }}>
                        Loss Breakdown:
                      </div>
                      {stageBreakdown.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#c9d1d9', margin: '2px 0' }}>
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {item.name}</span>
                          <span style={{ color: PALETTE.red ?? '#F85149', fontWeight: 'bold', paddingLeft: 8 }}>-{item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 110, fontSize: 14, color: PALETTE.muted, fontFamily: "Inter, sans-serif", textAlign: 'right', flexShrink: 0 }}>
                  {d.stage}
                </div>
                <div style={{ flex: 1, position: 'relative', height: 30 }}>
                  <div style={{
                    position: 'absolute', left: `${(100 - pct) / 2}%`, width: `${pct}%`, height: '100%',
                    background: STAGE_COLORS[i % STAGE_COLORS.length],
                    borderRadius: 4, opacity: 0.85,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s ease-out',
                  }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>
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