// components/charts/RevenuePerEmployeeLine.jsx — Chart 17
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenuePerEmployee } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.green }}>Revenue/FTE: <strong>${payload[0].value}M</strong></div>
    </div>
  );
};

export default function RevenuePerEmployeeLine() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={revenuePerEmployee} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis domain={[10, 30]} tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="M" />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="revenue" name="Revenue/FTE" stroke={PALETTE.green} strokeWidth={2.5} dot={{ fill: PALETTE.green, r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
