// components/charts/SalaryTrendBar.jsx — Chart 18: Salary Trend by Domain
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { salaryTrend } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.text }}>Avg Salary: <strong>${payload[0].value}K</strong></div>
    </div>
  );
};

export default function SalaryTrendBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={salaryTrend} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="domain" tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis domain={[60, 130]} tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="K" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="avgSalary" name="Avg Salary ($K)" radius={[4, 4, 0, 0]}>
          <LabelList dataKey="avgSalary" position="top" style={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} formatter={v => `$${v}K`} />
          {salaryTrend.map(d => <Cell key={d.domain} fill={DOMAIN_COLORS[d.domain]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
