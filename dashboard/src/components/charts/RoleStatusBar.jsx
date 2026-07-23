// components/charts/RoleStatusBar.jsx
import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { formatMonthLabel } from '../../utils/dateRangeUtils';
import { PALETTE } from '../../utils/theme';
import useActiveToggle from '../../hooks/useActiveToggle';
import { STATUS_COLORS, STATUS_ORDER, STATUS_TEXT_COLORS } from '../../utils/dashboardConstants';

const ALL_OPTION = 'All';

const CustomTooltip = ({ active, payload, label, pipeline }) => {
  if (!active || !payload?.length) return null;
  const row = pipeline.find(r => r.shortTitle === label);
  if (!row) return null;

  const total = payload.filter(p => p.value > 0).reduce((s, p) => s + p.value, 0);

  return (
    <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 18, minWidth: 220, boxShadow: '0 8px 24px rgba(15,42,34,0.15)' }}>
      <div style={{ color: PALETTE.text, fontWeight: 700, fontSize: 16, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${PALETTE.border}` }}>
        {row.jobTitle}
      </div>
      {STATUS_ORDER.map(s => {
        const seg = payload.find(p => p.dataKey === s);
        const val = seg?.value ?? 0;
        return (
          <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 4, opacity: val === 0 ? 0.3 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[s], flexShrink: 0 }} />
              <span style={{ color: STATUS_TEXT_COLORS[s], fontSize: 15 }}>{s}</span>
            </div>
            <span style={{ color: val > 0 ? PALETTE.text : PALETTE.muted, fontWeight: val > 0 ? 700 : 400 }}>{val}</span>
          </div>
        );
      })}
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${PALETTE.border}`, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: PALETTE.muted }}>Total Positions</span>
          <strong style={{ color: PALETTE.text }}>{total}</strong>
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
          <span style={{ color: PALETTE.muted }}>Experience</span>
          <strong style={{ color: PALETTE.text }}>{row.experience}</strong>
        </div>
      </div>
      {row.comment && row.comment !== 'In Process' && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${PALETTE.border}`, fontSize: 17, color: PALETTE.muted, lineHeight: 1.6 }}>
          {row.comment}
        </div>
      )}
    </div>
  );
};

export default function RoleStatusBar() {
  const { filteredPipeline } = useDateRange();
  const [selectedMonth, setSelectedMonth] = useState(ALL_OPTION);
  const { active: activeStatuses, hasSelection, toggle: toggleStatus } = useActiveToggle();

  const availableMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.openedMonth)) { seen.add(r.openedMonth); months.push(r.openedMonth); }
    });
    return months;
  }, [filteredPipeline]);

  const activeMonth = availableMonths.includes(selectedMonth) ? selectedMonth : ALL_OPTION;

  const filteredRoles = useMemo(() => {
    let base = activeMonth === ALL_OPTION
      ? filteredPipeline
      : filteredPipeline.filter(r => r.openedMonth === activeMonth);

    if (hasSelection) {
      base = base.filter(r => activeStatuses[r.status]);
    }
    
    return base.slice().sort((a, b) => b.openings - a.openings);
  }, [filteredPipeline, activeMonth, activeStatuses, hasSelection]);

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
        <span style={{ fontSize: 18, color: PALETTE.muted, marginRight: 2 }}>Month:</span>
        {[ALL_OPTION, ...availableMonths].map(m => (
          <button key={m} onClick={() => setSelectedMonth(m)} style={{
            padding: '4px 12px', borderRadius: 20,
            border: `1px solid ${activeMonth === m ? PALETTE.accent : PALETTE.border}`,
            background: activeMonth === m ? `${PALETTE.accent}22` : 'transparent',
            color: activeMonth === m ? PALETTE.accent : PALETTE.muted,
            fontSize: 15, fontFamily: "Inter, sans-serif",
            cursor: 'pointer', fontWeight: activeMonth === m ? 700 : 400,
            transition: 'all 0.15s',
          }}>{formatMonthLabel(m)}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, fontSize: 20, color: PALETTE.muted, alignItems: 'center' }}>
          <span><strong style={{ color: PALETTE.text }}>{summary.totalRoles}</strong> Roles</span>
          <span><strong style={{ color: PALETTE.text }}>{summary.totalOpenings}</strong> Positions</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        {STATUS_ORDER.map(s => {
          const isMuted = hasSelection && !activeStatuses[s];
          const globalMatchingCount = filteredPipeline.filter(r => (activeMonth === ALL_OPTION || r.openedMonth === activeMonth) && r.status === s).length;
          
          if (globalMatchingCount === 0) return null;

          return (
            <div 
              key={s} 
              onClick={() => toggleStatus(s)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 5, 
                fontSize: 18, 
                color: isMuted ? PALETTE.muted : PALETTE.muted,
                cursor: 'pointer',
                opacity: isMuted ? 0.35 : 1,
                userSelect: 'none',
                transition: 'opacity 0.2s ease'
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[s] }} />
              {s}
              <span style={{ 
                color: isMuted ? PALETTE.muted : STATUS_TEXT_COLORS[s], 
                fontWeight: 700 
              }}>({summary.statusCounts[s] ?? 0})</span>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.role-status-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div className="role-status-scroll" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData} layout="vertical"
              margin={{ top: 4, right: 24, left: 110, bottom: 4 }} barSize={22}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
              <XAxis type="number"
                tick={{ fill: PALETTE.muted, fontSize: 15, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} allowDecimals={false}
              />
              <YAxis type="category" dataKey="role" width={106}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={-4} y={0} dy={4} textAnchor="end" fill={PALETTE.muted} fontSize={18} fontFamily="Inter, sans-serif">
                      <title>{filteredPipeline.find(r => r.shortTitle === payload.value)?.jobTitle}</title>
                      {payload.value}
                    </text>
                  </g>
                )}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip pipeline={filteredPipeline} />} cursor={{ fill: 'rgba(15,42,34,0.04)' }} />
              {STATUS_ORDER.map((s, i) => {
                const shouldHideBar = hasSelection && !activeStatuses[s];
                return (
                  <Bar key={s} dataKey={s} stackId="openings"
                    fill={STATUS_COLORS[s]} fillOpacity={0.88}
                    hide={shouldHideBar}
                    radius={i === STATUS_ORDER.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* <div style={{ fontSize: 15, color: PALETTE.muted, opacity: 0.6, paddingBottom: 2 }}>
        Bar length = total openings · colour = status · toggle month above · hover for full breakdown
      </div> */}
    </div>
  );
}