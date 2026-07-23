// components/charts/RolesActivityOverview.jsx

import { useMemo, useState } from 'react';
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { getOrionRolesPerPeriod } from '../../data/notebookData';
import { useDateRange } from '../../context/DateRangeContext';
import { formatMonthLabel } from '../../utils/dateRangeUtils';
import { PALETTE } from '../../utils/theme';
import useActiveToggle from '../../hooks/useActiveToggle';
import { STATUS_COLORS, STATUS_ORDER, STATUS_TEXT_COLORS } from '../../utils/dashboardConstants';

// ── Tooltip ───────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const rolesOpened   = payload.find(p => p.dataKey === 'rolesOpened')?.value ?? 0;
  const totalOpenings = STATUS_ORDER.reduce(
    (s, k) => s + (payload.find(p => p.dataKey === k)?.value ?? 0), 0
  );
  const avgPerRole = rolesOpened > 0
    ? parseFloat((totalOpenings / rolesOpened).toFixed(1))
    : 0;

  const hired       = payload.find(p => p.dataKey === 'Closed-Hired')?.value  ?? 0;
  const noHire      = payload.find(p => p.dataKey === 'Closed-No Hire')?.value ?? 0;
  const totalClosed = hired + noHire;
  const hireRate    = totalClosed > 0 ? Math.round((hired / totalClosed) * 100) : null;

  return (
    <div style={{
      background: PALETTE.surface,
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "Inter, sans-serif",
      fontSize: 18,
      minWidth: 230,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 8, fontWeight: 600 }}>{formatMonthLabel(label)}</div>

      {/* Roles opened + openings summary */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: 16,
        marginBottom: 8, paddingBottom: 8,
        borderBottom: `1px solid ${PALETTE.border}`,
      }}>
        <div>
          <div style={{ color: PALETTE.muted, fontSize: 18 }}>Roles</div>
          <div style={{ color: PALETTE.purple, fontWeight: 700, fontSize: 18 }}>{rolesOpened}</div>
        </div>
        <div>
          <div style={{ color: PALETTE.muted, fontSize: 18 }}>Total Positions</div>
          <div style={{ color: PALETTE.accent, fontWeight: 700, fontSize: 18 }}>{totalOpenings}</div>
        </div>
        <div>
          <div style={{ color: PALETTE.muted, fontSize: 18 }}>Avg Pos/ Role</div>
          <div style={{ color: PALETTE.text, fontWeight: 700, fontSize: 18 }}>{avgPerRole}x</div>
        </div>
      </div>

      {/* Openings by status */}
      {STATUS_ORDER.map(key => {
        const val = payload.find(p => p.dataKey === key)?.value ?? 0;
        if (val === 0) return null;
        const pct = totalOpenings > 0 ? Math.round((val / totalOpenings) * 100) : 0;
        return (
          <div key={key} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: 12, marginBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: 2,
                background: STATUS_COLORS[key], flexShrink: 0,
              }} />
              <span style={{ color: STATUS_TEXT_COLORS[key] }}>{key}</span>
            </div>
            <span style={{ color: PALETTE.text, fontWeight: 600 }}>
              {val} <span style={{ color: PALETTE.muted, fontWeight: 400 }}>({pct}%)</span>
            </span>
          </div>
        );
      })}

      {/* Hire rate of closed roles */}
      {hireRate !== null && (
        <div style={{
          marginTop: 8, paddingTop: 6,
          borderTop: `1px solid ${PALETTE.border}`,
          color: PALETTE.muted, fontSize: 18,
        }}>
          Hire rate (of closed): <strong style={{ color: PALETTE.green }}>{hireRate}%</strong>
        </div>
      )}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RolesActivityOverview() {
  const { filteredPipeline } = useDateRange();
  const { active: activeStatuses, hasSelection, toggle: toggleStatus } = useActiveToggle();

  const rolesPerPeriod = useMemo(
    () => getOrionRolesPerPeriod(filteredPipeline),
    [filteredPipeline]
  );

  const chartData = useMemo(() => {
    return rolesPerPeriod
      .filter(d => d.rolesOpened > 0)
      .map(d => {
        const rows  = filteredPipeline.filter(r => r.month === d.period);
        const entry = { month: d.month, rolesOpened: d.rolesOpened };
        STATUS_ORDER.forEach(key => {
          entry[key] = rows
            .filter(r => r.status === key)
            .reduce((s, r) => s + (r.openings || 0), 0);
        });
        return entry;
      });
  }, [filteredPipeline, rolesPerPeriod]);

  // avgPerRole restored — was commented out in your uploaded version
  const totals = useMemo(() => {
    const totalRoles    = filteredPipeline.length;
    const totalOpenings = filteredPipeline.reduce((s, r) => s + (r.openings || 0), 0);
    const avgPerRole    = totalRoles > 0
      ? parseFloat((totalOpenings / totalRoles).toFixed(1))
      : 0;
    return { totalRoles, totalOpenings, avgPerRole };
  }, [filteredPipeline]);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      gap: 10, fontFamily: "Inter, sans-serif",
    }}>

      {/* Summary strip — Total Roles · Total Openings · Avg Openings/Role
          Absorbs the killed "Total Openings" header card                    */}
      <div style={{ display: 'flex', gap: 24, paddingTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: 18, color: PALETTE.muted }}>
          Total Roles:
          <strong style={{ color: PALETTE.purple, marginLeft: 6 }}>{totals.totalRoles}</strong>
        </div>
        <div style={{ fontSize: 18, color: PALETTE.muted }}>
          Total Positions:
          <strong style={{ color: PALETTE.accent, marginLeft: 6 }}>{totals.totalOpenings}</strong>
        </div>
        <div style={{ fontSize: 18, color: PALETTE.muted }}>
          Avg Positions / Role:
          <strong style={{ color: PALETTE.text, marginLeft: 6 }}>{totals.avgPerRole}x</strong>
        </div>
      </div>

      {/* Embedded Interacting Legend */}
      <div style={{
        display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
        gap: 14, fontFamily: "Inter, sans-serif", fontSize: 18, paddingBottom: 4,
      }}>
        {STATUS_ORDER.map(key => {
          const isMuted = hasSelection && !activeStatuses[key];
          return (
            <div 
              key={key} 
              onClick={() => toggleStatus(key)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 5, 
                cursor: 'pointer', 
                opacity: isMuted ? 0.35 : 1,
                userSelect: 'none',
                transition: 'opacity 0.2s ease'
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[key] }} />
              <span style={{ 
                color: isMuted ? PALETTE.muted : PALETTE.text,
                fontWeight: !isMuted && hasSelection ? 'bold' : 'normal'
              }}>{key}</span>
            </div>
          );
        })}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 2, background: PALETTE.purple, borderRadius: 1 }} />
          <span style={{ color: PALETTE.purple }}>Roles</span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 50, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              tick={{ fill: PALETTE.muted, fontSize: 18, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: PALETTE.border }}
              tickLine={false}
            />
            <YAxis
              yAxisId="openings"
              orientation="left"
              tick={{ fill: PALETTE.muted, fontSize: 18 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              label={{
                value: 'Positions', angle: -90, position: 'insideLeft',
                fill: PALETTE.muted, fontSize: 18, dx: 16,
              }}
            />
            <YAxis
              yAxisId="roles"
              orientation="right"
              tick={{ fill: PALETTE.purple, fontSize: 18 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              label={{
                value: 'Roles', angle: 90, position: 'insideRight',
                fill: PALETTE.purple, fontSize: 18, dx: -6,
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(15,42,34,0.04)' }}
            />

            {STATUS_ORDER.map((key, i) => {
              const shouldHideBar = hasSelection && !activeStatuses[key];
              return (
                <Bar
                  key={key}
                  yAxisId="openings"
                  dataKey={key}
                  stackId="openings"
                  fill={STATUS_COLORS[key]}
                  fillOpacity={0.85}
                  hide={shouldHideBar}
                  radius={i === STATUS_ORDER.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  maxBarSize={52}
                />
              );
            })}

            <Line
              yAxisId="roles"
              type="monotone"
              dataKey="rolesOpened"
              name="Roles"
              stroke={PALETTE.purple}
              strokeWidth={2.5}
              dot={{ fill: PALETTE.purple, r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* <div style={{ fontSize: 15, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Bars = openings by status · line = new roles opened that month · hover for avg openings per role & hire rate
      </div> */}
    </div>
  );
}