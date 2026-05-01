// components/charts/ExperienceDemandBar.jsx — Chart 12b: Demand by Experience Level (Interactive)
// Click bars or legend items to filter/highlight specific experience levels
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { experienceDemand } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const COLORS = [PALETTE.accent, PALETTE.green, PALETTE.purple, PALETTE.orange];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.text }}>Jobs: <strong>{payload[0].value}</strong></div>
    </div>
  );
};

export default function ExperienceDemandBar() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const filteredData = useMemo(() => {
    if (!selectedLevel) return experienceDemand;
    return experienceDemand.filter((item) => item.level === selectedLevel);
  }, [selectedLevel]);

  const handleSelection = (level) => {
    setSelectedLevel((prev) => (prev === level ? null : level));
  };

  const CustomLegend = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        {experienceDemand.map((entry, idx) => {
          const isActive = selectedLevel === entry.level;
          const isDimmed = selectedLevel && !isActive;

          return (
            <button
              key={entry.level}
              onClick={() => handleSelection(entry.level)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isActive ? PALETTE.border : 'transparent',
                border: `1px solid ${isActive ? COLORS[idx] : PALETTE.border}`,
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
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[idx], display: 'inline-block' }} />
              {entry.level}
            </button>
          );
        })}
        {selectedLevel && (
          <button
            onClick={() => setSelectedLevel(null)}
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
      <BarChart data={filteredData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="level" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} angle={-10} textAnchor="end" />
        <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Job Count" radius={[4, 4, 0, 0]} onClick={(data) => handleSelection(data.level)}>
          {filteredData.map((d, i) => (
            <Cell 
              key={d.level} 
              fill={COLORS[experienceDemand.findIndex(ed => ed.level === d.level)]}
              style={{ cursor: 'pointer' }}
              stroke={selectedLevel === d.level ? '#ffffff' : 'none'}
              strokeWidth={selectedLevel === d.level ? 2 : 0}
            />
          ))}
        </Bar>
        <Legend content={<CustomLegend />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
