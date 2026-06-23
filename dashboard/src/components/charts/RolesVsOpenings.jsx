// components/charts/RolesVsOpenings.jsx
// Stacked bars = openings by status per month
// Line overlay  = role count per month
// Tooltip shows both + avg openings per role

import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const STATUS_COLORS = {
  'In Process':     '#58a6ff',
  'On Hold':        '#f0883e',
  'Closed-Hired':   '#3fb950',
  'Closed-No Hire': '#f85149',
};

const STATUS_KEYS = ['Closed-Hired', 'Closed-No Hire', 'On Hold', 'In Process'];

// ── Tooltip ───────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const roles         = payload.find(p => p.dataKey === 'roles')?.value ?? 0;
  const totalOpenings = STATUS_KEYS.reduce((s, k) => {
    return s + (payload.find(p => p.dataKey === k)?.value ?? 0);
  }, 0);
  const avgPerRole = roles > 0
    ? parseFloat((totalOpenings / roles).toFixed(1))
    : 0;

  return (
    <div style={{
      background: '#0d1117', border: `1px solid ${PALETTE.border}`,
      borderRadius: 8, padding: '10px 14px',
      fontFamily: "Inter, sans-serif", fontSize: 13, minWidth: 220,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 8, fontWeight: 600 }}>{label}</div>

      {/* Roles vs Openings summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${PALETTE.border}` }}>
        <div>
          <div style={{ color: PALETTE.muted, fontSize: 12 }}>Roles</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{roles}</div>
        </div>
        <div>
          <div style={{ color: PALETTE.muted, fontSize: 12 }}>Total Openings</div>
          <div style={{ color: PALETTE.accent, fontWeight: 700, fontSize: 15 }}>{totalOpenings}</div>
        </div>
        <div>
          <div style={{ color: PALETTE.muted, fontSize: 12 }}>Avg/Role</div>
          <div style={{ color: '#d2a8ff', fontWeight: 700, fontSize: 15 }}>{avgPerRole}x</div>
        </div>
      </div>

      {/* Openings by status */}
      {STATUS_KEYS.map(key => {
        const val = payload.find(p => p.dataKey === key)?.value ?? 0;
        if (val === 0) return null;
        const pct = totalOpenings > 0 ? Math.round((val / totalOpenings) * 100) : 0;
        return (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLORS[key], flexShrink: 0 }} />
              <span style={{ color: STATUS_COLORS[key] }}>{key}</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 600 }}>
              {val} <span style={{ color: PALETTE.muted, fontWeight: 400 }}>({pct}%)</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Custom Legend ─────────────────────────────────────────────────────────────
const CustomLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14, fontFamily: "Inter, sans-serif", fontSize: 13, paddingBottom: 4 }}>
    {STATUS_KEYS.map(key => (
      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[key] }} />
        <span style={{ color: '#fff' }}>{key}</span>
      </div>
    ))}
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 16, height: 2, background: '#d2a8ff', borderRadius: 1 }} />
      <span style={{ color: '#d2a8ff' }}>Role Count</span>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RolesVsOpenings() {
  const { filteredPipeline } = useDateRange();

  const activeMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const chartData = useMemo(() =>
    activeMonths.map(month => {
      const rows = filteredPipeline.filter(r => r.month === month);
      const entry = { month, roles: rows.length };
      STATUS_KEYS.forEach(key => {
        entry[key] = rows
          .filter(r => r.status === key)
          .reduce((s, r) => s + (r.openings || 0), 0);
      });
      entry.totalOpenings = STATUS_KEYS.reduce((s, k) => s + entry[k], 0);
      return entry;
    }),
  [filteredPipeline, activeMonths]);

  // Summary stats
  const totals = useMemo(() => {
    const totalRoles    = filteredPipeline.length;
    const totalOpenings = filteredPipeline.reduce((s, r) => s + (r.openings || 0), 0);
    const avgPerRole    = totalRoles > 0
      ? parseFloat((totalOpenings / totalRoles).toFixed(1))
      : 0;
    return { totalRoles, totalOpenings, avgPerRole };
  }, [filteredPipeline]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "Inter, sans-serif" }}>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 20, paddingTop: 4, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Total Roles:
          <strong style={{ color: '#fff', marginLeft: 6 }}>{totals.totalRoles}</strong>
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Total Openings:
          <strong style={{ color: PALETTE.accent, marginLeft: 6 }}>{totals.totalOpenings}</strong>
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Avg Openings / Role:
          <strong style={{ color: '#d2a8ff', marginLeft: 6 }}>{totals.avgPerRole}x</strong>
        </div>
      </div>

      {/* Legend */}
      <CustomLegend />

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 40, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: PALETTE.border }} tickLine={false}
            />
            {/* Left Y — openings count */}
            <YAxis yAxisId="openings" orientation="left"
              tick={{ fill: PALETTE.muted, fontSize: 13 }}
              axisLine={false} tickLine={false} allowDecimals={false}
              label={{ value: 'Openings', angle: -90, position: 'insideLeft', fill: PALETTE.muted, fontSize: 11, dx: 16 }}
            />
            {/* Right Y — role count */}
            <YAxis yAxisId="roles" orientation="right"
              tick={{ fill: '#d2a8ff', fontSize: 13 }}
              axisLine={false} tickLine={false} allowDecimals={false}
              label={{ value: 'Roles', angle: 90, position: 'insideRight', fill: '#d2a8ff', fontSize: 11, dx: -6 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />

            {/* Stacked openings bars */}
            {STATUS_KEYS.map((key, i) => (
              <Bar
                key={key} yAxisId="openings"
                dataKey={key} stackId="openings"
                fill={STATUS_COLORS[key]} fillOpacity={0.85}
                radius={i === STATUS_KEYS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                maxBarSize={48}
              />
            ))}

            {/* Role count line */}
            <Line
              yAxisId="roles" type="monotone" dataKey="roles"
              name="Role Count"
              stroke="#d2a8ff" strokeWidth={2.5}
              dot={{ fill: '#d2a8ff', r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ fontSize: 12, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Bars = openings by status · line = role count · hover for avg openings per role
      </div>
    </div>
  );
}