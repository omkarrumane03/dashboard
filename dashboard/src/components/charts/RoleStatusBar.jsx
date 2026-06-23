// components/charts/RoleStatusBar.jsx
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const STATUS_COLORS = {
  'In Process':     '#58a6ff',
  'On Hold':        '#f0883e',
  'Closed-Hired':   '#3fb950',
  'Closed-No Hire': '#f85149',
};

const STATUS_ORDER = ['In Process', 'On Hold', 'Closed-Hired', 'Closed-No Hire'];

const ALL_OPTION = 'All';

const CustomTooltip = ({ active, payload, label, pipeline }) => {
  if (!active || !payload?.length) return null;
  const row = pipeline.find(r => r.shortTitle === label);
  if (!row) return null;

  const total = payload.filter(p => p.value > 0).reduce((s, p) => s + p.value, 0);

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13, minWidth: 220, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${PALETTE.border}` }}>
        {row.jobTitle}
      </div>
      {STATUS_ORDER.map(s => {
        const seg = payload.find(p => p.dataKey === s);
        const val = seg?.value ?? 0;
        return (
          <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 4, opacity: val === 0 ? 0.3 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[s], flexShrink: 0 }} />
              <span style={{ color: STATUS_COLORS[s], fontSize: 13 }}>{s}</span>
            </div>
            <span style={{ color: val > 0 ? '#fff' : PALETTE.muted, fontWeight: val > 0 ? 700 : 400 }}>{val}</span>
          </div>
        );
      })}
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${PALETTE.border}`, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Total Openings</span>
          <strong style={{ color: '#fff' }}>{total}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Profiles Shared</span>
          <strong style={{ color: PALETTE.green }}>{row.profilesShared}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Selections</span>
          <strong style={{ color: PALETTE.accent }}>{row.selections ?? '—'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Opened</span>
          <strong style={{ color: '#fff' }}>{row.month}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Experience</span>
          <strong style={{ color: '#fff' }}>{row.experience}</strong>
        </div>
      </div>
      {row.comment && row.comment !== 'In Process' && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${PALETTE.border}`, fontSize: 13, color: PALETTE.muted, lineHeight: 1.6 }}>
          {row.comment}
        </div>
      )}
    </div>
  );
};

export default function RoleStatusBar() {
  const { filteredPipeline } = useDateRange();
  const [selectedMonth, setSelectedMonth] = useState(ALL_OPTION);

  const availableMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const activeMonth = availableMonths.includes(selectedMonth) ? selectedMonth : ALL_OPTION;

  const filteredRoles = useMemo(() => {
    const base = activeMonth === ALL_OPTION
      ? filteredPipeline
      : filteredPipeline.filter(r => r.month === activeMonth);
    return base.slice().sort((a, b) => b.openings - a.openings);
  }, [filteredPipeline, activeMonth]);

  const chartData = useMemo(() =>
    filteredRoles.map(r => {
      const entry = { role: r.shortTitle };
      STATUS_ORDER.forEach(s => { entry[s] = r.status === s ? r.openings : 0; });
      return entry;
    }),
  [filteredRoles]);

  const chartHeight = Math.max(filteredRoles.length * 42 + 20, 200);

  const summary = useMemo(() => {
    const totalOpenings = filteredRoles.reduce((s, r) => s + r.openings, 0);
    const statusCounts  = {};
    STATUS_ORDER.forEach(s => {
      const count = filteredRoles.filter(r => r.status === s).length;
      if (count > 0) statusCounts[s] = count;
    });
    return { totalOpenings, totalRoles: filteredRoles.length, statusCounts };
  }, [filteredRoles]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "Inter, sans-serif", gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 4 }}>
        <span style={{ fontSize: 13, color: PALETTE.muted, marginRight: 2 }}>Month:</span>
        {[ALL_OPTION, ...availableMonths].map(m => (
          <button key={m} onClick={() => setSelectedMonth(m)} style={{
            padding: '4px 12px', borderRadius: 20,
            border: `1px solid ${activeMonth === m ? PALETTE.accent : PALETTE.border}`,
            background: activeMonth === m ? `${PALETTE.accent}22` : 'transparent',
            color: activeMonth === m ? PALETTE.accent : PALETTE.muted,
            fontSize: 13, fontFamily: "Inter, sans-serif",
            cursor: 'pointer', fontWeight: activeMonth === m ? 700 : 400,
            transition: 'all 0.15s',
          }}>{m}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, fontSize: 13, color: PALETTE.muted, alignItems: 'center' }}>
          <span><strong style={{ color: '#fff' }}>{summary.totalRoles}</strong> roles</span>
          <span><strong style={{ color: PALETTE.accent }}>{summary.totalOpenings}</strong> openings</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {STATUS_ORDER.filter(s => filteredRoles.some(r => r.status === s)).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: PALETTE.muted }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[s] }} />
            {s}
            <span style={{ color: STATUS_COLORS[s], fontWeight: 700 }}>({summary.statusCounts[s] ?? 0})</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData} layout="vertical"
              margin={{ top: 4, right: 24, left: 110, bottom: 4 }} barSize={22}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
              <XAxis type="number"
                tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} allowDecimals={false}
              />
              <YAxis type="category" dataKey="role" width={106}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={-4} y={0} dy={4} textAnchor="end" fill={PALETTE.muted} fontSize={13} fontFamily="'JetBrains Mono', monospace">
                      <title>{filteredPipeline.find(r => r.shortTitle === payload.value)?.jobTitle}</title>
                      {payload.value}
                    </text>
                  </g>
                )}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip pipeline={filteredPipeline} />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              {STATUS_ORDER.map((s, i) => (
                <Bar key={s} dataKey={s} stackId="openings"
                  fill={STATUS_COLORS[s]} fillOpacity={0.88}
                  radius={i === STATUS_ORDER.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ fontSize: 13, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Bar length = total openings · colour = status · toggle month above · hover for full breakdown
      </div>
    </div>
  );
}