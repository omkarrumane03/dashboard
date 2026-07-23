// components/charts/RolesLocation.jsx

import { useMemo, useRef, useEffect, useState } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter,
  XAxis, YAxis, ZAxis, Tooltip, Cell, CartesianGrid,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';
import useActiveToggle from '../../hooks/useActiveToggle';
import { LOCATION_BUBBLE_RANGES, LOCATION_BUBBLE_TOOLTIP } from '../../utils/dashboardConstants';

const truncateLabel = (label, maxLength = 14) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

// ── Custom X Tick (Locations) ─────────────────────────────────────────────────
const CustomXAxisTick = ({ x, y, payload, locationLabels }) => {
  const fullLabel = locationLabels[payload.value] || '';
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0} y={0} dy={10}
        textAnchor="end"
        fill={PALETTE.muted}
        fontSize={18}
        fontFamily="'Inter', sans-serif"
        transform="rotate(-35)"
        style={{ cursor: 'pointer' }}
      >
        <title>{fullLabel}</title>
        {truncateLabel(fullLabel, 14)}
      </text>
    </g>
  );
};

// ── Colour by total openings ──────────────────────────────────────────────────
const getColor = (value) => {
  const range = LOCATION_BUBBLE_RANGES.find(r => value >= r.min && value <= r.max);
  return range?.color || LOCATION_BUBBLE_RANGES[0].color;
};

const getBucketLabelKey = (value) => {
  return LOCATION_BUBBLE_RANGES.find(r => value >= r.min && value <= r.max)?.key || LOCATION_BUBBLE_RANGES[0].key;
};

const { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT, gap: TOOLTIP_GAP } = LOCATION_BUBBLE_TOOLTIP;

