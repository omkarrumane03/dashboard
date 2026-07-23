// components/charts/ExperienceDemandBar.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { formatMonthLabel } from '../../utils/dateRangeUtils';
import { PALETTE } from '../../utils/theme';
import useActiveToggle from '../../hooks/useActiveToggle';
import {
  EXPERIENCE_BUCKETS,
  EXPERIENCE_BUCKET_LABELS,
  EXPERIENCE_BUCKET_COLORS,
  EXPERIENCE_BUCKET_TEXT_COLORS,
  EXPERIENCE_BUCKET_TOOLTIP,
} from '../../utils/dashboardConstants';

const { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT, gap: TOOLTIP_GAP } = EXPERIENCE_BUCKET_TOOLTIP;

// ── Core Roles List Component (Restored with your original nested category layout) ──
const RolesListContent = ({ data, label, isPinned, onUnpin }) => {
  const roles = data.roles || [];
  if (roles.length === 0) return null;

  // Reconstruct your original grouping by experience bucket
  const grouped = {};
  roles.forEach(role => {
    const b = role.experienceBucket;
    if (!grouped[b]) grouped[b] = [];
    grouped[b].push(role);
  });

  return (
    <div 
      className="custom-role-tooltip-box"
      style={{ 
        background: PALETTE.surface, 
        border: `1px solid ${isPinned ? PALETTE.accent : PALETTE.border}`, 
        borderRadius: 8, 
        padding: '0px 14px 10px', 
        fontFamily: "Inter, sans-serif", 
        fontSize: 18,
        maxWidth: TOOLTIP_WIDTH,
        maxHeight: TOOLTIP_HEIGHT,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
      }}
    >
      {/* ── Fixed Sticky Header Part ── */}
      <div style={{
        color: PALETTE.muted, 
        fontWeight: 'bold',
        fontSize: 18,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: PALETTE.surface,
        zIndex: 2,
        paddingTop: '10px',
        paddingBottom: '8px',
        borderBottom: `1px solid ${PALETTE.border}`,
      }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 4 }}>
          {formatMonthLabel(label)} ({roles.length} roles)
        </span>
        {isPinned && (
          <button 
            onClick={(e) => { e.stopPropagation(); onUnpin(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: PALETTE.muted,
              cursor: 'pointer',
              fontSize: 18,
              padding: '0 4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Original Grouped Content Body Part ── */}
      <div style={{ paddingTop: 6 }}>
        {EXPERIENCE_BUCKETS.map(bucket => {
          if (!grouped[bucket]) return null;
          return (
            <div key={bucket} style={{ marginBottom: 6 }}>
              <div style={{ color: EXPERIENCE_BUCKET_TEXT_COLORS[bucket], fontWeight: 'bold', fontSize: 18, marginBottom: 2 }}>
                {EXPERIENCE_BUCKET_LABELS[bucket]}
              </div>
              {grouped[bucket].map((role, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    color: PALETTE.text, 
                    paddingLeft: 2, 
                    fontSize: 18, 
                    lineHeight: '1.4', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  • {role.shortTitle}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Custom Tooltip for Hovering ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isStickyActive }) => {
  if (isStickyActive || !active || !payload?.length) return null;
  return <RolesListContent data={payload[0].payload} label={label} isPinned={false} />;
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ExperienceDemandBar() {
  const { filteredPipeline } = useDateRange();
  const { active: activeBuckets, hasSelection, toggle: toggleBucket } = useActiveToggle();
  const containerRef = useRef(null);
  const [pinnedTooltip, setPinnedTooltip] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => setPinnedTooltip(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const activeMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.openedMonth)) { seen.add(r.openedMonth); months.push(r.openedMonth); }
    });
    return months;
  }, [filteredPipeline]);

  const chartData = useMemo(() =>
    activeMonths.map(month => {
      const entry = { month, Junior: 0, Senior: 0, Lead: 0, roles: [] };
      filteredPipeline.forEach(row => {
        if (row.openedMonth === month && row.experienceBucket) {
          entry[row.experienceBucket] += 1;
          entry.roles.push(row);
        }
      });
      return entry;
    }),
  [filteredPipeline, activeMonths]);

  const handleBarClick = (data, e) => {
    if (!e || !containerRef.current) return;

    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    const overflowsRight = xPos + TOOLTIP_GAP + TOOLTIP_WIDTH > rect.width;
    const left = overflowsRight
      ? Math.max(0, xPos - TOOLTIP_GAP - TOOLTIP_WIDTH)
      : xPos + TOOLTIP_GAP;

    const top = Math.min(
      Math.max(0, yPos - 40),
      rect.height - TOOLTIP_HEIGHT
    );

    setPinnedTooltip({
      data: data,
      label: data.month,
      x: left,
      y: top
    });
  };

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}
    >
      <style>{`
        .custom-role-tooltip-box::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 8, fontFamily: "Inter, sans-serif", fontSize: 18,  flexWrap: 'wrap' }}>
        {EXPERIENCE_BUCKETS.map(bucket => {
          const isMuted = hasSelection && !activeBuckets[bucket];
          return (
            <div
              key={bucket}
              onClick={() => toggleBucket(bucket)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, 
                cursor: 'pointer', 
                opacity: isMuted ? 0.35 : 1, 
                userSelect: 'none', 
                transition: 'opacity 0.2s ease' 
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 2, background: EXPERIENCE_BUCKET_COLORS[bucket] }} />
              <span style={{ 
                color: PALETTE.text,
                fontWeight: !isMuted && hasSelection ? 'bold' : 'normal'
              }}>
                {EXPERIENCE_BUCKET_LABELS[bucket]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart container */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%" margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              tick={{ fill: PALETTE.muted, fontSize: 18, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: PALETTE.border }} tickLine={false}
            />
            <YAxis
              tick={{ fill: PALETTE.muted, fontSize: 18, fontFamily: "Inter, sans-serif" }}
              axisLine={false} tickLine={false} allowDecimals={false}
            />
            <Tooltip 
              content={<CustomTooltip isStickyActive={!!pinnedTooltip} />} 
              cursor={{ fill: 'rgba(15,42,34,0.05)'}} 
              wrapperStyle={{ padding: 0, border: 'none', background: 'transparent' }}
            />
            {EXPERIENCE_BUCKETS.map(bucket => {
              const shouldHideBar = hasSelection && !activeBuckets[bucket];
              return (
                <Bar
                  key={bucket} dataKey={bucket} stackId="experience"
                  fill={EXPERIENCE_BUCKET_COLORS[bucket]} hide={shouldHideBar}
                  style={{ cursor: 'pointer' }}
                  onClick={(data, index, e) => handleBarClick(data, e)}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pinned Persistent Tooltip Rendered Over Chart */}
      {pinnedTooltip && (
        <div style={{
          position: 'absolute',
          left: pinnedTooltip.x,
          top: pinnedTooltip.y,
          zIndex: 100,
          pointerEvents: 'auto'
        }}>
          <RolesListContent 
            data={pinnedTooltip.data} 
            label={pinnedTooltip.label}
            isPinned={true} 
            onUnpin={() => setPinnedTooltip(null)} 
          />
        </div>
      )}
    </div>
  );
}