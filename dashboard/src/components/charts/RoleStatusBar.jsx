// components/charts/RoleStatusBar.jsx
// Horizontal stacked bar — one bar per role, segments = status breakdown of openings
// Month toggle filters which roles are visible
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { orionPipeline, MONTHS } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const STATUS_COLORS = {
  'Active':              '#3fb950',
  'Active – L1 Pending': '#58a6ff',
  'On Hold':             '#f0883e',
  'Not Started':         '#6e7681',
  'Partial Onboard':     '#3bc9a0',
  'Dropped':             '#f85149',
  'Closed':              '#8b949e',
  'No Update':           '#4d5566',
};

const STATUS_ORDER = [
  'Active',
  'Active – L1 Pending',
  'On Hold',
  'Not Started',
  'Partial Onboard',
  'Dropped',
  'Closed',
  'No Update',
];

// Months that actually have roles
const ACTIVE_MONTHS = ['Dec', 'Mar', 'May'];
const ALL_OPTION    = 'All';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const row = orionPipeline.find(r => r.shortTitle === label);
  if (!row) return null;

  const activeSegs = payload.filter(p => p.value > 0);
  const total      = activeSegs.reduce((s, p) => s + p.value, 0);

  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      minWidth: 220,
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {/* Role title */}
      <div style={{
        color: '#fff', fontWeight: 700,
        fontSize: 13, marginBottom: 8,
        paddingBottom: 8,
        borderBottom: `1px solid ${PALETTE.border}`,
      }}>
        {row.jobTitle}
      </div>

      {/* Status segments */}
      {STATUS_ORDER.map(s => {
        const seg = payload.find(p => p.dataKey === s);
        const val = seg?.value ?? 0;
        const pct = total > 0 ? ((val / total) * 100).toFixed(0) : 0;
        return (
          <div key={s} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 4,
            opacity: val === 0 ? 0.3 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: 2,
                background: STATUS_COLORS[s],
                flexShrink: 0,
              }} />
              <span style={{ color: STATUS_COLORS[s], fontSize: 11 }}>{s}</span>
            </div>
            <span style={{ color: val > 0 ? '#fff' : PALETTE.muted, fontWeight: val > 0 ? 700 : 400 }}>
              {val} ({pct}%)
            </span>
          </div>
        );
      })}

      {/* Total + extra metrics */}
      <div style={{
        marginTop: 8, paddingTop: 8,
        borderTop: `1px solid ${PALETTE.border}`,
        display: 'flex', flexDirection: 'column', gap: 3,
        fontSize: 11,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Total Openings</span>
          <strong style={{ color: '#fff' }}>{total}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Profiles Shared</span>
          <strong style={{ color: PALETTE.green }}>{row.profilesShared}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>In Process</span>
          <strong style={{ color: PALETTE.accent }}>{row.inProcess}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Opened</span>
          <strong style={{ color: '#fff' }}>{row.month}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Experience</span>
          <strong style={{ color: '#fff' }}>{row.experience}</strong>
        </div>
      </div>

      {/* Notes */}
      {row.notes && (
        <div style={{
          marginTop: 8, paddingTop: 8,
          borderTop: `1px solid ${PALETTE.border}`,
          fontSize: 10, color: PALETTE.muted,
          lineHeight: 1.6,
        }}>
          {row.notes}
        </div>
      )}
    </div>
  );
};

