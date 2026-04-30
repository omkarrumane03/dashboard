// components/charts/DomainOpenClosedBar.jsx — Chart 5: Open vs Closed by Domain
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { domainSummary } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill || p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function DomainOpenClosedBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={domainSummary} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="domain" tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: PALETTE.muted }} />
        <Bar dataKey="open" name="Open" radius={[3, 3, 0, 0]}>
          {domainSummary.map(d => <Cell key={d.domain} fill={DOMAIN_COLORS[d.domain]} />)}
        </Bar>
        <Bar dataKey="closed" name="Closed" radius={[3, 3, 0, 0]} opacity={0.5}>
          {domainSummary.map(d => <Cell key={d.domain} fill={DOMAIN_COLORS[d.domain]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
