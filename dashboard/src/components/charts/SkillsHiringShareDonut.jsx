import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { hiringShare } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  
  // Sort payload by value descending for readability
  const sorted = [...payload].sort((a, b) => b.value - a.value);
  
  return (
    <div style={{
      background: '#0d1117', border: `1px solid ${PALETTE.border}`,
      borderRadius: 8, padding: '8px 12px',
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>
        <strong>{sorted[0].payload.month}</strong>
      </div>
      {sorted.map((entry, idx) => (
        <div key={idx} style={{ color: entry.fill, marginBottom: idx < sorted.length - 1 ? 4 : 0 }}>
          {entry.name}: <strong>{entry.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function SkillsHiringShareDonut() {
  // Transform flat data into month-based structure for stacked bar
  const chartData = useMemo(() => {
    const months = ['Feb', 'Mar', 'Apr', 'May'];
    const skills = ['Java', 'DevOps', 'Data Science', 'UI/UX', 'Mobile'];
    
    return months.map(month => {
      const monthObj = { month };
      hiringShare
        .filter(d => d.month === month)
        .forEach(d => {
          monthObj[d.skill] = d.share;
        });
      return monthObj;
    });
  }, []);

  const skills = useMemo(() => ['Java', 'DevOps', 'Data Science', 'UI/UX', 'Mobile'], []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 12,
        color: PALETTE.muted,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        Skills Hiring Share Trend (Feb–May)
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke={PALETTE.muted}
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: PALETTE.muted }}
              label={{ value: 'Share (%)', position: 'insideBottomRight', offset: -10, fill: PALETTE.muted }}
            />
            <YAxis
              dataKey="month"
              type="category"
              stroke={PALETTE.muted}
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: PALETTE.muted }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
              }}
              iconType="square"
            />

            {/* Stacked bars for each skill */}
            {skills.map((skill) => (
              <Bar
                key={skill}
                dataKey={skill}
                stackId="100%"
                fill={SKILL_COLORS[skill] ?? '#58A6FF'}
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}