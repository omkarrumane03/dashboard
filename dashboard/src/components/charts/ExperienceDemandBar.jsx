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

const MONTH_COLORS = { Feb: '#D2A8FF', Mar: '#3BC9A0', Apr: '#FFA657', May: '#58A6FF' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: LEVEL_COLORS[p.dataKey] }}>
          {p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function ExperienceDemandBar() {
  const [selectedLevels, setSelectedLevels] = useState(new Set());
  const [selectedMonths, setSelectedMonths] = useState(new Set(['May']));

  const allMonths = useMemo(() => [...new Set(experienceDemand.map((d) => d.month))], []);
  const isMultiMonth = selectedMonths.size > 1;

  const activeLevels = useMemo(
    () => (selectedLevels.size > 0 ? levels.filter((l) => selectedLevels.has(l)) : levels),
    [selectedLevels]
  );

  // X axis = months, each level is a stacked Bar keeping its own color
  const chartData = useMemo(() => {
    const activeMonths = allMonths.filter((m) => selectedMonths.has(m));
    return activeMonths.map((month) => {
      const entry = { month };
      activeLevels.forEach((level) => {
        const found = experienceDemand.find((d) => d.month === month && d.level === level);
        entry[level] = found?.count ?? 0;
      });
      return entry;
    });
  }, [selectedMonths, activeLevels, allMonths]);

  const handleMonthToggle = (month) => {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month) && next.size === 1) return next;
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });
  };

  const handleLevelToggle = (level) => {
    setSelectedLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };

  const LevelLegend = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 8 }}>
      {levels.map((level) => {
        const isActive = selectedLevels.has(level);
        const isDimmed = selectedLevels.size > 0 && !isActive;
        return (
          <button key={level} onClick={() => handleLevelToggle(level)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: isActive ? PALETTE.border : 'transparent',
              border: `1px solid ${isActive ? LEVEL_COLORS[level] : PALETTE.border}`,
              borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
              opacity: isDimmed ? 0.45 : 1, transition: 'all 0.25s ease',
              color: isActive ? '#fff' : PALETTE.muted,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: LEVEL_COLORS[level], display: 'inline-block' }} />
            {level}
          </button>
        );
      })}
      {selectedLevels.size > 0 && (
        <button onClick={() => setSelectedLevels(new Set())}
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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>

      {/* Month multi-select toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 4 }}>
        {allMonths.map((month) => {
          const isActive = selectedMonths.has(month);
          return (
            <button key={month} onClick={() => handleMonthToggle(month)}
              style={{
                padding: '4px 14px', borderRadius: 6,
                border: `1px solid ${isActive ? MONTH_COLORS[month] : PALETTE.muted ?? '#555'}`,
                background: isActive ? MONTH_COLORS[month] : 'transparent',
                color: isActive ? '#fff' : (PALETTE.muted ?? '#aaa'),
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
              {month}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
            <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
            <YAxis domain={[0, 'dataMax + 20']} tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {activeLevels.map((level, idx) => (
              <Bar key={level} dataKey={level}
                stackId={isMultiMonth ? 'stack' : undefined}
                fill={LEVEL_COLORS[level]}
                radius={idx === activeLevels.length - 1 ? [4, 4, 0, 0] : undefined}
              />
            ))}
            <Legend content={<LevelLegend />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}