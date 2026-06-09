// components/charts/HiresClosureCombo.jsx
import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { orionPeriodData, orionRolesPerPeriod } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const comboData = orionPeriodData.map(d => {
  const totalRejects = d.l1Reject + d.l2Reject + d.zekoReject;
  const rejectRate = d.profilesShared > 0
    ? parseFloat(((totalRejects / d.profilesShared) * 100).toFixed(1))
    : 0;

  // Match the roles data for the exact period block
  const roleRow = orionRolesPerPeriod.find(r => r.period === d.period) || {};
  const hireCount = roleRow.rolesClosedHired || 0;
  const rolesOpened = roleRow.rolesOpened || 0;
  
  // Calculate Hire Rate based on total roles opened in that period
  const hireRate = rolesOpened > 0
    ? parseFloat(((hireCount / rolesOpened) * 100).toFixed(1))
    : 0;

  return {
    period: d.period,
    profilesShared: d.profilesShared,
    rejectionCount: d.rejectionCount,
    rejectRate,
    // hireCount,
    // hireRate,
  };
});

// Helper function to handle string truncation
const truncateLabel = (label, maxLength = 6) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

// Custom X-Axis Component with native tooltip integration
const CustomXAxisTick = ({ x, y, payload }) => {
  const fullLabel = payload.value || '';
  const truncated = truncateLabel(fullLabel, 6);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={16}
        textAnchor="middle"
        fill={PALETTE.muted}
        fontSize={12}
        fontFamily="'JetBrains Mono', monospace"
        style={{ cursor: 'pointer' }}
      >
        <title>{fullLabel}</title>
        {truncated}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const ps = payload.find(p => p.dataKey === 'profilesShared');
  const rc = payload.find(p => p.dataKey === 'rejectionCount');
  const rr = payload.find(p => p.dataKey === 'rejectRate');
  // const hc = payload.find(p => p.dataKey === 'hireCount');
  // const hr = payload.find(p => p.dataKey === 'hireRate');

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {ps && <div style={{ color: PALETTE.green }}>Profiles Shared: <strong>{ps.value}</strong></div>}
      {/* {hc && <div style={{ color: '#38bdf8' }}>Hire Count: <strong>{hc.value}</strong></div>} */}
      {/* {hr && <div style={{ color: '#fbbf24' }}>Hire Rate: <strong>{hr.value}%</strong></div>} */}
      {rc && <div style={{ color: '#ff6b6b' }}>Rejection Count: <strong>{rc.value}</strong></div>}
      {rr && <div style={{ color: PALETTE.accent }}>Rejection Rate: <strong>{rr.value}%</strong></div>}
      
    </div>
  );
};

const CustomLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, paddingBottom: 4, flexWrap: 'wrap' }}>
    <span style={{ color: PALETTE.green }}>▬ Profiles Shared (left)</span>
    {/* <span style={{ color: '#38bdf8' }}>▬ Hire Count (left)</span> */}
    {/* <span style={{ color: '#fbbf24' }}>▬ Hire Rate % (right)</span> */}
    <span style={{ color: '#ff6b6b' }}>▬ Rejection Count (left)</span>
    <span style={{ color: PALETTE.accent }}>▬ Rejection Rate % (right)</span>
  </div>
);

export default function HiresClosureCombo() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <CustomLegend />
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={comboData} margin={{ top: 10, right: 44, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradProfiles" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PALETTE.green} stopOpacity={0.3} />
                <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            
            <XAxis 
              dataKey="period" 
              tick={<CustomXAxisTick />}
              axisLine={{ stroke: PALETTE.border }} 
              tickLine={false} 
            />
            
            {/* Left Axis for volume/counts */}
            <YAxis yAxisId="profiles" orientation="left" tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            
            {/* Right Axis for percentage scales */}
            <YAxis yAxisId="rate" orientation="right" tickFormatter={v => `${v}%`} domain={[0, 100]} tick={{ fill: PALETTE.accent, fontSize: 11 }} axisLine={false} tickLine={false} />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Counts & Volumes (Left Y-Axis) */}
            <Area yAxisId="profiles" type="monotone" dataKey="profilesShared" stroke={PALETTE.green} strokeWidth={2.5} fill="url(#gradProfiles)" dot={{ fill: PALETTE.green, r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="profiles" type="monotone" dataKey="rejectionCount" stroke="#ff6b6b" strokeWidth={2.5} dot={{ fill: '#ff6b6b', r: 4 }} activeDot={{ r: 6 }} />
            {/* <Line yAxisId="profiles" type="monotone" dataKey="hireCount" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: '#38bdf8', r: 4 }} activeDot={{ r: 6 }} /> */}
            
            {/* Percentage Rates (Right Y-Axis) */}
            <Line yAxisId="rate" type="monotone" dataKey="rejectRate" stroke={PALETTE.accent} strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: PALETTE.accent, r: 4 }} activeDot={{ r: 6 }} />
            {/* <Line yAxisId="rate" type="monotone" dataKey="hireRate" stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="4 4" dot={{ fill: '#fbbf24', r: 4 }} activeDot={{ r: 6 }} /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}