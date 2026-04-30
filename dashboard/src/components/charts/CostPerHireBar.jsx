// components/charts/CostPerHireBar.jsx — Chart 16: Cost Per Hire by Months
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { costPerHire } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.text }}>Cost: <strong>${payload[0].value.toLocaleString()}</strong></div>
    </div>
  );
};

export function CostPerHireBar() {
  const avg = Math.round(costPerHire.reduce((s, d) => s + d.cost, 0) / costPerHire.length);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={costPerHire} margin={{ top: 5, right: 10, left: 0, bottom: 6 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} domain={[3800, 5000]} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="cost" name="Cost/Hire" radius={[4, 4, 0, 0]}>
          {costPerHire.map((d, i) => <Cell key={d.month} fill={d.cost > avg ? PALETTE.red : PALETTE.green} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
