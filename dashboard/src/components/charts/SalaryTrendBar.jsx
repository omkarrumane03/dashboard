import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { salaryTrend } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.text }}>Avg Salary: <strong>${payload[0].value}K</strong></div>
    </div>
  );
};

export default function SalaryTrendBar() {
  // 1. Initialize multi-select state defaulting to 'May'
  const [selectedMonths, setSelectedMonths] = useState(['May']);
  const months = ['Feb', 'Mar', 'Apr', 'May'];

  // 2. Filter data and calculate the average salary per skill across selected months
  const aggregatedData = useMemo(() => {
    const filtered = salaryTrend.filter(d => selectedMonths.includes(d.month));
    
    const grouped = filtered.reduce((acc, curr) => {
      if (!acc[curr.skill]) {
        acc[curr.skill] = { skill: curr.skill, totalSalary: 0, count: 0 };
      }
      acc[curr.skill].totalSalary += curr.salary;
      acc[curr.skill].count += 1;
      return acc;
    }, {});

    return Object.values(grouped).map(item => ({
      skill: item.skill,
      avgSalary: Math.round(item.totalSalary / item.count)
    }));
  }, [selectedMonths]);

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        // Enforce that at least one month stays selected so the chart isn't empty
        return prev.length > 1 ? prev.filter(m => m !== month) : prev;
      }
      return [...prev, month];
    });
  };

  const CustomLegend = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, width: '100%', textAlign: 'center', marginBottom: 4 }}>Select Months</span>
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
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={aggregatedData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="skill" tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis skill={[60, 130]} tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} unit="K" />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="avgSalary" name="Avg Salary ($K)" radius={[4, 4, 0, 0]}>
          <LabelList dataKey="avgSalary" position="top" style={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} formatter={v => `$${v}K`} />
          {aggregatedData.map(d => <Cell key={d.skill} fill={SKILL_COLORS[d.skill]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}