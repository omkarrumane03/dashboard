// components/charts/NetOpenLine.jsx
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getOrionRolesPerPeriod } from '../../data/notebookData';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const SERIES = [
  { key: 'Roles Opened',     color: PALETTE.accent,           grad: 'gradOpened'       },
  { key: 'Closed (Hired)',   color: PALETTE.green,            grad: 'gradClosedHired'  },
  { key: 'Closed (No Hire)', color: PALETTE.red ?? '#F85149', grad: 'gradClosedNoHire' },
  { key: 'On Hold',          color: PALETTE.orange,           grad: 'gradOnHold'       },
  { key: 'In Process',       color: PALETTE.purple,           grad: 'gradInProcess'    },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const get         = key => payload.find(p => p.dataKey === key)?.value ?? null;
  const hired       = get('Closed (Hired)');
  const noHire      = get('Closed (No Hire)');
  const totalClosed = (hired ?? 0) + (noHire ?? 0);
  const hireRate    = totalClosed ? ((hired / totalClosed) * 100).toFixed(0) : null;

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 14, minWidth: 200 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 8 }}>{label}</div>
      {SERIES.map(({ key, color }) => {
        const val = get(key);
        if (val === null || val === 0) return null;
        return (
          <div key={key} style={{ color, display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
            <span>{key}</span><strong>{val}</strong>
          </div>
        );
      })}
      {hireRate !== null && (
        <div style={{ borderTop: `1px solid ${PALETTE.border}`, marginTop: 8, paddingTop: 6, fontSize: 13, color: PALETTE.muted }}>
          Hire Success (of closed): <strong style={{ color: PALETTE.green }}>{hireRate}%</strong>
        </div>
      )}
    </div>
  );
};

export default function NetOpenLine() {
  const { filteredPipeline } = useDateRange();

  // Auto-derive from filteredPipeline; drop months with zero activity
  const rolesPerPeriod = getOrionRolesPerPeriod(filteredPipeline);
  const chartData = rolesPerPeriod
    .filter(d => d.rolesOpened > 0)
    .map(d => ({
      period:             d.period,
      'Roles Opened':     d.rolesOpened,
      'Closed (Hired)':   d.rolesClosedHired,
      'Closed (No Hire)': d.rolesClosedNoHire,
      'On Hold':          d.rolesOnHold,
      'In Process':       d.rolesInProcess,
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <defs>
          {SERIES.map(({ color, grad }) => (
            <linearGradient key={grad} id={grad} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.32} />
              <stop offset="95%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis
          dataKey="period"
          tick={{ fill: PALETTE.muted, fontSize: 14, fontFamily: "Inter, sans-serif" }}
          axisLine={{ stroke: PALETTE.border }} tickLine={false}
        />
        <YAxis
          tick={{ fill: PALETTE.muted, fontSize: 14, fontFamily: "Inter, sans-serif" }}
          axisLine={false} tickLine={false} allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top" height={28}
          formatter={k => <span style={{ fontSize: 14, fontFamily: "Inter, sans-serif" }}>{k}</span>}
        />
        {SERIES.map(({ key, color, grad }) => (
          <Area
            key={key} type="monotone" dataKey={key}
            stroke={color} strokeWidth={2.5} fill={`url(#${grad})`}
            dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}