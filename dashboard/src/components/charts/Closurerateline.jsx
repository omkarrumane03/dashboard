// components/charts/ClosureRateLine.jsx — Hiring Trend Chart 3
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { netOpenData } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const closureData = netOpenData.map(d => ({
  month: d.month,
  rate: parseFloat(((d.netClosed / d.netOpen) * 100).toFixed(1)),
  open: d.netOpen,
  closed: d.netClosed,
}));

const avgRate = parseFloat((closureData.reduce((s, d) => s + d.rate, 0) / closureData.length).toFixed(1));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = closureData.find(x => x.month === label);
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
      <div style={{ color: PALETTE.accent }}>
        Closure Rate: <strong>{payload[0]?.value}%</strong>
      </div>
      {d && (
        <>
          <div style={{ color: PALETTE.muted, fontSize: 12, marginTop: 4 }}>
            Open: <strong style={{ color: PALETTE.text }}>{d.open}</strong>
          </div>
          <div style={{ color: PALETTE.muted, fontSize: 12 }}>
            Closed: <strong style={{ color: PALETTE.text }}>{d.closed}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default function ClosureRateLine() {
  const allRates = closureData.map(d => d.rate);
  const minR = Math.min(...allRates);
  const maxR = Math.max(...allRates);
  const pad = (maxR - minR) * 0.2;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={closureData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
          axisLine={{ stroke: PALETTE.border }}
          tickLine={false}
        />
        <YAxis
          domain={[Math.max(0, minR - pad), Math.min(100, maxR + pad)]}
          tickFormatter={v => `${v}%`}
          tick={{ fill: PALETTE.muted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={avgRate}
          stroke={PALETTE.orange}
          strokeDasharray="4 4"
          label={{ value: `Avg ${avgRate}%`, fill: PALETTE.orange, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", position: 'right' }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          name="Closure Rate"
          stroke={PALETTE.accent}
          strokeWidth={2.5}
          dot={{ fill: PALETTE.accent, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}