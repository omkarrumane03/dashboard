// components/charts/ReasonBreakdown.jsx
// v2 — dynamic reason categorization from unique comment values
// Known aliases are mapped; everything else surfaces as its own unique reason.

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

// ── Known alias map: substring → canonical reason label ──────────────────────
// Any comment not matched here surfaces verbatim as its own reason.
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

// ── Predefined colors for known reasons; dynamic ones get auto-assigned ───────
const KNOWN_COLORS = {
  'Client Put On Hold':    '#f0883e',
  'On Hold After Select':  '#d2a8ff',
  'Vendor Conflict':       '#f85149',
  'Candidate Backout':     '#ffa657',
  'C2H Conversion':        '#58a6ff',
  'Position Dropped':      '#8b949e',
  'No Update from Client': '#6e7681',
};

// Color pool for new dynamic reasons
const COLOR_POOL = ['#3bc9a0', '#e06c75', '#61afef', '#c678dd', '#e5c07b', '#56b6c2', '#be5046'];

function resolveReason(comment = '', status = '') {
  const c = comment.trim().toLowerCase();
  if (!c || c === 'in process') return null;

  for (const { test, label } of ALIAS_MAP) {
    if (test(c, status)) return label;
  }

  // Return the original trimmed comment as its own reason (capitalised first letter)
  return comment.trim().charAt(0).toUpperCase() + comment.trim().slice(1);
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, rolesByReason, colorMap }) => {
  if (!active || !payload?.length) return null;
  const roles = rolesByReason[label] || [];
  const count = payload[0].value;
  const color = colorMap[label] ?? PALETTE.accent;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13, minWidth: 220, maxWidth: 300 }}>
      <div style={{ color, fontWeight: 700, marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${PALETTE.border}` }}>
        {label} ({count})
      </div>
      {roles.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 3 }}>
          <span style={{ color: '#c9d1d9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            • {r.shortTitle}
          </span>
          <span style={{ color: PALETTE.muted, flexShrink: 0 }}>{r.month}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const VIEWS = [
  { key: 'both',   label: 'All Unresolved' },
  { key: 'onhold', label: 'On Hold'        },
  { key: 'nohire', label: 'Closed-No Hire' },
];

export default function ReasonBreakdown() {
  const { filteredPipeline } = useDateRange();
  const [view, setView] = useState('both');

  const baseRoles = useMemo(() => {
    if (view === 'onhold') return filteredPipeline.filter(r => r.status === 'On Hold');
    if (view === 'nohire') return filteredPipeline.filter(r => r.status === 'Closed-No Hire');
    return filteredPipeline.filter(r => r.status === 'On Hold' || r.status === 'Closed-No Hire');
  }, [filteredPipeline, view]);

  // Build rolesByReason dynamically from actual comments
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

  // Build color map — known reasons use predefined colors; new ones get pool colors
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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "Inter, sans-serif" }}>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {VIEWS.map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 15,
              border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
              background: view === key ? PALETTE.accentSoft : 'transparent',
              color: view === key ? PALETTE.accent : PALETTE.muted,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        <div style={{ fontSize: 15, color: PALETTE.muted }}>
          <strong style={{ color: '#fff' }}>{total}</strong> role{total !== 1 ? 's' : ''}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PALETTE.muted, fontSize: 15, border: `1px dashed ${PALETTE.border}`, borderRadius: 8 }}>
          No data for selected filter
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 60, left: 14, bottom: 4 }}
              barSize={22}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
              <XAxis type="number"
                tick={{ fill: PALETTE.muted, fontSize: 15 }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} allowDecimals={false}
              />
              <YAxis type="category" dataKey="reason" width={160}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={-6} y={0} dy={4} textAnchor="end"
                      fill={colorMap[payload.value] ?? PALETTE.muted}
                      fontSize={15} fontFamily="Inter, sans-serif">
                      {payload.value}
                    </text>
                  </g>
                )}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip rolesByReason={rolesByReason} colorMap={colorMap} />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={30}
                label={{
                  position: 'right', fill: PALETTE.muted, fontSize: 15,
                  formatter: (v) => {
                    const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                    return `${v} (${pct}%)`;
                  },
                }}>
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
      )}

      <div style={{ fontSize: 15, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Dynamic from comment field · known aliases grouped · new reasons surface automatically · hover for role list
      </div>
    </div>
  );
}