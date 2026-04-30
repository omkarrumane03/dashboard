// components/charts/DomainDemandProbBar.jsx — Chart 21a: Forecasted Domain Demand Probability
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { domainDemandProb } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.accent }}>Probability: <strong>{(payload[0].value * 100).toFixed(0)}%</strong></div>
    </div>
  );
};

export default function DomainDemandProbBar() {
  const data = [...domainDemandProb].sort((a, b) => b.probability - a.probability);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
        <XAxis type="number" domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis type="category" dataKey="domain" width={90}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="probability" name="Demand Probability" radius={[0, 4, 4, 0]}>
          <LabelList dataKey="probability" position="right"
            formatter={v => `${(v * 100).toFixed(0)}%`}
            style={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} />
          {data.map(d => <Cell key={d.domain} fill={DOMAIN_COLORS[d.domain]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