export default function RoleStatusBar() {
  const [selectedMonth, setSelectedMonth] = useState(ALL_OPTION);

  // Filter roles by selected month
  const filteredRoles = useMemo(() => {
    const base = selectedMonth === ALL_OPTION
      ? orionPipeline
      : orionPipeline.filter(r => r.month === selectedMonth);

    // Sort by total openings descending so biggest bars are on top
    return base
      .slice()
      .sort((a, b) => b.openings - a.openings);
  }, [selectedMonth]);

  // Build chart data — one row per role
  // Each status gets its own key; only the role's actual status gets the openings value
  const chartData = useMemo(() =>
    filteredRoles.map(r => {
      const entry = { role: r.shortTitle };
      STATUS_ORDER.forEach(s => {
        entry[s] = r.status === s ? r.openings : 0;
      });
      return entry;
    }),
  [filteredRoles]);

  // Dynamic chart height — 40px per bar, min 200
  const chartHeight = Math.max(filteredRoles.length * 42 + 20, 200);

  // Summary counts for the selected month
  const summary = useMemo(() => {
    const totalOpenings = filteredRoles.reduce((s, r) => s + r.openings, 0);
    const totalRoles    = filteredRoles.length;
    const statusCounts  = {};
    STATUS_ORDER.forEach(s => {
      const count = filteredRoles.filter(r => r.status === s).length;
      if (count > 0) statusCounts[s] = count;
    });
    return { totalOpenings, totalRoles, statusCounts };
  }, [filteredRoles]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'JetBrains Mono', monospace",
      gap: 10,
    }}>

      {/* ── Month toggle ──────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        paddingTop: 4,
      }}>
        <span style={{ fontSize: 10, color: PALETTE.muted, marginRight: 2 }}>
          Month:
        </span>
        {[ALL_OPTION, ...ACTIVE_MONTHS].map(m => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${selectedMonth === m
                ? (m === ALL_OPTION ? PALETTE.accent : '#58a6ff')
                : PALETTE.border}`,
              background: selectedMonth === m
                ? (m === ALL_OPTION ? `${PALETTE.accent}22` : 'rgba(88,166,255,0.12)')
                : 'transparent',
              color: selectedMonth === m
                ? (m === ALL_OPTION ? PALETTE.accent : '#58a6ff')
                : PALETTE.muted,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              fontWeight: selectedMonth === m ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {m}
          </button>
        ))}

        {/* Summary chips */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex', gap: 10,
          fontSize: 10, color: PALETTE.muted,
          alignItems: 'center',
        }}>
          <span>
            <strong style={{ color: '#fff' }}>{summary.totalRoles}</strong> roles
          </span>
          <span>
            <strong style={{ color: PALETTE.accent }}>{summary.totalOpenings}</strong> openings
          </span>
        </div>
      </div>

      {/* ── Status legend ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        gap: 8, alignItems: 'center',
      }}>
        {STATUS_ORDER.filter(s =>
          filteredRoles.some(r => r.status === s)
        ).map(s => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center',
            gap: 5, fontSize: 10, color: PALETTE.muted,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: STATUS_COLORS[s],
            }} />
            {s}
            <span style={{ color: STATUS_COLORS[s], fontWeight: 700 }}>
              ({summary.statusCounts[s] ?? 0})
            </span>
          </div>
        ))}
      </div>

      {/* ── Chart — scrollable if many roles ─────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 110, bottom: 4 }}
              barSize={22}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={PALETTE.border}
                horizontal={false}
              />

              <XAxis
                type="number"
                tick={{
                  fill: PALETTE.muted, fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                axisLine={{ stroke: PALETTE.border }}
                tickLine={false}
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="role"
                width={106}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-4} y={0} dy={4}
                      textAnchor="end"
                      fill={PALETTE.muted}
                      fontSize={10}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      <title>
                        {orionPipeline.find(r => r.shortTitle === payload.value)?.jobTitle}
                      </title>
                      {payload.value}
                    </text>
                  </g>
                )}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />

              {/* One Bar per status — stacked horizontally */}
              {STATUS_ORDER.map((s, i) => (
                <Bar
                  key={s}
                  dataKey={s}
                  stackId="openings"
                  fill={STATUS_COLORS[s]}
                  fillOpacity={0.88}
                  radius={
                    i === STATUS_ORDER.length - 1
                      ? [0, 4, 4, 0]
                      : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom hint ───────────────────────────────────────── */}
      <div style={{
        fontSize: 10, color: PALETTE.muted,
        opacity: 0.6, paddingBottom: 2,
      }}>
        Bar length = total openings · colour = status · toggle month above · hover for full breakdown
      </div>
    </div>
  );
}