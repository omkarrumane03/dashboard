import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { predictedTTF, domains } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

export default function PredictedTTFLine() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  const allData = [...predictedTTF.historical, ...predictedTTF.forecast];
  const splitMonth = 'Jan_F';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const isForecast = label.includes('_F');
    return (
      <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, minWidth: 160 }}>
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={allData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} onClick={() => selectedDomain && setSelectedDomain(null)}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} tickFormatter={(v) => v.replace('_F', '★')} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="d" />
        <Tooltip content={<CustomTooltip />} />
        <Legend onClick={(e) => setSelectedDomain(prev => prev === e.dataKey ? null : e.dataKey)} wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: PALETTE.muted, cursor: 'pointer' }} />
        <ReferenceLine x={splitMonth} stroke={PALETTE.purple} strokeDasharray="6 3" opacity={0.5} />
        {domains.map(d => (
          <Line
            key={d}
            type="monotone"
            dataKey={d}
            stroke={DOMAIN_COLORS[d]}
            strokeWidth={selectedDomain === d ? 3 : 2}
            hide={selectedDomain && selectedDomain !== d}
            onClick={() => setSelectedDomain(prev => prev === d ? null : d)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}