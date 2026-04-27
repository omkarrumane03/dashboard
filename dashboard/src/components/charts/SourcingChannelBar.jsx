// components/charts/SourcingChannelBar.jsx — Chart 6: Sourcing Channel Impact
// Bar chart showing Interviews vs Hires per source (sunburst data as grouped bars)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sourcingData } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const interviews = payload.find(p => p.dataKey === 'interviews');
  const hires = payload.find(p => p.dataKey === 'hires');
  const convRate = interviews && hires ? ((hires.value / interviews.value) * 100).toFixed(1) : null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
      {convRate && <div style={{ color: PALETTE.orange, marginTop: 4 }}>Conversion: {convRate}%</div>}
    </div>
  );
};

export default function SourcingChannelBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sourcingData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="source" tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: PALETTE.muted }} />
        <Bar dataKey="interviews" name="Interviews" fill={PALETTE.accent}   radius={[3, 3, 0, 0]} />
        <Bar dataKey="hires"      name="Hires"      fill={PALETTE.green}    radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
