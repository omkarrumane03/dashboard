// components/charts/HiresOverTimeLine.jsx — Hiring Trend Chart 1
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { candidateFunnelMonthly } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

// Derive hires per month from funnel Joined stage
const hiresData = (() => {
  const months = [...new Set(candidateFunnelMonthly.map(d => d.month))];
  return months.map(month => {
    const joined = candidateFunnelMonthly.find(d => d.month === month && d.stage === 'Joined');
    const prev = months[months.indexOf(month) - 1];
    const prevJoined = prev
      ? candidateFunnelMonthly.find(d => d.month === prev && d.stage === 'Joined')?.count
      : null;
    const count = joined?.count ?? 0;
    const growth = prevJoined ? (((count - prevJoined) / prevJoined) * 100).toFixed(1) : null;
    return { month, hires: count, growth };
  });
})();

const avgHires = Math.round(hiresData.reduce((s, d) => s + d.hires, 0) / hiresData.length);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = hiresData.find(x => x.month === label);
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
      <div style={{ color: PALETTE.green }}>
        Hires: <strong>{payload[0]?.value}</strong>
      </div>
      {d?.growth !== null && (
        <div style={{
          color: parseFloat(d.growth) >= 0 ? PALETTE.green : PALETTE.orange,
          marginTop: 4,
          fontSize: 12,
        }}>
          MoM: <strong>{d.growth > 0 ? '+' : ''}{d.growth}%</strong>
        </div>
      )}
    </div>
  );
};

export default function HiresOverTimeLine() {
  const allVals = hiresData.map(d => d.hires);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const pad = (maxVal - minVal) * 0.15;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={hiresData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="gradHires" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={PALETTE.green} stopOpacity={0.35} />
            <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
          axisLine={{ stroke: PALETTE.border }}
          tickLine={false}
        />
        <YAxis
          domain={[Math.max(0, minVal - pad), maxVal + pad]}
          tick={{ fill: PALETTE.muted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={avgHires}
          stroke={PALETTE.orange}
          strokeDasharray="4 4"
          label={{ value: `Avg ${avgHires}`, fill: PALETTE.orange, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", position: 'right' }}
        />
        <Area
          type="monotone"
          dataKey="hires"
          name="Hires"
          stroke={PALETTE.green}
          strokeWidth={2.5}
          fill="url(#gradHires)"
          dot={{ fill: PALETTE.green, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}