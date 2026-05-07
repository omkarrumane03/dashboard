import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hiringShare } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d1117', border: `1px solid ${PALETTE.border}`,
      borderRadius: 8, padding: '8px 12px',
      fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
    }}>
      <div style={{ color: SKILL_COLORS[payload[0].name] }}>{payload[0].name}</div>
      <div style={{ color: PALETTE.text }}><strong>{payload[0].value}%</strong></div>
    </div>
  );
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, share }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={13} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      {share}%
    </text>
  );
};

export default function SkillsHiringShareDonut() {
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [selectedMonth, setSelectedMonth] = useState('May');

  const months = useMemo(() => [...new Set(hiringShare.map((d) => d.month))], []);

  const monthData = useMemo(
    () => hiringShare.filter((d) => d.month === selectedMonth),
    [selectedMonth]
  );

  const filteredData = useMemo(() => {
    if (selectedSkills.size === 0) return monthData;
    return monthData.filter((item) => selectedSkills.has(item.skill));
  }, [selectedSkills, monthData]);

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setSelectedSkills(new Set());
  };

  const CustomLegend = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 }}>
      {monthData.map((entry) => {
        const isActive = selectedSkills.has(entry.skill);
        const isDimmed = selectedSkills.size > 0 && !isActive;
        return (
          <button key={entry.skill} onClick={() => handleSkillToggle(entry.skill)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: isActive ? PALETTE.border : 'transparent',
              border: `1px solid ${isActive ? (SKILL_COLORS[entry.skill] ?? '#58A6FF') : PALETTE.border}`,
              borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
              opacity: isDimmed ? 0.45 : 1, transition: 'all 0.25s ease',
              color: isActive ? '#fff' : PALETTE.muted,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: SKILL_COLORS[entry.skill] ?? '#58A6FF',
              display: 'inline-block', flexShrink: 0,
            }} />
            {entry.skill}
          </button>
        );
      })}
      {selectedSkills.size > 0 && (
        <button onClick={() => setSelectedSkills(new Set())}
          style={{
            background: '#111827', border: `1px solid ${PALETTE.border}`,
            borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
            color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
          }}>
          Show All
        </button>
      )}
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Month toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 4 }}>
        {months.map((month) => (
          <button key={month} onClick={() => handleMonthChange(month)}
            style={{
              padding: '4px 14px', borderRadius: 6,
              border: `1px solid ${selectedMonth === month ? PALETTE.accent ?? '#58A6FF' : PALETTE.muted ?? '#555'}`,
              background: selectedMonth === month ? (PALETTE.accent ?? '#58A6FF') : 'transparent',
              color: selectedMonth === month ? '#fff' : (PALETTE.muted ?? '#aaa'),
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: selectedMonth === month ? 700 : 400,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}>
            {month}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              dataKey="share"
              nameKey="skill"
              cx="50%"
              cy="45%"
              innerRadius="45%"
              outerRadius={selectedSkills.size > 0 ? '78%' : '72%'}
              paddingAngle={selectedSkills.size > 0 ? 0 : 2}
              labelLine={false}
              label={(props) => renderLabel({ ...props, share: props.payload.share })}
              animationBegin={0}
              animationDuration={0}
              isAnimationActive={false}
              onClick={(data) => handleSkillToggle(data.skill)}
            >
              {filteredData.map((d) => (
                <Cell key={d.skill} fill={SKILL_COLORS[d.skill] ?? '#58A6FF'}
                  stroke={selectedSkills.has(d.skill) ? '#ffffff' : 'none'}
                  strokeWidth={selectedSkills.has(d.skill) ? 2 : 0}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}