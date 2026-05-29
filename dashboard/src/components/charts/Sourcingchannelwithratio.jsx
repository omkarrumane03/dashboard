// components/charts/SourcingChannelWithRatio.jsx
// Merged Chart 7 (Sourcing Channel Impact) + Chart 11 (Interview-to-Offer Ratio)
// Grouped bars: Interviews vs Hires per source, per selected month
// Overlaid line: Interview-to-Offer ratio from interviewOfferRatio data

import { useState, useMemo } from 'react';
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { sourcingData, interviewOfferRatio } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const MONTHS       = ['Feb', 'Mar', 'Apr', 'May'];
const MONTH_COLORS = { Feb: '#D2A8FF', Mar: '#3BC9A0', Apr: '#FFA657', May: '#58A6FF' };

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
        <div key={p.dataKey} style={{ color: p.color ?? p.fill }}>
          {p.name}: <strong>
            {p.value}{p.dataKey === 'ratio' ? 'x' : ''}
          </strong>
        </div>
      ))}
    </div>
  );
};

export default function SourcingChannelWithRatio() {
  const [selectedMonth, setSelectedMonth] = useState('May');

  // Bars: interviews & hires per source for selected month
  const barData = useMemo(() => {
    return sourcingData
      .filter(d => d.month === selectedMonth)
      .map(d => ({
        source: d.source,
        Interviews: d.interviews,
        Hires: d.hires,
        // Attach ratio as a constant across all sources for the line
        ratio: interviewOfferRatio.find(r => r.month === selectedMonth)?.ratio ?? null,
      }));
  }, [selectedMonth]);

  const currentRatio = interviewOfferRatio.find(r => r.month === selectedMonth)?.ratio;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Month selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, paddingTop: 8 }}>
        {MONTHS.map(month => {
          const isActive = selectedMonth === month;
          return (
            <button key={month} onClick={() => setSelectedMonth(month)}
              style={{
                padding: '4px 14px', borderRadius: 6, fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                border: `1px solid ${isActive ? MONTH_COLORS[month] : PALETTE.border}`,
                background: isActive ? MONTH_COLORS[month] : 'transparent',
                color: isActive ? '#fff' : PALETTE.muted,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {month}
            </button>
          );
        })}
      </div>

      {/* Ratio badge */}
      {currentRatio && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end', paddingRight: 8,
        }}>
          <span style={{
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            padding: '2px 8px', borderRadius: 4,
            background: PALETTE.accentSoft,
            color: PALETTE.accent,
          }}>
            Interview-to-Offer ratio: <strong>{currentRatio}x</strong>
          </span>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={barData} barGap={4} barCategoryGap="20%"
            margin={{ top: 6, right: 50, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />

            <XAxis dataKey="source"
              tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={{ stroke: PALETTE.border }} tickLine={false} />

            {/* Left Y — counts */}
            <YAxis yAxisId="count" orientation="left"
              tick={{ fill: PALETTE.muted, fontSize: 11 }}
              axisLine={false} tickLine={false} />

            {/* Right Y — ratio */}
            <YAxis yAxisId="ratio" orientation="right"
              domain={[0, 8]}
              tickFormatter={v => `${v}x`}
              tick={{ fill: PALETTE.orange, fontSize: 11 }}
              axisLine={false} tickLine={false} />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Legend verticalAlign="top" height={28}
              formatter={key => (
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{key}</span>
              )} />

            {/* Bars */}
            <Bar yAxisId="count" dataKey="Interviews"
              fill={PALETTE.accent} fillOpacity={0.85} radius={[3,3,0,0]} />
            <Bar yAxisId="count" dataKey="Hires"
              fill={PALETTE.green} fillOpacity={0.85} radius={[3,3,0,0]} />

            {/* Ratio line — flat across all sources (monthly constant) */}
            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="ratio"
              name="Interview/Offer Ratio"
              stroke={PALETTE.orange}
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ fill: PALETTE.orange, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}