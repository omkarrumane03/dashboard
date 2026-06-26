// components/charts/ReasonBreakdown.jsx
// v3.0 — KPI absorption update + Label Truncation Fix
//
// Changes from v2:
//   • Added CountPill component — small colored pill badge
//   • Header now shows 3 count pills: total unresolved · closed no hire (red) · on hold (amber)
//     These replace the 3 killed openings-level KPI cards from the header
//   • totalNoHire + totalOnHold always derived from full filteredPipeline (not from baseRoles)
//     so counts are stable context anchors even when view toggle filters to one category
//   • All existing logic (ALIAS_MAP, color pool, chart, tooltip) unchanged
//   • Added Custom Y-Axis label truncation and instant native hover title.
//   • Expanded YAxis width and chart margins to prevent left-side text clipping.

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

// ── Truncate Utility ─────────────────────────────────────────────────────────
const truncateLabel = (label, maxLength = 18) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

// ── Known alias map ───────────────────────────────────────────────────────────
const ALIAS_MAP = [
  { test: c => c.includes('vendor conflict') || c.includes('got dropped') || c.includes('drop due'), label: 'Vendor Conflict' },
  { test: c => c.includes('backout'),                                                                  label: 'Candidate Backout' },
  { test: c => c.includes('on hold after selection') || c.includes('on hold after select'),           label: 'On Hold After Select' },
  { test: c => c.includes('c2h') || c.includes('c2c→c2h'),                                            label: 'C2H Conversion' },
  { test: c => c.includes('no update'),                                                                label: 'No Update from Client' },
  { test: c => c.includes('went on hold') || c.includes('on hold by client') || c.includes('in final round') || c.includes('position went on hold'), label: 'Client Put On Hold' },
  { test: (c, status) => c.includes('position closed') || (c.includes('position on hold') && status === 'Closed-No Hire'), label: 'Position Dropped' },
  { test: c => c.includes('position on hold'),                                                         label: 'Client Put On Hold' },
];

const KNOWN_COLORS = {
  'Client Put On Hold':    '#f0883e',
  'On Hold After Select':  '#d2a8ff',
  'Vendor Conflict':       '#f85149',
  'Candidate Backout':     '#ffa657',
  'C2H Conversion':        '#58a6ff',
  'Position Dropped':      '#8b949e',
  'No Update from Client': '#6e7681',
};

const COLOR_POOL = ['#3bc9a0', '#e06c75', '#61afef', '#c678dd', '#e5c07b', '#56b6c2', '#be5046'];

function resolveReason(comment = '', status = '') {
  const c = comment.trim().toLowerCase();
  if (!c || c === 'in process') return null;
  for (const { test, label } of ALIAS_MAP) {
    if (test(c, status)) return label;
  }
  return comment.trim().charAt(0).toUpperCase() + comment.trim().slice(1);
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, rolesByReason, colorMap }) => {
  if (!active || !payload?.length) return null;
  const roles = rolesByReason[label] || [];
  const count = payload[0].value;
  const color = colorMap[label] ?? PALETTE.accent;
  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "Inter, sans-serif",
      fontSize: 15,
      minWidth: 220,
      maxWidth: 300,
    }}>
      <div style={{
        color, fontWeight: 700, marginBottom: 6,
        paddingBottom: 6, borderBottom: `1px solid ${PALETTE.border}`,
      }}>
        {label} ({count})
      </div>
      {roles.map((r, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          gap: 12, marginBottom: 3,
        }}>
          <span style={{
            color: '#c9d1d9', flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            • {r.shortTitle}
          </span>
          <span style={{ color: PALETTE.muted, flexShrink: 0 }}>{r.month}</span>
        </div>
      ))}
    </div>
  );
};

// ── Count Pill — absorbs killed KPI cards ─────────────────────────────────────
function CountPill({ count, color, softColor, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 20,
      border: `1px solid ${color}44`,
      background: softColor,
    }}>
      <span style={{ fontSize: 18, fontWeight: 700, color }}>{count}</span>
      <span style={{ fontSize: 15, color: PALETTE.muted }}>{label}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const VIEWS = [
  { key: 'both',   label: 'All Unresolved' },
  { key: 'onhold', label: 'On Hold'        },
  { key: 'nohire', label: 'Closed-No Hire' },
];

