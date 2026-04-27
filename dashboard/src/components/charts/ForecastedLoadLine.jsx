// components/charts/ForecastedLoadLine.jsx — Chart 19: Forecasted Hiring Load
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { forecastedLoad } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.purple }}>Predicted Load: <strong>{payload[0].value}</strong></div>
    </div>
  );
};

export default function ForecastedLoadLine() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={forecastedLoad} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PALETTE.purple} stopOpacity={0.3} />
            <stop offset="95%" stopColor={PALETTE.purple} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="load" name="Forecast Load" stroke={PALETTE.purple} fill="url(#loadGrad)" strokeWidth={2.5} dot={{ fill: PALETTE.purple, r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
