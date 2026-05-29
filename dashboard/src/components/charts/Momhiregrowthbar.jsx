// components/charts/MoMHireGrowthBar.jsx — Hiring Trend Chart 4
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { candidateFunnelMonthly } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const growthData = (() => {
  const months = [...new Set(candidateFunnelMonthly.map(d => d.month))];
  const hires = months.map(month => ({
    month,
    count: candidateFunnelMonthly.find(d => d.month === month && d.stage === 'Joined')?.count ?? 0,
  }));
  return hires.slice(1).map((curr, i) => {
    const prev = hires[i];
    const growth = parseFloat((((curr.count - prev.count) / prev.count) * 100).toFixed(1));
    return { month: curr.month, growth, hires: curr.count, prevHires: prev.count };
  });
})();

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = growthData.find(x => x.month === label);
  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ color: payload[0].value >= 0 ? PALETTE.green : PALETTE.orange }}>
        MoM Growth: <strong>{payload[0].value > 0 ? '+' : ''}{payload[0].value}%</strong>
      </div>
      {d && (
        <div style={{ color: PALETTE.muted, fontSize: 12, marginTop: 4 }}>
          {d.prevHires} → <strong style={{ color: PALETTE.text }}>{d.hires}</strong> hires
        </div>
      )}
    </div>
  );
};

export default function MoMHireGrowthBar() {
  const allG = growthData.map(d => d.growth);
  const minG = Math.min(...allG);
  const maxG = Math.max(...allG);
  const pad = (maxG - minG) * 0.15;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={growthData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
          axisLine={{ stroke: PALETTE.border }}
          tickLine={false}
        />
        <YAxis
          domain={[minG - pad, maxG + pad]}
          tickFormatter={v => `${v}%`}
          tick={{ fill: PALETTE.muted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <ReferenceLine y={0} stroke={PALETTE.border} strokeWidth={1.5} />
        <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
          {growthData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.growth >= 0 ? PALETTE.green : PALETTE.orange}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}