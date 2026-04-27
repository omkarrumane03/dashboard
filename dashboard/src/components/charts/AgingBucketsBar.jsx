// components/charts/AgingBucketsBar.jsx — Chart 12a: Aging Buckets
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { agingBuckets } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const COLORS = [PALETTE.green, PALETTE.accent, PALETTE.orange, PALETTE.red];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: PALETTE.muted }}>{label} days</div>
      <div style={{ color: PALETTE.text }}>Count: <strong>{payload[0].value}</strong></div>
    </div>
  );
};

export default function AgingBucketsBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={agingBuckets} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="bucket" tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Open Roles" radius={[4, 4, 0, 0]}>
          {agingBuckets.map((d, i) => <Cell key={d.bucket} fill={COLORS[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