export default function ReasonBreakdown() {
  const { filteredPipeline } = useDateRange();
  const [view, setView] = useState('both');

  // Always from full pipeline — stable anchors regardless of view toggle
  const allUnresolved = useMemo(
    () => filteredPipeline.filter(r => r.status === 'On Hold' || r.status === 'Closed-No Hire'),
    [filteredPipeline]
  );
  const totalNoHire = useMemo(
    () => filteredPipeline.filter(r => r.status === 'Closed-No Hire').length,
    [filteredPipeline]
  );
  const totalOnHold = useMemo(
    () => filteredPipeline.filter(r => r.status === 'On Hold').length,
    [filteredPipeline]
  );

  // baseRoles respects the view toggle (for the chart)
  const baseRoles = useMemo(() => {
    if (view === 'onhold') return filteredPipeline.filter(r => r.status === 'On Hold');
    if (view === 'nohire') return filteredPipeline.filter(r => r.status === 'Closed-No Hire');
    return allUnresolved;
  }, [filteredPipeline, view, allUnresolved]);

  const rolesByReason = useMemo(() => {
    const map = {};
    baseRoles.forEach(r => {
      const reason = resolveReason(r.comment, r.status);
      if (!reason) return;
      if (!map[reason]) map[reason] = [];
      map[reason].push(r);
    });
    return map;
  }, [baseRoles]);

  const colorMap = useMemo(() => {
    const map = { ...KNOWN_COLORS };
    let poolIdx = 0;
    Object.keys(rolesByReason).forEach(reason => {
      if (!map[reason]) {
        map[reason] = COLOR_POOL[poolIdx % COLOR_POOL.length];
        poolIdx++;
      }
    });
    return map;
  }, [rolesByReason]);

  const chartData = useMemo(() =>
    Object.entries(rolesByReason)
      .map(([reason, roles]) => ({ reason, count: roles.length }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.count - a.count),
  [rolesByReason]);

  const total = baseRoles.length;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      gap: 10, fontFamily: "Inter, sans-serif",
    }}>

      {/* ── Controls + absorbed KPI count pills ──────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, paddingTop: 4,
      }}>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4 }}>
          {VIEWS.map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 18,
              border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
              background: view === key ? PALETTE.accentSoft : 'transparent',
              color: view === key ? PALETTE.accent : PALETTE.muted,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Count pills — replace killed Closed No Hire + On Hold Openings KPI cards */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <CountPill
            count={allUnresolved.length}
            color={PALETTE.muted}
            softColor="transparent"
            label="total unresolved"
          />
          <CountPill
            count={totalNoHire}
            color={PALETTE.red ?? '#f85149'}
            softColor={`${PALETTE.red ?? '#f85149'}12`}
            label="closed no hire"
          />
          <CountPill
            count={totalOnHold}
            color={PALETTE.orange}
            softColor={`${PALETTE.orange}12`}
            label="on hold"
          />
        </div>

      </div>

      {chartData.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: PALETTE.muted, fontSize: 18,
          border: `1px dashed ${PALETTE.border}`, borderRadius: 8,
        }}>
          No data for selected filter
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.reason-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="reason-scroll" style={{ height: Math.max(chartData.length * 46 + 20, 200) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 60, left: 20, bottom: 4 }}
                barSize={22}
              >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={PALETTE.border}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: PALETTE.muted, fontSize: 18 }}
                axisLine={{ stroke: PALETTE.border }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="reason"
                width={190}
                tick={({ x, y, payload }) => {
                  const fullLabel = payload.value ?? '';
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={-10} y={0} dy={4}
                        textAnchor="end"
                        fill={colorMap[fullLabel] ?? PALETTE.muted}
                        fontSize={18}
                        fontFamily="Inter, sans-serif"
                        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                      >
                        <title>{fullLabel}</title>
                        {truncateLabel(fullLabel, 18)}
                      </text>
                    </g>
                  );
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip rolesByReason={rolesByReason} colorMap={colorMap} />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                maxBarSize={30}
                label={{
                  position: 'right',
                  fill: PALETTE.muted,
                  fontSize: 18,
                  formatter: (v) => {
                    const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                    return `${v} (${pct}%)`;
                  },
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMap[entry.reason] ?? PALETTE.accent}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}