import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { timeToFillData, skills } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

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
  const [selectedSkills, setSelectedSkills] = useState(new Set());

  const toggle = (skill) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  };

  const CustomLegend = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 8 }}>
      {skills.map(s => {
        const isActive = selectedSkills.has(s);
        const isDimmed = selectedSkills.size > 0 && !isActive;
        return (
          <button key={s} onClick={() => toggle(s)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: isActive ? PALETTE.border : 'transparent',
              border: `1px solid ${isActive ? SKILL_COLORS[s] : PALETTE.border}`,
              borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
              opacity: isDimmed ? 0.4 : 1, transition: 'all 0.2s ease',
              color: isActive ? '#fff' : PALETTE.muted,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            }}>
            <span style={{ width: 18, height: 3, borderRadius: 2, background: SKILL_COLORS[s], display: 'inline-block' }} />
            {s}
          </button>
        );
      })}
      {selectedSkills.size > 0 && (
        <button onClick={() => setSelectedSkills(new Set())}
          style={{
            background: '#111827', border: `1px solid ${PALETTE.border}`,
            borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
            color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          }}>
          Show All
        </button>
      )}
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeToFillData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
            <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
            <YAxis tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="d" />
            <Tooltip content={<CustomTooltip />} />
            {skills.map(s => {
              const isActive = selectedSkills.size === 0 || selectedSkills.has(s);
              return (
                <Line
                  key={s}
                  type="monotone"
                  dataKey={s}
                  stroke={SKILL_COLORS[s]}
                  strokeWidth={selectedSkills.has(s) ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeOpacity={isActive ? 1 : 0.12}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
    </div>
  );
}