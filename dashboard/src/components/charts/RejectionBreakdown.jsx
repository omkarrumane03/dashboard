// components/charts/RejectionBreakdown.jsx
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const PERIOD_COLORS = {
  'Dec': '#D2A8FF', 'Jan': '#9e8ccc', 'Feb': '#7a6ba8',
  'Mar': '#3BC9A0', 'Apr': '#2a9478', 'May': '#58A6FF',
};

const truncateLabel = (label, maxLength = 11) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

const CustomXAxisTick = ({ x, y, payload }) => {
  const fullLabel = payload.value || '';
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="end"
        fill={PALETTE.muted} fontSize={14}
        fontFamily="'Inter', sans-serif"
        transform="rotate(-30)" style={{ cursor: 'pointer' }}>
        <title>{fullLabel}</title>
        {truncateLabel(fullLabel, 11)}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "Inter, sans-serif", fontSize: 14 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color ?? p.fill }}>
          {p.name ?? p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function RejectionBreakdown() {
  const { filteredPipeline } = useDateRange();
  const [view, setView] = useState('role');

  // Derive available months from filteredPipeline
  const availableMonths = useMemo(() => {
    const seen = new Set();
    const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  // Selected periods default to all available months
  const [selectedPeriods, setSelectedPeriods] = useState(null);

  const activePeriods = useMemo(() => {
    const base = selectedPeriods ?? new Set(availableMonths);
    // Keep only months still in filtered range
    return new Set([...base].filter(p => availableMonths.includes(p)));
  }, [selectedPeriods, availableMonths]);

  const roleData = useMemo(() =>
    filteredPipeline
      .filter(r => activePeriods.has(r.month) && r.profilesShared > 0)
      .map(r => ({
        role:              r.shortTitle,
        'Profiles Shared': r.profilesShared,
        'L1 Reject':       r.l1Reject,
        'L2 Reject':       r.l2Reject,
        period:            r.month,
      })),
  [filteredPipeline, activePeriods]);

  const periodData = useMemo(() =>
    availableMonths.filter(p => activePeriods.has(p)).map(p => {
      const rows   = filteredPipeline.filter(r => r.month === p);
      const shared = rows.reduce((s, r) => s + r.profilesShared, 0);
      const l1     = rows.reduce((s, r) => s + r.l1Reject,       0);
      const l2     = rows.reduce((s, r) => s + r.l2Reject,       0);
      const passed = shared - l1 - l2;
      return {
        period:      p,
        'L1 Reject': shared > 0 ? parseFloat(((l1     / shared) * 100).toFixed(1)) : 0,
        'L2 Reject': shared > 0 ? parseFloat(((l2     / shared) * 100).toFixed(1)) : 0,
        'Passed':    shared > 0 ? parseFloat(((passed / shared) * 100).toFixed(1)) : 0,
      };
    }),
  [filteredPipeline, availableMonths, activePeriods]);

  const toggle = (p) => {
    setSelectedPeriods(prev => {
      const current = prev ?? new Set(availableMonths);
      const next    = new Set(current);
      if (next.has(p) && next.size === 1) return next;
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingRight: 4, flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ key: 'role', label: 'By Role' }, { key: 'period', label: 'By Month %' }].map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 14,
              fontFamily: "Inter, sans-serif",
              border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
              background: view === key ? PALETTE.accentSoft : 'transparent',
              color: view === key ? PALETTE.accent : PALETTE.muted,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Only show months available in filtered range */}
        {/* <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {availableMonths.map(p => {
            const active = activePeriods.has(p);
            return (
              <button key={p} onClick={() => toggle(p)} style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 13,
                fontFamily: "Inter, sans-serif",
                border: `1px solid ${active ? PERIOD_COLORS[p] ?? PALETTE.accent : PALETTE.border}`,
                background: active ? PERIOD_COLORS[p] ?? PALETTE.accent : 'transparent',
                color: active ? '#fff' : PALETTE.muted,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{p}</button>
            );
          })}
        </div> */}
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          {view === 'role' ? (
            <BarChart data={roleData} barGap={2} barCategoryGap="15%"
              margin={{ top: 6, right: 10, left: -10, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="role" tick={<CustomXAxisTick />}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} interval={0} height={50} />
              <YAxis tick={{ fill: PALETTE.muted, fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend verticalAlign="top" height={28}
                formatter={k => <span style={{ fontSize: 13, fontFamily: "Inter, sans-serif" }}>{k}</span>} />
              <Bar dataKey="Profiles Shared" fill={PALETTE.accent}           fillOpacity={0.9}  radius={[3,3,0,0]} />
              <Bar dataKey="L1 Reject"       fill={PALETTE.orange}           fillOpacity={0.85} radius={[3,3,0,0]} />
              <Bar dataKey="L2 Reject"       fill={PALETTE.red ?? '#F85149'} fillOpacity={0.8}  radius={[3,3,0,0]} />
            </BarChart>
          ) : (
            <BarChart data={periodData} barCategoryGap="30%"
              margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="period"
                tick={{ fill: PALETTE.muted, fontSize: 14, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: PALETTE.border }} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`}
                tick={{ fill: PALETTE.muted, fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend verticalAlign="top" height={28}
                formatter={k => <span style={{ fontSize: 13, fontFamily: "Inter, sans-serif" }}>{k}</span>} />
              <Bar dataKey="L1 Reject" stackId="a" fill={PALETTE.orange}           fillOpacity={0.85} />
              <Bar dataKey="L2 Reject" stackId="a" fill={PALETTE.red ?? '#F85149'} fillOpacity={0.8}  />
              <Bar dataKey="Passed"    stackId="a" fill={PALETTE.green}            fillOpacity={0.75} radius={[3,3,0,0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}