// components/charts/ConfirmedHiresStackedBar.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { formatMonthLabel } from '../../utils/dateRangeUtils';
import { PALETTE } from '../../utils/theme';

const BUCKETS = ['Junior', 'Senior', 'Lead'];

const BUCKET_LABELS = {
  Junior: 'Junior (2–4y)',
  Senior: 'Senior (5–7y)',
  Lead:   'Lead (8y+)',
};

const BUCKET_COLORS = {
  Junior: '#84CC16',
  Senior: '#14B8A6', 
  Lead:   '#0F766E', 
};

// Fixed cap on the tooltip's height — kept comfortably below the
// ChartPanel's default height (280) so it never spills outside the panel.
const TOOLTIP_MAX_HEIGHT = 220;
const TOOLTIP_WIDTH = 290;
const TOOLTIP_GAP = 15;

// ── Core Roles List Content (reused for hover & pinned states) ─────────────
const RolesListContent = ({ data, label, isPinned, onUnpin }) => {
  const roles = data.roles || [];
  if (roles.length === 0) return null;

  const totalConfirmed = data.total || 0;

  return (
    <div
      className="custom-role-tooltip-box"
      style={{
        background: PALETTE.surface,
        border: `1px solid ${isPinned ? PALETTE.accent : PALETTE.border}`,
        borderRadius: 8,
        padding: '10px 14px',
        fontFamily: "Inter, sans-serif",
        fontSize: 18,
        minWidth: 230,
        width: TOOLTIP_WIDTH,
        maxHeight: TOOLTIP_MAX_HEIGHT,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
      }}
    >
      {/* Top Header Row: Month/Year (Left) | "Hires:X" (Right) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8, 
      }}>
        <span style={{ color: PALETTE.muted, fontWeight: 600 }}>
          {formatMonthLabel(label)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: PALETTE.text, fontWeight: 600 }}>
            Hires:
          </span>
          <span style={{ color: PALETTE.accent, fontSize: 18, fontWeight: 700 }}>
            {totalConfirmed}
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
                padding: 0,
                marginLeft: 8,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <div style={{
        borderBottom: `1px solid ${PALETTE.border}`,
        marginBottom: 10,
      }} />

      {/* Roles Dynamic Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roles.map((role, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Role Title and Count Line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: PALETTE.text, fontWeight: 600, fontSize: 18 }}>
                {role.shortTitle || 'Unknown Role'}
              </span>
              <span style={{ color: PALETTE.text, fontWeight: 700, fontSize: 18 }}>
                {role.confirmed}
              </span>
            </div>
            
            {/* Experience & Location Line */}
            <div style={{ color: PALETTE.muted, fontSize: 18, marginTop: 2 }}>
              {role.experience ? `${role.experience}y` : 'No exp.'}   • {role.location || 'Remote'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Custom Tooltip for hovering ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isStickyActive }) => {
  if (isStickyActive || !active || !payload?.length) return null;
  return <RolesListContent data={payload[0].payload} label={label} isPinned={false} />;
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function ConfirmedHiresStackedBar() {
  const { filteredPipeline } = useDateRange();
  const [activeBuckets, setActiveBuckets] = useState({});
  const containerRef = useRef(null);
  const [pinnedTooltip, setPinnedTooltip] = useState(null);

  const hasSelection = useMemo(() => {
    return Object.keys(activeBuckets).some(key => activeBuckets[key] === true);
  }, [activeBuckets]);

  useEffect(() => {
    const handleOutsideClick = () => setPinnedTooltip(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleBucket = (bucket) => {
    setActiveBuckets(prev => {
      const activeKeys = Object.keys(prev).filter(k => prev[k]);
      if (activeKeys.length === 0) {
        return { [bucket]: true };
      }
      if (prev[bucket]) {
        const next = { ...prev, [bucket]: false };
        const remaining = Object.keys(next).filter(k => next[k]);
        return remaining.length === 0 ? {} : next;
      }
      return { ...prev, [bucket]: true };
    });
  };

  const activeMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.openedMonth)) { seen.add(r.openedMonth); months.push(r.openedMonth); }
    });
    return months;
  }, [filteredPipeline]);

  const chartData = useMemo(() =>
    activeMonths.map(month => {
      const entry = { month, Junior: 0, Senior: 0, Lead: 0, total: 0, roles: [] };
      filteredPipeline.forEach(row => {
        const confirmed = row.finalConfirmed ?? 0;
        if (row.openedMonth === month && row.experienceBucket && confirmed > 0) {
          entry[row.experienceBucket] += confirmed;
          entry.total += confirmed;
          entry.roles.push({
            shortTitle: row.shortTitle,
            experience: row.experience,
            experienceBucket: row.experienceBucket,
            location: row.location,
            confirmed,
          });
        }
      });
      return entry;
    }),
  [filteredPipeline, activeMonths]);

  const rangeTotalHires = useMemo(() => {
    return chartData.reduce((acc, monthEntry) => {
      BUCKETS.forEach(bucket => {
        const isBucketActive = !hasSelection || activeBuckets[bucket];
        if (isBucketActive) {
          acc += monthEntry[bucket] || 0;
        }
      });
      return acc;
    }, 0);
  }, [chartData, hasSelection, activeBuckets]);

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
      Math.max(0, rect.height - TOOLTIP_MAX_HEIGHT)
    );

    setPinnedTooltip({ data, label: data.month, x: left, y: top });
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

      {/* Header Container for Legend & Total Count badge */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingTop: 8, 
        fontFamily: "Inter, sans-serif", 
        fontSize: 18, 
        minHeight: 28, 
        flexWrap: 'wrap',
        gap: 16 
      }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
          {BUCKETS.map(bucket => {
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
                <span style={{ width: 10, height: 10, borderRadius: 2, background: BUCKET_COLORS[bucket] }} />
                <span style={{ 
                  color: isMuted ? PALETTE.muted : PALETTE.text,
                  fontWeight: !isMuted && hasSelection ? 'bold' : 'normal'
                }}>
                  {BUCKET_LABELS[bucket]}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ 
          fontSize: 18, 
          fontWeight: 600, 
          color: PALETTE.muted, 
          display: 'flex', 
          alignItems: 'center'
          
        }}>
          Hires:
          <span style={{ 
            color: PALETTE.text, 
            fontWeight: 700, 
            padding: '2px 8px', 
            borderRadius: 6,
            fontSize: 18
          }}>
          {rangeTotalHires}
          </span>
        </div>
      </div>

      {/* Chart */}
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
              cursor={{ fill: 'rgba(15,42,34,0.05)' }}
            />
            {BUCKETS.map(bucket => {
              const shouldHideBar = hasSelection && !activeBuckets[bucket];
              return (
                <Bar
                  key={bucket} dataKey={bucket} stackId="confirmedHires"
                  fill={BUCKET_COLORS[bucket]} hide={shouldHideBar}
                  style={{ cursor: 'pointer' }}
                  onClick={(data, index, e) => handleBarClick(data, e)}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pinned tooltip */}
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
