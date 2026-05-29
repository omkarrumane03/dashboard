// components/charts/SkillHireCountBar.jsx — Hiring Trend Chart 2
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { skillsMonthly } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const MONTH_COLORS = { Feb: '#D2A8FF', Mar: '#3BC9A0', Apr: '#FFA657', May: '#58A6FF' };
const allMonths = ['Feb', 'Mar', 'Apr', 'May'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '8px 12px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey}: <strong>{p.value}</strong> hires
        </div>
      ))}
    </div>
  );
};

export default function SkillHireCountBar() {
  const [selectedMonths, setSelectedMonths] = useState(new Set(['May']));

  const chartData = useMemo(() => {
    return skillsMonthly.map(({ skill, monthly }) => {
      const entry = { skill };
      selectedMonths.forEach(month => {
        entry[month] = monthly[month]?.closed ?? 0;
      });
      return entry;
    });
  }, [selectedMonths]);

  const handleToggle = (month) => {
    setSelectedMonths(prev => {
      const next = new Set(prev);
      if (next.has(month) && next.size === 1) return next;
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Month Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, paddingTop: 10 }}>
        {allMonths.map(month => {
          const isActive = selectedMonths.has(month);
          return (
            <button key={month} onClick={() => handleToggle(month)}
              style={{
                padding: '4px 14px', borderRadius: 6,
                border: `1px solid ${isActive ? MONTH_COLORS[month] : PALETTE.border}`,
                background: isActive ? MONTH_COLORS[month] : 'transparent',
                color: isActive ? '#fff' : PALETTE.muted,
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}>
              {month}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap="15%"
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis dataKey="skill"
              tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={{ stroke: PALETTE.border }} tickLine={false} />
            <YAxis tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Legend verticalAlign="top" height={36} />
            {[...selectedMonths].map(month => (
              <Bar key={month} dataKey={month} fill={MONTH_COLORS[month]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}