// components/charts/TimeToFill.jsx
// v2 — same-month closure = 1 month · dual avg reference lines per outcome

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

// Same-month closure = 1 (not 0) — represents work done within that month
const getMonthsToClose = (openedMonth, closedMonth) => {
  if (!openedMonth || !closedMonth) return null;
  const diff = toMonths(closedMonth) - toMonths(openedMonth);
  return Math.max(1, diff); // floor at 1 — same month = 1 month of effort
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
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 15, minWidth: 210 }}>
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
        <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${PALETTE.border}`, color: PALETTE.muted, fontSize: 15, lineHeight: 1.5 }}>
          {d.comment}
        </div>
      )}
    </div>
  );
};

const VIEWS = [
  { key: 'all',      label: 'All Closed'     },
  { key: 'hired',    label: 'Closed-Hired'   },
  { key: 'no-hire',  label: 'Closed-No Hire' },
];

const calcAvg = (roles) => {
  if (!roles.length) return null;
  return parseFloat(
    (roles.reduce((s, r) => s + r.monthsToClose, 0) / roles.length).toFixed(1)
  );
};

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

  const hiredRoles  = useMemo(() => closedRoles.filter(r => r.status === 'Closed-Hired'),  [closedRoles]);
  const noHireRoles = useMemo(() => closedRoles.filter(r => r.status === 'Closed-No Hire'), [closedRoles]);

  // Per-outcome averages
  const avgHired  = useMemo(() => calcAvg(hiredRoles),  [hiredRoles]);
  const avgNoHire = useMemo(() => calcAvg(noHireRoles), [noHireRoles]);

  const filteredByView = useMemo(() => {
    if (view === 'hired')   return hiredRoles;
    if (view === 'no-hire') return noHireRoles;
    return closedRoles;
  }, [closedRoles, hiredRoles, noHireRoles, view]);

  const chartData = useMemo(() =>
    filteredByView
      .slice()
      .sort((a, b) => b.monthsToClose - a.monthsToClose)
      .map(r => ({ ...r, role: r.shortTitle })),
  [filteredByView]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "Inter, sans-serif" }}>

      {/* Controls row */}
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
        <div style={{ display: 'flex', gap: 12, fontSize: 15, color: PALETTE.muted }}>
          <span><strong style={{ color: '#3fb950' }}>{hiredRoles.length}</strong> hired</span>
          <span><strong style={{ color: '#f85149' }}>{noHireRoles.length}</strong> no-hire</span>
          {avgHired  !== null && <span>Hired avg: <strong style={{ color: '#3fb950' }}>{avgHired}mo</strong></span>}
          {avgNoHire !== null && <span>No-hire avg: <strong style={{ color: '#f85149' }}>{avgNoHire}mo</strong></span>}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, fontSize: 15, color: PALETTE.muted }}>
        {Object.entries(STATUS_COLORS).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
        {avgHired  !== null && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 16, height: 2, background: '#3fb950', borderRadius: 1 }} /><span>Hired avg</span></div>}
        {avgNoHire !== null && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 16, height: 2, background: '#f85149', borderRadius: 1 }} /><span>No-hire avg</span></div>}
      </div>

      {chartData.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PALETTE.muted, fontSize: 15, border: `1px dashed ${PALETTE.border}`, borderRadius: 8 }}>
          No closed roles in selected range
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%"
              margin={{ top: 10, right: 80, left: -10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="role" tick={<CustomXAxisTick />}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} interval={0} height={56} />
              <YAxis
                tick={{ fill: PALETTE.muted, fontSize: 15 }}
                axisLine={false} tickLine={false} allowDecimals={false}
                label={{ value: 'Months', angle: -90, position: 'insideLeft', fill: PALETTE.muted, fontSize: 15, dx: 14 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />

              {/* Hired avg reference line — green */}
              {avgHired !== null && (view === 'all' || view === 'hired') && (
                <ReferenceLine
                  y={avgHired}
                  stroke="#3fb950" strokeDasharray="5 3" strokeWidth={1.5}
                  label={{ value: `Hired avg ${avgHired}mo`, position: 'right', fill: '#3fb950', fontSize: 15 }}
                />
              )}

              {/* No-hire avg reference line — red */}
              {avgNoHire !== null && (view === 'all' || view === 'no-hire') && (
                <ReferenceLine
                  y={avgNoHire}
                  stroke="#f85149" strokeDasharray="5 3" strokeWidth={1.5}
                  label={{ value: `No-hire avg ${avgNoHire}mo`, position: 'right', fill: '#f85149', fontSize: 15 }}
                />
              )}

              <Bar dataKey="monthsToClose" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ fontSize: 15, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Month granularity · same-month open/close = 1mo · excludes On Hold & In Process
      </div>
    </div>
  );
}