// components/charts/DomainDemandProbBar.jsx — Chart 21a: Forecasted Domain Demand Probability
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { SkillsDemandProb } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.accent }}>Probability: <strong>{(payload[0].value * 100).toFixed(0)}%</strong></div>
    </div>
  );
};

export default function SkillsDemandProbBar() {
  const data = [...SkillsDemandProb].sort((a, b) => b.probability - a.probability);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
        <XAxis type="number" skill={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis type="category" dataKey="skill" width={90}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="probability" name="Demand Probability" radius={[0, 4, 4, 0]}>
          <LabelList dataKey="probability" position="right"
            formatter={v => `${(v * 100).toFixed(0)}%`}
            style={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} />
          {data.map(d => <Cell key={d.skill} fill={SKILL_COLORS[d.skill]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
