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
  Junior: '#14B8A6',
  Senior: '#A855F7', 
  Lead:   '#38BDF8',
};

// Darker text colors for accessibility contrast matching RolesActivityOverview
const BUCKET_TEXT_COLORS = {
  Junior: '#0D9488', 
  Senior: '#7E22CE', 
  Lead:   '#0369A1', 
};

// Fixed cap on the tooltip's height — kept comfortably below the
// ChartPanel's default height (280) so it never spills outside the panel.
const TOOLTIP_MAX_HEIGHT = 220;
const TOOLTIP_WIDTH = 290;
const TOOLTIP_GAP = 15;

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Core Roles List Content (reused for hover & pinned states) ─────────────
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
        boxShadow: '0 6px 20px rgba(15,42,34,0.12)',
        fontFamily: "Inter, sans-serif",
        fontSize: 17,
        minWidth: 230,
        width: TOOLTIP_WIDTH,
        maxHeight: TOOLTIP_MAX_HEIGHT,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
        padding: '10px 14px',
      }}
    >
      {/* ── Header styled exactly like RolesActivityOverview ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: -10, // offsets container padding
        background: PALETTE.surface,
        zIndex: 2,
        paddingBottom: 8,
        marginBottom: 8,
        borderBottom: `1px solid ${PALETTE.border}`,
      }}>
        <span style={{ color: PALETTE.muted, fontWeight: 600 }}>
          {formatMonthLabel(label)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: hexToRgba(PALETTE.accent, 0.12),
            color: PALETTE.accent,
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 999,
            padding: '3px 10px',
            whiteSpace: 'nowrap',
          }}>
            {data.total} confirmed
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
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Body content logic remains untouched, updating row header layout style ── */}
      <div>
        {BUCKETS.map((bucket, bi) => {
          const list = grouped[bucket];
          if (!list || list.length === 0) return null;
          return (
            <div
              key={bucket}
              style={{
                marginTop: bi === 0 ? 0 : 12,
                paddingTop: bi === 0 ? 0 : 12,
                borderTop: bi === 0 ? 'none' : `1px dashed ${PALETTE.border}`,
              }}
            >
              {/* Row title strip matching layout blocks in RolesActivityOverview */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 12, marginBottom: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: BUCKET_COLORS[bucket], flexShrink: 0,
                  }} />
                  <span style={{ color: BUCKET_TEXT_COLORS[bucket], fontWeight: 600, fontSize: 15 }}>
                    {BUCKET_LABELS[bucket].toUpperCase()}
                  </span>
                </div>
                <span style={{ fontSize: 16, color: PALETTE.muted }}>
                  {list.length} Role{list.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Individual Role Rows Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {list.map((role, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                      background: PALETTE.bg,
                      borderRadius: 6,
                      padding: '6px 8px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, fontSize: 13.5, color: PALETTE.text,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {role.shortTitle}
                      </div>
                      <div style={{
                        fontSize: 12, color: PALETTE.muted,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {role.location} · {role.experience} exp
                      </div>
                    </div>
                    <span style={{
                      flexShrink: 0,
                      background: BUCKET_COLORS[bucket],
                      color: PALETTE.surface,
                      fontWeight: 700,
                      fontSize: 12.5,
                      borderRadius: 999,
                      padding: '2px 9px',
                    }}>
                      {role.confirmed}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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

  const handleBarClick = (data, e) => {
    if (!e || !containerRef.current) return;
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

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 8, fontFamily: "Inter, sans-serif", fontSize: 18, minHeight: 20, flexWrap: 'wrap' }}>
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