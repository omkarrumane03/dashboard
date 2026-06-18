// components/charts/ProfilesSharedvsRejectionRates.jsx
import { useMemo } from 'react';
import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { orionRolesPerPeriod } from '../../data/notebookData';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const CustomXAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={16} textAnchor="middle"
      fill={PALETTE.muted} fontSize={14}
      fontFamily="'Inter', sans-serif">
      {payload.value}
    </text>
  </g>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const ps = payload.find(p => p.dataKey === 'profilesShared');
  const rc = payload.find(p => p.dataKey === 'rejectionCount');
  const rr = payload.find(p => p.dataKey === 'rejectRate');
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 14 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {ps && <div style={{ color: PALETTE.green }}>Profiles Shared: <strong>{ps.value}</strong></div>}
      {rc && <div style={{ color: '#ff6b6b' }}>Rejection Count: <strong>{rc.value}</strong></div>}
      {rr && <div style={{ color: PALETTE.accent }}>Rejection Rate: <strong>{rr.value}%</strong></div>}
    </div>
  );
};

const CustomLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontFamily: "Inter, sans-serif", fontSize: 14, paddingBottom: 4, flexWrap: 'wrap' }}>
    <span style={{ color: PALETTE.green }}>▬ Profiles Shared (left)</span>
    <span style={{ color: '#ff6b6b' }}>▬ Rejection Count (left)</span>
    <span style={{ color: PALETTE.accent }}>▬ Rejection Rate % (right)</span>
  </div>
);

export default function ProfilesSharedvsRejectionRates() {
  const { filteredPipeline } = useDateRange();

  // Derive unique months from filteredPipeline in order
  const activeMonths = useMemo(() => {
    const seen = new Set();
    const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const comboData = useMemo(() =>
    activeMonths.map(month => {
      const rows           = filteredPipeline.filter(r => r.month === month);
      const profilesShared = rows.reduce((s, r) => s + (r.profilesShared || 0), 0);
      const l1Reject       = rows.reduce((s, r) => s + (r.l1Reject       || 0), 0);
      const l2Reject       = rows.reduce((s, r) => s + (r.l2Reject       || 0), 0);
      const zekoReject     = rows.reduce((s, r) => s + (r.zekoReject     || 0), 0);
      const rejectionCount = l1Reject + l2Reject + zekoReject;
      const rejectRate     = profilesShared > 0
        ? parseFloat(((rejectionCount / profilesShared) * 100).toFixed(1))
        : 0;

      return { period: month, profilesShared, rejectionCount, rejectRate };
    }),
  [filteredPipeline, activeMonths]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <CustomLegend />
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={comboData} margin={{ top: 10, right: 44, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradProfiles" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PALETTE.green} stopOpacity={0.3} />
                <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis dataKey="period" tick={<CustomXAxisTick />}
              axisLine={{ stroke: PALETTE.border }} tickLine={false} />
            <YAxis yAxisId="profiles" orientation="left"
              tick={{ fill: PALETTE.muted, fontSize: 14 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rate" orientation="right"
              tickFormatter={v => `${v}%`} domain={[0, 100]}
              tick={{ fill: PALETTE.accent, fontSize: 14 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="profiles" type="monotone" dataKey="profilesShared"
              stroke={PALETTE.green} strokeWidth={2.5} fill="url(#gradProfiles)"
              dot={{ fill: PALETTE.green, r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="profiles" type="monotone" dataKey="rejectionCount"
              stroke="#ff6b6b" strokeWidth={2.5}
              dot={{ fill: '#ff6b6b', r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="rate" type="monotone" dataKey="rejectRate"
              stroke={PALETTE.accent} strokeWidth={2.5} strokeDasharray="6 3"
              dot={{ fill: PALETTE.accent, r: 4 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}