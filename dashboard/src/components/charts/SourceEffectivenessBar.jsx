// components/charts/SourceEffectivenessBar.jsx — Chart 13: Source Effectiveness
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { sourceEffectiveness } from '../../data/notebookData';
import { SOURCE_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.text }}>Successful Hires: <strong>{payload[0].value}</strong></div>
    </div>
  );
};

export default function SourceEffectivenessBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sourceEffectiveness} margin={{ top: 20, right: 10, left: -10, bottom: 5 }} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
        <XAxis type="number" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis type="category" dataKey="source" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={80} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="hires" name="Hires" radius={[0, 4, 4, 0]}>
          <LabelList dataKey="hires" position="right" style={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} />
          {sourceEffectiveness.map(d => <Cell key={d.source} fill={SOURCE_COLORS[d.source]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
