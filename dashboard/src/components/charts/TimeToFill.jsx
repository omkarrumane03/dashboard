// components/charts/TimeToFill.jsx
// Shows months from Position Opened → Closed for each resolved role.
// Closed-Hired = green  |  Closed-No Hire = red
// Excludes On Hold / In Process (no closed month).

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const STATUS_COLORS = {
  'Closed-Hired':   '#3fb950',
  'Closed-No Hire': '#f85149',
};

// Parse YYYY-MM → total months integer for diff
const toMonths = (yyyyMM) => {
  const [y, m] = yyyyMM.split('-').map(Number);
  return y * 12 + m;
};

const getMonthsToClose = (openedMonth, closedMonth) => {
  if (!openedMonth || !closedMonth) return null;
  const diff = toMonths(closedMonth) - toMonths(openedMonth);
  return Math.max(0, diff); // same-month closure = 0
};

const truncateLabel = (label, maxLength = 12) =>
  label?.length > maxLength ? `${label.substring(0, maxLength)}...` : label ?? '';

const CustomXAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={10} textAnchor="end"
      fill={PALETTE.muted} fontSize={12}
      fontFamily="'Inter', sans-serif"
      transform="rotate(-35)" style={{ cursor: 'pointer' }}>
      <title>{payload.value}</title>
      {truncateLabel(payload.value, 12)}
    </text>
  </g>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13, minWidth: 210 }}>
      <div style={{ color: '#fff', fontWeight: 700, marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${PALETTE.border}` }}>
        {d.jobTitle}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: PALETTE.muted }}>Opened</span>
          <strong style={{ color: '#fff' }}>{d.openedMonth}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: PALETTE.muted }}>Closed</span>
          <strong style={{ color: '#fff' }}>{d.closedMonth}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: PALETTE.muted }}>Months to Close</span>
          <strong style={{ color: STATUS_COLORS[d.status] }}>{d.monthsToClose}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: PALETTE.muted }}>Outcome</span>
          <strong style={{ color: STATUS_COLORS[d.status] }}>{d.status}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: PALETTE.muted }}>Profiles Shared</span>
          <strong style={{ color: PALETTE.green }}>{d.profilesShared}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: PALETTE.muted }}>Selections</span>
          <strong style={{ color: PALETTE.accent }}>{d.selections ?? '—'}</strong>
        </div>
      </div>
      {d.comment && (
        <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${PALETTE.border}`, color: PALETTE.muted, fontSize: 12, lineHeight: 1.5 }}>
          {d.comment}
        </div>
      )}
    </div>
  );
};

const VIEWS = [
  { key: 'all',      label: 'All Closed'    },
  { key: 'hired',    label: 'Closed-Hired'  },
  { key: 'no-hire',  label: 'Closed-No Hire'},
];

export default function TimeToFill() {
  const { filteredPipeline } = useDateRange();
  const [view, setView] = useState('all');

  const closedRoles = useMemo(() =>
    filteredPipeline
      .filter(r => r.closedMonth && (r.status === 'Closed-Hired' || r.status === 'Closed-No Hire'))
      .map(r => ({
        ...r,
        monthsToClose: getMonthsToClose(r.openedMonth, r.closedMonth),
      }))
      .filter(r => r.monthsToClose !== null),
  [filteredPipeline]);

  const filteredByView = useMemo(() => {
    if (view === 'hired')   return closedRoles.filter(r => r.status === 'Closed-Hired');
    if (view === 'no-hire') return closedRoles.filter(r => r.status === 'Closed-No Hire');
    return closedRoles;
  }, [closedRoles, view]);

  const chartData = useMemo(() =>
    filteredByView
      .slice()
      .sort((a, b) => b.monthsToClose - a.monthsToClose)
      .map(r => ({ ...r, role: r.shortTitle })),
  [filteredByView]);

  const avgMonths = useMemo(() => {
    if (!chartData.length) return 0;
    return parseFloat(
      (chartData.reduce((s, r) => s + r.monthsToClose, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  // Counts
  const hiredCount  = closedRoles.filter(r => r.status === 'Closed-Hired').length;
  const noHireCount = closedRoles.filter(r => r.status === 'Closed-No Hire').length;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "Inter, sans-serif" }}>

      {/* Controls row */}
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
        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: PALETTE.muted }}>
          <span><strong style={{ color: '#3fb950' }}>{hiredCount}</strong> hired</span>
          <span><strong style={{ color: '#f85149' }}>{noHireCount}</strong> no-hire</span>
          <span>Avg: <strong style={{ color: PALETTE.accent }}>{avgMonths} mo</strong></span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, fontSize: 13, color: PALETTE.muted }}>
        {Object.entries(STATUS_COLORS).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {chartData.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PALETTE.muted, fontSize: 13, border: `1px dashed ${PALETTE.border}`, borderRadius: 8 }}>
          No closed roles in selected range
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%"
              margin={{ top: 10, right: 16, left: -10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="role" tick={<CustomXAxisTick />}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} interval={0} height={56} />
              <YAxis
                tick={{ fill: PALETTE.muted, fontSize: 13 }}
                axisLine={false} tickLine={false} allowDecimals={false}
                label={{ value: 'Months', angle: -90, position: 'insideLeft', fill: PALETTE.muted, fontSize: 12, dx: 14 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <ReferenceLine
                y={avgMonths} stroke={PALETTE.accent}
                strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: `Avg ${avgMonths}mo`, position: 'right', fill: PALETTE.accent, fontSize: 12 }}
              />
              <Bar dataKey="monthsToClose" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ fontSize: 12, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Month granularity · same-month open/close = 0 · excludes On Hold & In Process
      </div>
    </div>
  );
}