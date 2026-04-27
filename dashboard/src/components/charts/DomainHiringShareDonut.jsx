// components/charts/DomainHiringShareDonut.jsx — Chart 11: Domain-wise Hiring Share
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hiringShare } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: DOMAIN_COLORS[payload[0].name] }}>{payload[0].name}</div>
      <div style={{ color: PALETTE.text }}><strong>{payload[0].value}%</strong></div>
    </div>
  );
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  ) : null;
};

export default function DomainHiringShareDonut() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={hiringShare} dataKey="share" nameKey="domain" cx="50%" cy="50%" innerRadius="45%" outerRadius="72%" labelLine={false} label={renderLabel}>
          {hiringShare.map(d => <Cell key={d.domain} fill={DOMAIN_COLORS[d.domain]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(v) => <span style={{ color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
