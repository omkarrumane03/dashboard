import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { experienceDemand } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const levels = ['Fresher (0-2)', 'Junior (3-7)', 'Mid (7-12)', 'Senior (12+)'];
const LEVEL_COLORS = {
  'Fresher (0-2)': PALETTE.accent  ?? '#58A6FF',
  'Junior (3-7)':  PALETTE.green   ?? '#3BC9A0',
  'Mid (7-12)':    PALETTE.purple  ?? '#D2A8FF',
  'Senior (12+)':  PALETTE.orange  ?? '#FFA657',
};

// Colors for when we compare months directly
const MONTH_COLORS = { Feb: '#D2A8FF', Mar: '#3BC9A0', Apr: '#FFA657', May: '#58A6FF' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function ExperienceDemandGrouped() {
  const [selectedMonths, setSelectedMonths] = useState(new Set(['May']));
  const allMonths = useMemo(() => [...new Set(experienceDemand.map((d) => d.month))], []);

  const chartData = useMemo(() => {
    return levels.map((level) => {
      const entry = { level };
      selectedMonths.forEach((month) => {
        const found = experienceDemand.find((d) => d.month === month && d.level === level);
        entry[month] = found?.count ?? 0;
      });
      return entry;
    });
  }, [selectedMonths]);

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month) && next.size === 1) return next;
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      
      {/* Month Toggle UI */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, paddingTop: 10 }}>
        {allMonths.map((month) => {
          const isActive = selectedMonths.has(month);
          return (
            <button key={month} onClick={() => handleMonthToggle(month)}
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
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            /* 1. barGap: space between bars of different months for the SAME level.
               2. barCategoryGap: space between the different experience level groups. 
                  A percentage (e.g., "20%") or a pixel value works. 
                  Lowering this value makes the bars wider.
            */
            barGap={2} 
            barCategoryGap="15%" 
          >
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis 
              dataKey="level" 
              tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} 
              axisLine={{ stroke: PALETTE.border }} 
              tickLine={false} 
            />
            <YAxis tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Legend verticalAlign="top" height={36}/>
            
            {[...selectedMonths].map((month) => (
              <Bar 
                key={month} 
                dataKey={month} 
                fill={MONTH_COLORS[month]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}