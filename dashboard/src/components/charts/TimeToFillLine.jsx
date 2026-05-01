import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { timeToFillData, domains } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, minWidth: 160 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>{p.name}</span><strong>{p.value}d</strong>
        </div>
      ))}
    </div>
  );
};

export default function TimeToFillLine() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={timeToFillData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} onClick={() => selectedDomain && setSelectedDomain(null)}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="d" />
        <Tooltip content={<CustomTooltip />} />
        <Legend onClick={(e) => setSelectedDomain(prev => prev === e.dataKey ? null : e.dataKey)} wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: PALETTE.muted, cursor: 'pointer' }} />
        {domains.map(d => {
          const active = !selectedDomain || selectedDomain === d;
          return (
            <Line
              key={d}
              type="monotone"
              dataKey={d}
              stroke={DOMAIN_COLORS[d]}
              strokeWidth={selectedDomain === d ? 3 : 2}
              dot={false}
              activeDot={{ r: 4 }}
              hide={selectedDomain && selectedDomain !== d}
              opacity={active ? 1 : 0.15}
              onClick={() => setSelectedDomain(prev => prev === d ? null : d)}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}