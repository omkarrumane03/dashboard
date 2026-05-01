// components/charts/SourcingChannelBar.jsx — Chart 6: Sourcing Channel Impact (Interactive)
// Bar chart showing Interviews vs Hires per source (sunburst data as grouped bars)
// Click legend items to filter/highlight specific sources
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sourcingData } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const interviews = payload.find(p => p.dataKey === 'interviews');
  const hires = payload.find(p => p.dataKey === 'hires');
  const convRate = interviews && hires ? ((hires.value / interviews.value) * 100).toFixed(1) : null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
      {convRate && <div style={{ color: PALETTE.orange, marginTop: 4 }}>Conversion: {convRate}%</div>}
    </div>
  );
};

export default function SourcingChannelBar() {
  const [selectedSource, setSelectedSource] = useState(null);

  const filteredData = useMemo(() => {
    if (!selectedSource) return sourcingData;
    return sourcingData.filter((item) => item.source === selectedSource);
  }, [selectedSource]);

  const handleSelection = (source) => {
    setSelectedSource((prev) => (prev === source ? null : source));
  };

  const CustomLegend = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        {sourcingData.map((entry) => {
          const isActive = selectedSource === entry.source;
          const isDimmed = selectedSource && !isActive;

          return (
            <button
              key={entry.source}
              onClick={() => handleSelection(entry.source)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isActive ? PALETTE.border : 'transparent',
                border: `1px solid ${isActive ? PALETTE.accent : PALETTE.border}`,
                borderRadius: 8,
                padding: '4px 8px',
                cursor: 'pointer',
                opacity: isDimmed ? 0.45 : 1,
                transition: 'all 0.25s ease',
                color: PALETTE.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: PALETTE.accent, display: 'inline-block' }} />
              {entry.source}
            </button>
          );
        })}
        {selectedSource && (
          <button
            onClick={() => setSelectedSource(null)}
            style={{
              background: '#111827',
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 8,
              padding: '4px 10px',
              cursor: 'pointer',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
            }}
          >
            Show All
          </button>
        )}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={filteredData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="source" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="interviews" name="Interviews" fill={PALETTE.accent} radius={[3, 3, 0, 0]} />
        <Bar dataKey="hires" name="Hires" fill={PALETTE.green} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
