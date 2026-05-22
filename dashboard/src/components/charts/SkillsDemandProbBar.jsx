// components/charts/DomainDemandProbBar.jsx — Chart 21a: Forecasted Domain Demand Probability
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { SkillsDemandProb } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.accent }}>Probability: <strong>{(payload[0].value * 100).toFixed(0)}%</strong></div>
    </div>
  );
};

export default function SkillsDemandProbBar() {
  // 1. Initialize state with 'Jun_F' as the default future month
  const [selectedMonths, setSelectedMonths] = useState(['Jun_F']);
  
  const futureMonths = ['Jun_F', 'Jul_F', 'Aug_F'];
  // Display names for UI toggles to make it look clean
  const monthLabels = { Jun_F: 'June', Jul_F: 'July', Aug_F: 'August' };

  // 2. Filter, average out across selected months, and sort descending
  const aggregatedData = useMemo(() => {
    // Filter raw data based on selections
    const filtered = SkillsDemandProb.filter((item) => selectedMonths.includes(item.month));

    // Group by skill and track sum and occurrences to compute average
    const grouped = filtered.reduce((acc, curr) => {
      if (!acc[curr.skill]) {
        acc[curr.skill] = { skill: curr.skill, totalProb: 0, count: 0 };
      }
      acc[curr.skill].totalProb += curr.probability;
      acc[curr.skill].count += 1;
      return acc;
    }, {});

    // Map to final array with average probability, then sort descending
    return Object.values(grouped)
      .map(item => ({
        skill: item.skill,
        probability: item.totalProb / item.count
      }))
      .sort((a, b) => b.probability - a.probability);
  }, [selectedMonths]);

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        // Prevent clearing all filters
        return prev.length > 1 ? prev.filter(m => m !== month) : prev;
      }
      return [...prev, month];
    });
  };

  const CustomLegend = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, width: '100%', textAlign: 'center', marginBottom: 4 }}></span>
        {futureMonths.map((month) => {
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
              {monthLabels[month]}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={aggregatedData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
        <XAxis type="number" domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis type="category" dataKey="skill" width={90}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="probability" name="Demand Probability" radius={[0, 4, 4, 0]}>
          <LabelList dataKey="probability" position="right"
            formatter={v => `${(v * 100).toFixed(0)}%`}
            style={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} />
          {aggregatedData.map(d => <Cell key={d.skill} fill={SKILL_COLORS[d.skill]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}