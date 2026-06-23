// components/charts/ReasonBreakdown.jsx
// Shows categorized reasons for On Hold and Closed-No Hire positions
// using the `comment` field. Toggle between On Hold / Closed-No Hire / Both.

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

// ── Reason categorization ─────────────────────────────────────────────────────
const REASON_COLORS = {
  'Client Put On Hold':    '#f0883e',
  'On Hold After Select':  '#d2a8ff',
  'Vendor Conflict':       '#f85149',
  'Candidate Backout':     '#ffa657',
  'C2H Conversion':        '#58a6ff',
  'Position Dropped':      '#8b949e',
  'No Update from Client': '#6e7681',
  'Other / Unspecified':   '#4d5566',
};

const REASON_ORDER = Object.keys(REASON_COLORS);

function categorizeComment(comment = '', status = '') {
  const c = comment.toLowerCase();

  if (!c || c === 'in process') return null; // skip active

  if (c.includes('vendor conflict') || c.includes('got dropped') || c.includes('drop due'))
    return 'Vendor Conflict';

  if (c.includes('backout'))
    return 'Candidate Backout';

  if (c.includes('on hold after selection') || c.includes('on hold after select'))
    return 'On Hold After Select';

  if (c.includes('c2h') || c.includes('c2c→c2h'))
    return 'C2H Conversion';

  if (c.includes('no update'))
    return 'No Update from Client';

  if (
    c.includes('went on hold') || c.includes('position went on hold') ||
    c.includes('on hold by client') || c.includes('in final round') ||
    c.includes('went on hold')
  ) return 'Client Put On Hold';

  if (c.includes('position closed') || c.includes('position on hold') && status === 'Closed-No Hire')
    return 'Position Dropped';

  if (c.includes('position on hold'))
    return 'Client Put On Hold';

  return 'Other / Unspecified';
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, rolesByReason }) => {
  if (!active || !payload?.length) return null;
  const roles = rolesByReason[label] || [];
  const count = payload[0].value;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13, minWidth: 220, maxWidth: 300 }}>
      <div style={{ color: REASON_COLORS[label] ?? PALETTE.accent, fontWeight: 700, marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${PALETTE.border}` }}>
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
  { key: 'both',     label: 'All Unresolved' },
  { key: 'onhold',   label: 'On Hold'        },
  { key: 'nohire',   label: 'Closed-No Hire' },
];

export default function ReasonBreakdown() {
  const { filteredPipeline } = useDateRange();
  const [view, setView] = useState('both');

  const baseRoles = useMemo(() => {
    if (view === 'onhold')  return filteredPipeline.filter(r => r.status === 'On Hold');
    if (view === 'nohire')  return filteredPipeline.filter(r => r.status === 'Closed-No Hire');
    return filteredPipeline.filter(r => r.status === 'On Hold' || r.status === 'Closed-No Hire');
  }, [filteredPipeline, view]);

  // Group roles by reason category
  const rolesByReason = useMemo(() => {
    const map = {};
    baseRoles.forEach(r => {
      const reason = categorizeComment(r.comment, r.status);
      if (!reason) return;
      if (!map[reason]) map[reason] = [];
      map[reason].push(r);
    });
    return map;
  }, [baseRoles]);

  const chartData = useMemo(() =>
    REASON_ORDER
      .map(reason => ({ reason, count: rolesByReason[reason]?.length ?? 0 }))
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
              padding: '4px 12px', borderRadius: 6, fontSize: 13,
              border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
              background: view === key ? PALETTE.accentSoft : 'transparent',
              color: view === key ? PALETTE.accent : PALETTE.muted,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          <strong style={{ color: '#fff' }}>{total}</strong> role{total !== 1 ? 's' : ''}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PALETTE.muted, fontSize: 13, border: `1px dashed ${PALETTE.border}`, borderRadius: 8 }}>
          No data for selected filter
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical"
              margin={{ top: 4, right: 40, left: 14, bottom: 4 }} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
              <XAxis type="number"
                tick={{ fill: PALETTE.muted, fontSize: 13 }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} allowDecimals={false}
              />
              <YAxis type="category" dataKey="reason" width={148}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={-6} y={0} dy={4} textAnchor="end"
                      fill={REASON_COLORS[payload.value] ?? PALETTE.muted}
                      fontSize={12} fontFamily="Inter, sans-serif">
                      {payload.value}
                    </text>
                  </g>
                )}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip rolesByReason={rolesByReason} />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={30}
                label={{ position: 'right', fill: PALETTE.muted, fontSize: 12,
                  formatter: (v) => {
                    const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                    return `${v} (${pct}%)`;
                  }
                }}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`}
                    fill={REASON_COLORS[entry.reason] ?? PALETTE.accent}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ fontSize: 12, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Derived from comment field · hover bar for role breakdown
      </div>
    </div>
  );
}