// components/charts/ExperienceDemandBar.jsx
// Remapped to Orion real data: role count by experience bucket per period with native stacked segments
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { orionPipeline } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const PERIODS = ['May', 'Mar–May', 'Dec–Feb'];
const PERIOD_COLORS = { 'Dec–Feb': '#D2A8FF', 'Mar–May': '#3BC9A0', 'May': '#58A6FF' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  // Filter only the segments that actually contain a role (value === 1)
  const activeItems = payload.filter(p => p.value === 1);
  if (activeItems.length === 0) return null;

  // Group the roles by their respective period for clean presentation
  const grouped = {};
  activeItems.forEach(item => {
    const period = item.dataKey.split('_')[0];
    if (!grouped[period]) grouped[period] = [];

    const roleName = item.payload[`${item.dataKey}_name`];
    const roleExp = item.payload[`${item.dataKey}_exp`];
    grouped[period].push({ name: roleName, exp: roleExp });
  });

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {Object.keys(grouped).map(period => (
        <div key={period} style={{ marginBottom: 6 }}>
          <div style={{ color: PERIOD_COLORS[period], fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>
            {period} ({grouped[period].length} role{grouped[period].length !== 1 ? 's' : ''})
          </div>
          {grouped[period].map((role, idx) => (
            <div key={idx} style={{ color: '#ffffff', paddingLeft: 6, fontSize: 12, lineHeight: '1.4' }}>
              • {role.name} <span style={{ color: PALETTE.muted, fontSize: 11 }}>({role.exp})</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function ExperienceDemandBar() {
  // Tracks which period is currently isolated/focused ('Dec–Feb', 'Mar–May', 'May', or null)
  const [activePeriod, setActivePeriod] = useState(null);

  // Helper to accurately group pipeline items into experience design buckets
  const getBucketForRow = (row) => {
    if ([14, 15, 20].includes(row.id)) return 'Junior (4–6y)';
    if ([1, 3, 8, 9, 10, 11, 12, 17].includes(row.id)) return 'Senior (6–10y)';
    if ([2, 4, 5, 6, 7, 13, 16, 18, 19].includes(row.id)) return 'Lead (10y+)';
    return null;
  };

  // Generate chart data by mapping each role as a binary 1/0 stacked block key
  const chartData = ['Junior (4–6y)', 'Senior (6–10y)', 'Lead (10y+)'].map(bucket => {
    const entry = { bucket };
    PERIODS.forEach(p => {
      const matchedRoles = orionPipeline.filter(row => row.period === p && getBucketForRow(row) === bucket);
      matchedRoles.forEach((role, idx) => {
        const key = `${p}_role_${idx}`;
        entry[key] = 1;
        entry[`${key}_name`] = role.shortTitle;
        entry[`${key}_exp`] = role.experience;
      });
    });
    return entry;
  });

  const handleBarClick = (period) => {
    setActivePeriod(prev => (prev === period ? null : period));
  };

  const displayedPeriods = activePeriod ? [activePeriod] : PERIODS;

  // Maximum number of possible concurrent stacked layers per period column
  // May has max 6 roles, Mar-May has max 3, Dec-Feb has max 1
  const maxRolesPerPeriod = { 'May': 6, 'Mar–May': 3, 'Dec–Feb': 1 };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Dynamic Legend / Instruction Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minHeight: 20 }}>
        {activePeriod ? (
          <div 
            onClick={() => setActivePeriod(null)}
            style={{ color: PALETTE.accent ?? '#58A6FF', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ← Show All Periods
          </div>
        ) : (
          PERIODS.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, color: PALETTE.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: PERIOD_COLORS[p] }} />
              {p}
            </div>
          ))
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            barGap={4} 
            barCategoryGap="18%"
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            onClick={() => setActivePeriod(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis 
              dataKey="bucket" 
              tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} 
              axisLine={{ stroke: PALETTE.border }} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fill: PALETTE.muted, fontSize: 13 }} 
              axisLine={false} 
              tickLine={false} 
              allowDecimals={false} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            
            {displayedPeriods.flatMap(p => 
              Array.from({ length: maxRolesPerPeriod[p] }).map((_, idx) => {
                const dataKey = `${p}_role_${idx}`;
                return (
                  <Bar 
                    key={dataKey} 
                    dataKey={dataKey} 
                    stackId={p} 
                    fill={PERIOD_COLORS[p]}
                    stroke="#0d1117"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                    onClick={(data, index, event) => {
                      event.stopPropagation();
                      handleBarClick(p);
                    }}
                  />
                );
              })
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}