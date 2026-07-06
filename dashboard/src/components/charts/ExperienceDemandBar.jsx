// components/charts/ExperienceDemandBar.jsx
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
  Junior: '#14B8A6',
  Senior: '#A855F7', 
  Lead:   '#38BDF8', 
};

const BUCKET_TEXT_COLORS = {
  Junior: '#0F766E', 
  Senior: '#7E22CE', 
  Lead:   '#0369A1', 
};

// Tooltip dimensions — kept as constants so the click-positioning logic
// can clamp against them.
const TOOLTIP_WIDTH = 260;
const TOOLTIP_HEIGHT = 160;
const TOOLTIP_GAP = 15;

// ── Core Roles List Component (Reused for Hover & Clicked states) ─────────────
const RolesListContent = ({ data, label, isPinned, onUnpin }) => {
  const roles = data.roles || [];
  if (roles.length === 0) return null;

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
          {formatMonthLabel(label)} ({roles.length} role{roles.length !== 1 ? 's' : ''})
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

      {/* ── Content Body Part ── */}
      <div style={{ paddingTop: 6 }}>
        {BUCKETS.map(bucket => {
          if (!grouped[bucket]) return null;
          return (
            <div key={bucket} style={{ marginBottom: 6 }}>
              <div style={{ color: BUCKET_TEXT_COLORS[bucket], fontWeight: 'bold', fontSize: 18, marginBottom: 2 }}>
                {BUCKET_LABELS[bucket]}
              </div>
              {grouped[bucket].map((role, idx) => (
                <div key={idx} style={{ color: PALETTE.text, paddingLeft: 2, fontSize: 18, lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
  
  // Track strictly active/isolated buckets (Empty object means no filters active = show all)
  const [activeBuckets, setActiveBuckets] = useState({});
  const containerRef = useRef(null);

  // Track if any explicit legend selection exists right now
  const hasSelection = useMemo(() => {
    return Object.keys(activeBuckets).some(key => activeBuckets[key] === true);
  }, [activeBuckets]);

  // Track the persistent locked tooltip state
  const [pinnedTooltip, setPinnedTooltip] = useState(null);

  // Clear frozen tooltip if clicking anywhere outside the chart panel
  useEffect(() => {
    const handleOutsideClick = () => setPinnedTooltip(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleBucket = (bucket) => {
    setActiveBuckets(prev => {
      const activeKeys = Object.keys(prev).filter(k => prev[k]);

      // 1. If nothing is isolated yet, clicking one isolates it completely
      if (activeKeys.length === 0) {
        return { [bucket]: true };
      }

      // 2. If it's already active, turn it off
      if (prev[bucket]) {
        const next = { ...prev, [bucket]: false };
        const remaining = Object.keys(next).filter(k => next[k]);
        // If unchecking this leaves zero selections, return empty object to reset view
        return remaining.length === 0 ? {} : next;
      }

      // 3. If other things are already isolated, add this one into the group
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

  // Handle bar segment left click
  const handleBarClick = (data, e) => {
    if (!e || !containerRef.current) return;

    // Stop event propagation to avoid global window clear click trigger
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    // Flip left if the tooltip would overflow the panel's right edge.
    const overflowsRight = xPos + TOOLTIP_GAP + TOOLTIP_WIDTH > rect.width;
    const left = overflowsRight
      ? Math.max(0, xPos - TOOLTIP_GAP - TOOLTIP_WIDTH)
      : xPos + TOOLTIP_GAP;

    // Clamp vertically so it doesn't overflow the top or bottom of the panel.
    const top = Math.min(
      Math.max(0, yPos - 40),
      Math.max(0, rect.height - TOOLTIP_HEIGHT)
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
      {/* Global Style to hide webkit scrollbars */}
      <style>{`
        .custom-role-tooltip-box::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 8, fontFamily: "Inter, sans-serif", fontSize: 18,  flexWrap: 'wrap' }}>
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
                color: isMuted ? PALETTE.text : PALETTE.text,
                fontWeight: !isMuted && hasSelection ? 'bold' : 'normal'
              }}>
                {BUCKET_LABELS[bucket]}
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
            />
            {BUCKETS.map(bucket => {
              // Hide the Recharts bar if an exclusive selection is running and this bucket is not included
              const shouldHideBar = hasSelection && !activeBuckets[bucket];
              return (
                <Bar
                  key={bucket} dataKey={bucket} stackId="experience"
                  fill={BUCKET_COLORS[bucket]} hide={shouldHideBar}
                  style={{ cursor: 'pointer' }}
                  onClick={(data, index, e) => handleBarClick(data, e)}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Pinned Persistent Tooltip Rendered Over Chart ── */}
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