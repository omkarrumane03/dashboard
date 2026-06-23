// components/charts/EffortPerHire.jsx
// Profiles Shared per 1 Selection — trended month over month.
// Only uses Closed-Hired roles (where selection outcome is known).
// Lower = more efficient hiring.

import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const effortEntry  = payload.find(p => p.dataKey === 'effortPerHire');
  const sharedEntry  = payload.find(p => p.dataKey === 'profilesShared');
  const selectEntry  = payload.find(p => p.dataKey === 'selections');
  const rolesEntry   = payload.find(p => p.dataKey === 'rolesHired');

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13, minWidth: 210 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {effortEntry && (
        <div style={{ color: PALETTE.accent, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
          {effortEntry.value} profiles / hire
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sharedEntry && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: PALETTE.muted }}>Profiles Shared</span>
            <strong style={{ color: PALETTE.green }}>{sharedEntry.value}</strong>
          </div>
        )}
        {selectEntry && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: PALETTE.muted }}>Selections</span>
            <strong style={{ color: '#d2a8ff' }}>{selectEntry.value}</strong>
          </div>
        )}
        {rolesEntry && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: PALETTE.muted }}>Roles Hired</span>
            <strong style={{ color: '#fff' }}>{rolesEntry.value}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EffortPerHire() {
  const { filteredPipeline } = useDateRange();

  // Only closed-hired roles with confirmed selections
  const hiredRoles = useMemo(() =>
    filteredPipeline.filter(r => r.status === 'Closed-Hired' && (r.selections ?? 0) > 0),
  [filteredPipeline]);

  const activeMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    // Use all months in filteredPipeline to maintain timeline continuity
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const chartData = useMemo(() =>
    activeMonths
      .map(month => {
        const rows         = hiredRoles.filter(r => r.month === month);
        const profilesShared = rows.reduce((s, r) => s + (r.profilesShared || 0), 0);
        const selections   = rows.reduce((s, r) => s + (r.selections ?? 0), 0);
        const effortPerHire = selections > 0
          ? parseFloat((profilesShared / selections).toFixed(1))
          : null; // null = no hire this month, gap in line
        return {
          period: month,
          profilesShared: profilesShared || null,
          selections:     selections     || null,
          rolesHired:     rows.length    || null,
          effortPerHire,
        };
      }),
  [hiredRoles, activeMonths]);

  // Overall average
  const totalShared     = hiredRoles.reduce((s, r) => s + (r.profilesShared || 0), 0);
  const totalSelections = hiredRoles.reduce((s, r) => s + (r.selections ?? 0), 0);
  const avgEffort       = totalSelections > 0
    ? parseFloat((totalShared / totalSelections).toFixed(1))
    : null;

  const hasData = hiredRoles.length > 0;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "Inter, sans-serif" }}>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 20, paddingTop: 4, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Overall Avg:
          <strong style={{ color: PALETTE.accent, marginLeft: 6 }}>
            {avgEffort !== null ? `${avgEffort}x` : '—'}
          </strong>
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Total Hired Roles:
          <strong style={{ color: '#fff', marginLeft: 6 }}>{hiredRoles.length}</strong>
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Total Selections:
          <strong style={{ color: '#d2a8ff', marginLeft: 6 }}>{totalSelections}</strong>
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>
          Total Profiles:
          <strong style={{ color: PALETTE.green, marginLeft: 6 }}>{totalShared}</strong>
        </div>
      </div>

      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PALETTE.muted, fontSize: 13, border: `1px dashed ${PALETTE.border}`, borderRadius: 8 }}>
          No closed-hired roles in selected range
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradShared" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PALETTE.green} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="period"
                tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false}
              />
              {/* Left axis: effort ratio */}
              <YAxis yAxisId="effort" orientation="left"
                tick={{ fill: PALETTE.accent, fontSize: 13 }}
                axisLine={false} tickLine={false} allowDecimals={true}
                label={{ value: 'Profiles/Hire', angle: -90, position: 'insideLeft', fill: PALETTE.accent, fontSize: 11, dx: 16 }}
              />
              {/* Right axis: raw counts */}
              <YAxis yAxisId="counts" orientation="right"
                tick={{ fill: PALETTE.muted, fontSize: 13 }}
                axisLine={false} tickLine={false} allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top" height={28}
                formatter={k => <span style={{ fontSize: 13, fontFamily: "Inter, sans-serif" }}>{k}</span>}
              />

              {/* Profiles shared bars (background context) */}
              <Bar yAxisId="counts" dataKey="profilesShared" name="Profiles Shared"
                fill={PALETTE.green} fillOpacity={0.3} radius={[3,3,0,0]} maxBarSize={32}
              />

              {/* Selections bars */}
              <Bar yAxisId="counts" dataKey="selections" name="Selections"
                fill="#d2a8ff" fillOpacity={0.7} radius={[3,3,0,0]} maxBarSize={32}
              />

              {/* Effort line (primary insight) */}
              <Line
                yAxisId="effort" type="monotone" dataKey="effortPerHire"
                name="Profiles per Hire"
                stroke={PALETTE.accent} strokeWidth={2.5}
                dot={{ fill: PALETTE.accent, r: 5 }} activeDot={{ r: 7 }}
                connectNulls={false}
              />

              {/* Average reference line */}
              {avgEffort !== null && (
                <ReferenceLine
                  yAxisId="effort" y={avgEffort}
                  stroke={PALETTE.accent} strokeDasharray="5 3" strokeWidth={1.5} strokeOpacity={0.5}
                  label={{ value: `Avg ${avgEffort}x`, position: 'insideTopRight', fill: PALETTE.accent, fontSize: 12 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ fontSize: 12, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Lower effort = more efficient · gaps = no hires that month · only Closed-Hired roles counted
      </div>
    </div>
  );
}