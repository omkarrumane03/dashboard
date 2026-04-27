// components/charts/ExperienceDemandBar.jsx — Chart 12b: Demand by Experience Level
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { experienceDemand } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const COLORS = [PALETTE.accent, PALETTE.green, PALETTE.purple, PALETTE.orange];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.text }}>Jobs: <strong>{payload[0].value}</strong></div>
    </div>
  );
};

export default function ExperienceDemandBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={experienceDemand} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="level" tick={{ fill: PALETTE.muted, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} angle={-10} textAnchor="end" />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Job Count" radius={[4, 4, 0, 0]}>
          {experienceDemand.map((d, i) => <Cell key={d.level} fill={COLORS[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
