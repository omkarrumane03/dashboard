// components/charts/CandidateFunnel.jsx

import React, { useState, useMemo, useRef } from 'react';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const STAGE_COLORS = ['#2563EB', '#0D9488', '#A16207', '#EA580C', '#DC2626'];

const TOOLTIP_WIDTH_ESTIMATE = 150; // rough, since content is whitespace-nowrap
const TOOLTIP_GAP = 6;

function BarRow({ pct, color, count, passRate, containerRef }) {
  const [hovered, setHovered] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0); // px shift from the default centered position
  const barRef = useRef(null);
  const barLeft = (100 - pct) / 2;

  const handleMouseEnter = () => {
    if (barRef.current && containerRef?.current) {
      const barRect = barRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const barCenter = barRect.left + barRect.width / 2;

      let desiredLeft = barCenter - TOOLTIP_WIDTH_ESTIMATE / 2;
      const minLeft = containerRect.left + TOOLTIP_GAP;
      const maxLeft = containerRect.right - TOOLTIP_WIDTH_ESTIMATE - TOOLTIP_GAP;
      desiredLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

      setLeftOffset(desiredLeft - barCenter);
    }
    setHovered(true);
  };

  return (
    <div ref={barRef} style={{ flex: 1, position: 'relative', height: 38 }}>
      {/* Tooltip — outside the bar so overflow:hidden doesn't clip it */}
      {hovered && passRate !== null && (
        <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              left: `calc(50% + ${leftOffset}px)`,
              transform: 'translateX(-50%)',
              backgroundColor: PALETTE.surface,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 6,
              padding: '5px 10px',
              zIndex: 200,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(15, 42, 34, 0.15)',
              pointerEvents: 'none',
            }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 600, color }}>
            {passRate}% pass rate
          </span>
        </div>
      )}

      {/* The coloured bar */}
      <div
        onMouseEnter={handleMouseEnter}
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

function FunnelConnector({ topPct, bottomPct, topColor, bottomColor, gradId }) {
  const topLeft = (100 - topPct) / 2;
  const topRight = topLeft + topPct;
  const bottomLeft = (100 - bottomPct) / 2;
  const bottomRight = bottomLeft + bottomPct;

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, height: 16 }}>
      {/* Spacer matching the stage-label column width so the taper lines up with the bars */}
      <div style={{ width: 110, flexShrink: 0 }} />
      <div style={{ flex: 1, position: 'relative' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={topColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={bottomColor} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <polygon
            points={`${topLeft},0 ${topRight},0 ${bottomRight},100 ${bottomLeft},100`}
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>
    </div>
  );
}

export default function CandidateFunnel() {
  const { filteredPipeline } = useDateRange();
  const containerRef = useRef(null);

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
  const pcts = useMemo(() => funnelData.map(d => (d.count / max) * 100), [funnelData, max]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 8px 0', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 0, flex: 1 }}>
        {funnelData.map((d, i) => {
          const pct = pcts[i];
  
          return (
            <React.Fragment key={d.stage}>
              {i > 0 && (
                <FunnelConnector
                  topPct={pcts[i - 1]}
                  bottomPct={pct}
                  topColor={STAGE_COLORS[(i - 1) % STAGE_COLORS.length]}
                  bottomColor={STAGE_COLORS[i % STAGE_COLORS.length]}
                  gradId={`funnel-grad-${i}`}
                />
              )}
              <div style={{ position: 'relative' }}>
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
                  containerRef={containerRef}
                />
              </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}