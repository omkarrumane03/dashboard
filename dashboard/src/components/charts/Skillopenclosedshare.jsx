// components/charts/SkillOpenClosedShare.jsx
// Merged Chart 2 (Open vs Closed by Skill) + Chart 4 (Skill-wise Hiring Share)
// Toggle: "Absolute" (grouped bars open/closed) ↔ "Share %" (stacked % bars)

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { skillsMonthly, hiringShare } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const MONTHS       = ['Feb', 'Mar', 'Apr', 'May'];
const MONTH_COLORS = { Feb: '#D2A8FF', Mar: '#3BC9A0', Apr: '#FFA657', May: '#58A6FF' };

// ── Skill colours for share view ──────────────────────────────────
const SKILL_COLORS = {
  Java:          PALETTE.accent  ?? '#58A6FF',
  DevOps:        PALETTE.green   ?? '#3BC9A0',
  'Data Science': PALETTE.purple ?? '#D2A8FF',
  'UI/UX':       PALETTE.orange  ?? '#FFA657',
  Mobile:        '#F78166',
};

// ── Tooltip ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, view }) => {
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
        <div key={p.dataKey} style={{ color: p.fill ?? p.color }}>
          {p.dataKey}: <strong>{p.value}{view === 'share' ? '%' : ''}</strong>
        </div>
      ))}
    </div>
  );
};

export default function SkillOpenClosedShare() {
  const [view,           setView]           = useState('absolute'); // 'absolute' | 'share'
  const [selectedMonths, setSelectedMonths] = useState(new Set(['May']));

  // ── Absolute view data: one row per skill ────────────────────────
  const absoluteData = useMemo(() => {
    return skillsMonthly.map(({ skill, monthly }) => {
      const entry = { skill };
      selectedMonths.forEach(m => {
        entry[`${m}_open`]   = monthly[m]?.open   ?? 0;
        entry[`${m}_closed`] = monthly[m]?.closed ?? 0;
      });
      return entry;
    });
  }, [selectedMonths]);

  // ── Share view data: one row per month ───────────────────────────
  const shareData = useMemo(() => {
    return MONTHS.filter(m => selectedMonths.has(m)).map(month => {
      const entry = { month };
      hiringShare
        .filter(d => d.month === month)
        .forEach(d => { entry[d.skill] = d.share; });
      return entry;
    });
  }, [selectedMonths]);

  const handleMonthToggle = (month) => {
    setSelectedMonths(prev => {
      const next = new Set(prev);
      if (next.has(month) && next.size === 1) return next;
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });
  };

  const skills = skillsMonthly.map(s => s.skill);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Controls row ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingRight: 4 }}>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'absolute', label: 'Open / Closed' },
            { key: 'share',    label: 'Hiring Share %' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
                background: view === key ? PALETTE.accentSoft : 'transparent',
                color: view === key ? PALETTE.accent : PALETTE.muted,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Month toggle */}
        <div style={{ display: 'flex', gap: 4 }}>
          {MONTHS.map(month => {
            const isActive = selectedMonths.has(month);
            return (
              <button key={month} onClick={() => handleMonthToggle(month)}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  border: `1px solid ${isActive ? MONTH_COLORS[month] : PALETTE.border}`,
                  background: isActive ? MONTH_COLORS[month] : 'transparent',
                  color: isActive ? '#fff' : PALETTE.muted,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {month}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chart ────────────────────────────────────────────────── */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">

          {view === 'absolute' ? (
            /* Grouped bars: open vs closed per skill */
            <BarChart data={absoluteData} barGap={2} barCategoryGap="12%"
              margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="skill"
                tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} />
              <YAxis tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip view="absolute" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend verticalAlign="top" height={28}
                formatter={key => <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{key}</span>} />
              {[...selectedMonths].flatMap(m => [
                <Bar key={`${m}_open`}   dataKey={`${m}_open`}   name={`${m} Open`}   fill={MONTH_COLORS[m]} fillOpacity={1}    radius={[3,3,0,0]} />,
                <Bar key={`${m}_closed`} dataKey={`${m}_closed`} name={`${m} Closed`} fill={MONTH_COLORS[m]} fillOpacity={0.4}  radius={[3,3,0,0]} />,
              ])}
            </BarChart>
          ) : (
            /* Stacked % bars: hiring share per skill, one bar per month */
            <BarChart data={shareData} barCategoryGap="30%"
              margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="month"
                tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`}
                tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip view="share" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend verticalAlign="top" height={28}
                formatter={key => <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: SKILL_COLORS[key] }}>{key}</span>} />
              {skills.map(skill => (
                <Bar key={skill} dataKey={skill} stackId="a"
                  fill={SKILL_COLORS[skill]} radius={skill === 'Mobile' ? [3,3,0,0] : [0,0,0,0]}>
                </Bar>
              ))}
            </BarChart>
          )}

        </ResponsiveContainer>
      </div>
    </div>
  );
}