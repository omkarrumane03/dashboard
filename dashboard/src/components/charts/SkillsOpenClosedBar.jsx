// components/charts/DomainOpenClosedBar.jsx — Chart 2: Open vs Closed by Domain (Monthly)
import { useState, useMemo } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid,
        Tooltip, Legend, ResponsiveContainer, Cell} from 'recharts';
import { skillsMonthly, months } from '../../data/notebookData';
import { SKILL_COLORS, PALETTE } from '../../utils/theme';

// ─── Tooltip ────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
    }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6, fontWeight: 700 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill || p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── Month pill styles ───────────────────────────────────────────────
const MONTH_COLORS = {
  // Nov: '#7f60fa',  // blue
  // Dec: '#a78bfa',  // purple
  // Jan: '#34d399',  // green
  Feb: '#fb923c',  // orange
  Mar: '#f472b6',  // pink
  Apr: '#67e8f9',  // cyan
  May: '#158ffa',  // yellow
};

export default function SkillsOpenClosedBar() {
  const [selectedMonths, setSelectedMonths] = useState(['May']); // default: current month

  const toggleMonth = (month) => {
    setSelectedMonths(prev =>
      prev.includes(month)
        ? prev.length === 1 ? prev          // keep at least one selected
          : prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  // Build chart data: one row per domain, columns = month_open / month_closed
  const chartData = useMemo(() => {
    return skillsMonthly.map(({skill, monthly }) => {
      const row = { skill };
      selectedMonths.forEach(m => {
        row[`${m}_open`]   = monthly[m]?.open   ?? 0;
        row[`${m}_closed`] = monthly[m]?.closed ?? 0;
      });
      return row;
    });
  }, [selectedMonths]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Month selector pills ─────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        paddingLeft: 2,
      }}>
        {months.map(month => {
          const active = selectedMonths.includes(month);
          const color  = MONTH_COLORS[month];
          return (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              style={{
                padding: '3px 12px',
                borderRadius: 20,
                border: `1.5px solid ${active ? color : PALETTE.border}`,
                background: active ? `${color}22` : 'transparent',
                color: active ? color : PALETTE.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.05em',
              }}
            >
              {month}
            </button>
          );
        })}
      </div>

      {/* ── Chart ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 10, left: -10, bottom: 5 }}
            barGap={2}
            barCategoryGap="22%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
            <XAxis
              dataKey="skill"
              tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={{ stroke: PALETTE.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: PALETTE.muted }}
              formatter={(value) => (
                <span style={{ color: PALETTE.muted, fontSize: 11 }}>{value}</span>
              )}
            />

            {/* Render one open + one closed bar per selected month */}
            {selectedMonths.map(month => (
              <>
                <Bar
                  key={`${month}_open`}
                  dataKey={`${month}_open`}
                  name={`${month} Open`}
                  radius={[3, 3, 0, 0]}
                  fill={MONTH_COLORS[month]}
                >
                  {chartData.map(d => (
                    <Cell
                      key={`${month}_open_${d.domain}`}
                      fill={MONTH_COLORS[month]}
                    />
                  ))}
                </Bar>
                <Bar
                  key={`${month}_closed`}
                  dataKey={`${month}_closed`}
                  name={`${month} Closed`}
                  radius={[3, 3, 0, 0]}
                  fill={MONTH_COLORS[month]}
                  opacity={0.4}
                >
                  {chartData.map(s => (
                    <Cell
                      key={`${month}_closed_${s.skill}`}
                      fill={MONTH_COLORS[month]}
                    />
                  ))}
                </Bar>
              </>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}