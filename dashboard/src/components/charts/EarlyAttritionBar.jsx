// components/charts/EarlyAttritionBar.jsx — Chart 14: Early Attrition by Month
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { earlyAttrition } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const avg = Math.round(earlyAttrition.reduce((s, d) => s + d.count, 0) / earlyAttrition.length);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.red }}>Attrition: <strong>{payload[0].value}</strong></div>
    </div>
  );
};

export default function EarlyAttritionBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={earlyAttrition} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={avg} stroke={PALETTE.orange} strokeDasharray="4 4" label={{ value: `avg ${avg}`, fill: PALETTE.orange, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} />
        <Bar dataKey="count" name="Early Attrition" radius={[3, 3, 0, 0]}>
          {earlyAttrition.map(d => (
            <Cell key={d.month} fill={d.count > avg ? PALETTE.red : PALETTE.orange} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