// ── Core Roles List Component (Reused for Hover & Clicked states) ─────────────
const RolesListContent = ({ data, isPinned, onUnpin }) => {
  return (
    <div 
      className="custom-role-tooltip-box"
      style={{
        background: PALETTE.surface,
        border: `1px solid ${isPinned ? PALETTE.accent : PALETTE.border}`,
        borderRadius: 8,
        padding: '0px 14px 10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: 18,
        maxWidth: TOOLTIP_WIDTH,
        maxHeight: TOOLTIP_HEIGHT, 
        overflowY: 'auto', 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none', 
        position: 'relative',
      }}
    >
      {/* ── Fixed & Masked Header Part ── */}
      <div style={{ 
        background: PALETTE.surface, 
        position: 'sticky',
        top: 0,
        zIndex: 2,
        paddingTop: '10px',     
        paddingBottom: '6px',
        borderBottom: `1px solid ${PALETTE.border}`,
      }}>
        <div style={{ 
          color: PALETTE.muted, 
          fontWeight: 'bold', 
          fontSize: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 4 }}>
            {data.locationName}
            <span style={{ color: PALETTE.text, fontWeight: 400, fontSize: 18 }}>
              {' '}· {data.totalOpenings} Pos
            </span>
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
      </div>

      {/* ── Roles List Container ── */}
      <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.roles.map((role, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            paddingLeft: 2,
            fontSize: 18,
            color: PALETTE.text,
          }}>
            {/* Title & Location Column */}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                • {role.shortTitle}
              </span>
              {/* Shows specific underlying city if grouped into Multi-location */}
              {data.locationName === 'Multi-location' && role.location && (
                <span style={{ fontSize: 14, color: PALETTE.muted, paddingLeft: 12, marginTop: 1 }}>
                  {role.location}
                </span>
              )}
            </div>

            {/* Positions Count */}
            <span style={{ color: '#0369A1', fontWeight: 600, flexShrink: 0, fontSize: 17, marginTop: 1 }}>
              {role.openings} Pos
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Custom Tooltip for Hovering ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, isStickyActive }) => {
  if (isStickyActive || !active || !payload?.length) return null;
  return <RolesListContent data={payload[0].payload} isPinned={false} />;
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function RolesLocation() {
  const { filteredPipeline } = useDateRange();
  const containerRef = useRef(null);
  const { active: activeSizes, hasSelection, toggle: toggleSize } = useActiveToggle();

  const LEGEND_ITEMS = [
    { label: '1–4 openings',  openings: 2,  r: 6  },
    { label: '5–9 openings',  openings: 6,  r: 10 },
    { label: '10+ openings',  openings: 12, r: 14 },
  ];

  const [pinnedTooltip, setPinnedTooltip] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => setPinnedTooltip(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const uniqueLocations = useMemo(() =>
    Array.from(new Set(filteredPipeline.map(item => item.locationGroup || 'Remote'))).sort(),
  [filteredPipeline]);

  const locationLabels = useMemo(() =>
    Object.fromEntries(uniqueLocations.map((loc, i) => [i, loc])),
  [uniqueLocations]);

  const scatterData = useMemo(() => {
    return uniqueLocations
      .map((loc, xIdx) => {
        const rolesHere = filteredPipeline.filter(
          item => (item.locationGroup || 'Remote') === loc
        );
        if (rolesHere.length === 0) return null;

        const totalOpenings = rolesHere.reduce(
          (sum, item) => sum + (parseInt(item.openings, 10) || 0), 0
        );

        return {
          x: xIdx,
          y: totalOpenings,
          locationName: loc,
          totalOpenings,
          roles: rolesHere,
        };
      })
      .filter(Boolean);
  }, [filteredPipeline, uniqueLocations]);

  const yMax = useMemo(() => {
    const max = Math.max(...scatterData.map(d => d.y), 0);
    return Math.ceil(max / 5) * 5 || 10;
  }, [scatterData]);

  const handleBubbleClick = (data, e) => {
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
      x: left,
      y: top
    });
  };

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}
    >
      <style>{`
        .custom-role-tooltip-box::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {/* ── Bubble legend ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingLeft: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, color: PALETTE.muted, marginRight: 4 }}>Bubble size:</span>
        {LEGEND_ITEMS.map(({ label, openings, r }) => {
          const isMuted = hasSelection && !activeSizes[label];
          return (
            <div 
              key={label} 
              onClick={() => toggleSize(label)}
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
              <svg width={r * 2 + 2} height={r * 2 + 2} style={{ flexShrink: 0 }}>
                <circle
                  cx={r + 1} cy={r + 1} r={r}
                  fill={getColor(openings)}
                  fillOpacity={0.85}
                  stroke={PALETTE.border}
                  strokeWidth={1}
                />
              </svg>
              <span style={{ 
                fontSize: 18, 
                color: isMuted ? PALETTE.muted : PALETTE.muted,
                fontWeight: !isMuted && hasSelection ? 'bold' : 'normal'
              }}>{label}</span>
            </div>
          );
        })}
      </div>

      {scatterData.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: PALETTE.muted, fontFamily: 'Inter, sans-serif', fontSize: 18,
          border: `1px dashed ${PALETTE.border}`, borderRadius: 8,
        }}>
          No data for selected range
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />

              <XAxis
                type="number"
                dataKey="x"
                domain={[-0.5, uniqueLocations.length - 0.5]}
                ticks={uniqueLocations.map((_, i) => i)}
                tick={<CustomXAxisTick locationLabels={locationLabels} />}
                interval={0}
                axisLine={{ stroke: PALETTE.border }}
                tickLine={false}
                label={{
                  value: 'Location',
                  position: 'insideBottom',
                  offset: -65,
                  fill: PALETTE.muted,
                  fontSize: 18,
                  fontFamily: 'Inter, sans-serif',
                }}
              />

              <YAxis
                type="number"
                dataKey="y"
                domain={[0, yMax]}
                allowDecimals={false}
                tick={{ fill: PALETTE.muted, fontSize: 18, fontFamily: 'Inter, sans-serif' }}
                axisLine={{ stroke: PALETTE.border }}
                tickLine={false}
                width={65}
                label={{
                  value: 'Positions',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fill: PALETTE.muted,
                  fontSize: 18,
                  fontFamily: 'Inter, sans-serif',
                  style: { textAnchor: 'middle' }
                }}
              />

              <ZAxis type="number" dataKey="totalOpenings" range={[100, 600]} />

              <Tooltip
                content={<CustomTooltip isStickyActive={!!pinnedTooltip} />}
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(15,42,34,0.15)' }}
                wrapperStyle={{ padding: 0, border: 'none', background: 'transparent' }}
              />

              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => {
                  const targetLabelKey = getBucketLabelKey(entry.totalOpenings);
                  const isBubbleMuted = hasSelection && !activeSizes[targetLabelKey];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColor(entry.totalOpenings)}
                      stroke={PALETTE.border}
                      strokeWidth={1}
                      fillOpacity={isBubbleMuted ? 0.05 : 0.85}
                      strokeOpacity={isBubbleMuted ? 0.1 : 1}
                      style={{ cursor: isBubbleMuted ? 'default' : 'pointer', pointerEvents: isBubbleMuted ? 'none' : 'auto' }}
                      onClick={(e) => handleBubbleClick(entry, e)}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

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
            isPinned={true} 
            onUnpin={() => setPinnedTooltip(null)} 
          />
        </div>
      )}
    </div>
  );
}