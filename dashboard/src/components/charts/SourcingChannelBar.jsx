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
  // Default to May as requested
  const [selectedMonths, setSelectedMonths] = useState(['May']);

  const months = ['Feb', 'Mar', 'Apr', 'May'];
  const sources = Array.from(new Set(sourcingData.map(d => d.source)));

  const filteredData = useMemo(() => {
    // 1. Filter raw data by selected months
    const monthFiltered = sourcingData.filter((item) => selectedMonths.includes(item.month));

    // 2. Aggregate data by source (sum interviews and hires across selected months)
    const aggregated = monthFiltered.reduce((acc, curr) => {
      const existing = acc.find(item => item.source === curr.source);
      if (existing) {
        existing.interviews += curr.interviews;
        existing.hires += curr.hires;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);

    // 3. Apply source filter if one is selected
    if (!selectedSource) return aggregated;
    return aggregated.filter((item) => item.source === selectedSource);
  }, [selectedSource, selectedMonths]);

  const handleSourceSelection = (source) => {
    setSelectedSource((prev) => (prev === source ? null : source));
  };

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        // Prevent removing last month to keep chart from being empty
        return prev.length > 1 ? prev.filter(m => m !== month) : prev;
      }
      return [...prev, month];
    });
  };

  const CustomLegend = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
        {/* Month Multi-Select Toggle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          <span style={{ color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, width: '100%', textAlign: 'center', marginBottom: 4 }}></span>
          {months.map((month) => {
            const isActive = selectedMonths.includes(month);
            return (
              <button
                key={month}
                onClick={() => handleMonthToggle(month)}
                style={{
                  background: isActive ? PALETTE.accent : 'transparent',
                  border: `1px solid ${isActive ? PALETTE.accent : PALETTE.border}`,
                  borderRadius: 6,
                  padding: '2px 10px',
                  cursor: 'pointer',
                  color: isActive ? '#000' : PALETTE.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  transition: 'all 0.2s ease',
                }}
              >
                {month}
              </button>
            );
          })}
        </div>

        {/* Source Filter Toggle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {sources.map((source) => {
            const isActive = selectedSource === source;
            const isDimmed = selectedSource && !isActive;

            return (
              <button
                key={source}
                onClick={() => handleSourceSelection(source)}
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
                {source}
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
              Reset Source
            </button>
          )}
        </div>
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