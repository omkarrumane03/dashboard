// components/charts/RejectionInsights.jsx
// Replaces: ProfilesSharedvsRejectionRates.jsx + RejectionBreakdown.jsx
import { useState, useMemo } from 'react';
import {
  ComposedChart, BarChart, Bar, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

// ── Shared helpers ────────────────────────────────────────────────────────────

const truncateLabel = (label, maxLength = 11) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

const CustomXAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={10} textAnchor="end"
      fill={PALETTE.muted} fontSize={13}
      fontFamily="'Inter', sans-serif"
      transform="rotate(-30)" style={{ cursor: 'pointer' }}>
      <title>{payload.value}</title>
      {truncateLabel(payload.value, 11)}
    </text>
  </g>
);

// ── By Role view ──────────────────────────────────────────────────────────────

const RoleTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "Inter, sans-serif", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill ?? p.color, marginBottom: 2 }}>
          {p.name ?? p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
      {(() => {
        const shared = payload.find(p => p.dataKey === 'Profiles Shared')?.value ?? 0;
        const l1     = payload.find(p => p.dataKey === 'L1 Reject')?.value ?? 0;
        const l2     = payload.find(p => p.dataKey === 'L2 Reject')?.value ?? 0;
        const total  = l1 + l2;
        const rate   = shared > 0 ? ((total / shared) * 100).toFixed(0) : 0;
        return shared > 0 ? (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${PALETTE.border}`, color: PALETTE.muted, fontSize: 13 }}>
            Rejection Rate: <strong style={{ color: PALETTE.accent }}>{rate}%</strong>
          </div>
        ) : null;
      })()}
    </div>
  );
};

const RoleView = ({ filteredPipeline }) => {
  const data = useMemo(() =>
    filteredPipeline
      .filter(r => r.profilesShared > 0)
      .map(r => ({
        role:             r.shortTitle,
        'Profiles Shared': r.profilesShared,
        'L1 Reject':       r.l1Reject,
        'L2 Reject':       r.l2Reject,
      })),
  [filteredPipeline]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={2} barCategoryGap="15%"
        margin={{ top: 6, right: 10, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
        <XAxis dataKey="role" tick={<CustomXAxisTick />}
          axisLine={{ stroke: PALETTE.border }} tickLine={false} interval={0} height={50} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13 }} axisLine={false} tickLine={false} />
        <Tooltip content={<RoleTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend verticalAlign="top" height={28}
          formatter={k => <span style={{ fontSize: 13, fontFamily: "Inter, sans-serif" }}>{k}</span>} />
        <Bar dataKey="Profiles Shared" fill={PALETTE.accent}           fillOpacity={0.9}  radius={[3,3,0,0]} />
        <Bar dataKey="L1 Reject"       fill={PALETTE.orange}           fillOpacity={0.85} radius={[3,3,0,0]} />
        <Bar dataKey="L2 Reject"       fill={PALETTE.red ?? '#F85149'} fillOpacity={0.8}  radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── By Period Trend view ──────────────────────────────────────────────────────

const PeriodTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const ps = payload.find(p => p.dataKey === 'profilesShared');
  const rc = payload.find(p => p.dataKey === 'rejectionCount');
  const rr = payload.find(p => p.dataKey === 'rejectRate');
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {ps && <div style={{ color: PALETTE.green  }}>Profiles Shared:  <strong>{ps.value}</strong></div>}
      {rc && <div style={{ color: '#ff6b6b'      }}>Rejection Count:  <strong>{rc.value}</strong></div>}
      {rr && <div style={{ color: PALETTE.accent }}>Rejection Rate:   <strong>{rr.value}%</strong></div>}
    </div>
  );
};

const PeriodLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontFamily: "Inter, sans-serif", fontSize: 13, paddingBottom: 4, flexWrap: 'wrap' }}>
    <span style={{ color: PALETTE.green  }}>▬ Profiles Shared (left)</span>
    <span style={{ color: '#ff6b6b'      }}>▬ Rejection Count (left)</span>
    <span style={{ color: PALETTE.accent }}>▬ Rejection Rate % (right)</span>
  </div>
);

const PeriodView = ({ filteredPipeline }) => {
  const activeMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const data = useMemo(() =>
    activeMonths.map(month => {
      const rows           = filteredPipeline.filter(r => r.month === month);
      const profilesShared = rows.reduce((s, r) => s + (r.profilesShared || 0), 0);
      const l1Reject       = rows.reduce((s, r) => s + (r.l1Reject       || 0), 0);
      const l2Reject       = rows.reduce((s, r) => s + (r.l2Reject       || 0), 0);
      const rejectionCount = l1Reject + l2Reject;
      const rejectRate     = profilesShared > 0
        ? parseFloat(((rejectionCount / profilesShared) * 100).toFixed(1))
        : 0;
      return { period: month, profilesShared, rejectionCount, rejectRate };
    }),
  [filteredPipeline, activeMonths]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <PeriodLegend />
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 44, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradProfiles" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PALETTE.green} stopOpacity={0.3} />
                <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis dataKey="period"
              tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: PALETTE.border }} tickLine={false}
            />
            <YAxis yAxisId="profiles" orientation="left"
              tick={{ fill: PALETTE.muted, fontSize: 13 }} axisLine={false} tickLine={false}
            />
            <YAxis yAxisId="rate" orientation="right"
              tickFormatter={v => `${v}%`} domain={[0, 100]}
              tick={{ fill: PALETTE.accent, fontSize: 13 }} axisLine={false} tickLine={false}
            />
            <Tooltip content={<PeriodTooltip />} />
            <Area yAxisId="profiles" type="monotone" dataKey="profilesShared"
              stroke={PALETTE.green} strokeWidth={2.5} fill="url(#gradProfiles)"
              dot={{ fill: PALETTE.green, r: 4 }} activeDot={{ r: 6 }}
            />
            <Line yAxisId="profiles" type="monotone" dataKey="rejectionCount"
              stroke="#ff6b6b" strokeWidth={2.5}
              dot={{ fill: '#ff6b6b', r: 4 }} activeDot={{ r: 6 }}
            />
            <Line yAxisId="rate" type="monotone" dataKey="rejectRate"
              stroke={PALETTE.accent} strokeWidth={2.5} strokeDasharray="6 3"
              dot={{ fill: PALETTE.accent, r: 4 }} activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────

export default function RejectionInsights() {
  const { filteredPipeline } = useDateRange();
  const [view, setView] = useState('role');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4, paddingTop: 8 }}>
        {[{ key: 'role', label: 'By Role' }, { key: 'period', label: 'By Period (Trend)' }].map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)} style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 13,
            fontFamily: "Inter, sans-serif",
            border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
            background: view === key ? PALETTE.accentSoft : 'transparent',
            color: view === key ? PALETTE.accent : PALETTE.muted,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {view === 'role'
          ? <RoleView   filteredPipeline={filteredPipeline} />
          : <PeriodView filteredPipeline={filteredPipeline} />
        }
      </div>
    </div>
  );
}