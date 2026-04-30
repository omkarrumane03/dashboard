// components/charts/PredictedTTFLine.jsx — Chart 21b: Predicted Time-to-Fill (Historical + Forecast)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { predictedTTF, domains } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

export default function PredictedTTFLine() {
  const allData = [
    ...predictedTTF.historical,
    ...predictedTTF.forecast,
  ];

  // Mark where forecast starts
  const splitMonth = 'Jan_F';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const isForecast = label.includes('_F');
    return (
      <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minWidth: 160 }}>
        <div style={{ color: isForecast ? PALETTE.purple : PALETTE.muted, marginBottom: 4 }}>
          {label.replace('_F', ' (Forecast)')}
        </div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ color: p.stroke, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span>{p.name}</span><strong>{p.value}d</strong>
          </div>
        ))}
      </div>
    );
  };

  const tickFormatter = (v) => v.replace('_F', '★');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={allData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} tickFormatter={tickFormatter} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="d" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: PALETTE.muted }} />
        <ReferenceLine x={splitMonth} stroke={PALETTE.purple} strokeDasharray="6 3" opacity={0.5}
          label={{ value: 'Forecast →', fill: PALETTE.purple, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", position: 'insideTopRight' }} />
        {domains.map(d => (
          <Line key={d} type="monotone" dataKey={d} stroke={DOMAIN_COLORS[d]} strokeWidth={2}
            dot={(props) => {
              const isForecast = props?.payload?.month?.includes('_F');
              return isForecast
                ? <circle key={props.key} cx={props.cx} cy={props.cy} r={3} fill="none" stroke={DOMAIN_COLORS[d]} strokeWidth={1.5} />
                : <circle key={props.key} cx={props.cx} cy={props.cy} r={2.5} fill={DOMAIN_COLORS[d]} />;
            }}
            strokeDasharray={(v) => v?.payload?.month?.includes('_F') ? '5 4' : undefined}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
