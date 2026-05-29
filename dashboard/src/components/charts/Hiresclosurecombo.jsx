// components/charts/HiresClosureCombo.jsx
// Merged H1 (Hires Over Time) + H4 (Closure Rate)
// Left Y: absolute hires (area), Right Y: closure rate % (line)

import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { candidateFunnelMonthly, netOpenData } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

// Build combined dataset: hires + closure rate per month
const comboData = netOpenData.map(d => {
  const joined = candidateFunnelMonthly.find(
    r => r.month === d.month && r.stage === 'Joined'
  );
  return {
    month: d.month,
    hires: joined?.count ?? 0,
    closureRate: parseFloat(((d.netClosed / d.netOpen) * 100).toFixed(1)),
    netOpen: d.netOpen,
    netClosed: d.netClosed,
  };
});

const avgHires = Math.round(
  comboData.reduce((s, d) => s + d.hires, 0) / comboData.length
);
const avgClosure = parseFloat(
  (comboData.reduce((s, d) => s + d.closureRate, 0) / comboData.length).toFixed(1)
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const hires       = payload.find(p => p.dataKey === 'hires');
  const closureRate = payload.find(p => p.dataKey === 'closureRate');
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
      {hires && (
        <div style={{ color: PALETTE.green }}>
          Hires: <strong>{hires.value}</strong>
        </div>
      )}
      {closureRate && (
        <div style={{ color: PALETTE.accent, marginTop: 2 }}>
          Closure Rate: <strong>{closureRate.value}%</strong>
        </div>
      )}
    </div>
  );
};

const CustomLegend = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', gap: 20,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    paddingBottom: 4,
  }}>
    <span style={{ color: PALETTE.green }}>▬ Hires (left axis)</span>
    <span style={{ color: PALETTE.accent }}>▬ Closure Rate % (right axis)</span>
    <span style={{ color: PALETTE.orange }}>╌ Averages</span>
  </div>
);

export default function HiresClosureCombo() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <CustomLegend />
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={comboData} margin={{ top: 10, right: 40, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradHiresClosure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PALETTE.green} stopOpacity={0.3} />
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

            {/* Left Y — hires */}
            <YAxis
              yAxisId="hires"
              orientation="left"
              tick={{ fill: PALETTE.green, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Right Y — closure rate % */}
            <YAxis
              yAxisId="rate"
              orientation="right"
              tickFormatter={v => `${v}%`}
              domain={[55, 75]}
              tick={{ fill: PALETTE.accent, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Avg hires reference */}
            <ReferenceLine
              yAxisId="hires"
              y={avgHires}
              stroke={PALETTE.orange}
              strokeDasharray="4 4"
              label={{
                value: `Avg ${avgHires}`,
                fill: PALETTE.orange, fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                position: 'insideTopLeft',
              }}
            />

            {/* Avg closure rate reference */}
            <ReferenceLine
              yAxisId="rate"
              y={avgClosure}
              stroke={PALETTE.orange}
              strokeDasharray="4 4"
              label={{
                value: `Avg ${avgClosure}%`,
                fill: PALETTE.orange, fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                position: 'insideTopRight',
              }}
            />

            {/* Area — hires */}
            <Area
              yAxisId="hires"
              type="monotone"
              dataKey="hires"
              stroke={PALETTE.green}
              strokeWidth={2.5}
              fill="url(#gradHiresClosure)"
              dot={{ fill: PALETTE.green, r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* Line — closure rate */}
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="closureRate"
              stroke={PALETTE.accent}
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={{ fill: PALETTE.accent, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}