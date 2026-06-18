// components/charts/ExperienceDemandBar.jsx
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const BUCKETS = ['Junior (4–6y)', 'Senior (6–10y)', 'Lead (10y+)'];

const BUCKET_COLORS = {
  'Junior (4–6y)':  '#3BC9A0',
  'Senior (6–10y)': '#D2A8FF',
  'Lead (10y+)':    '#58A6FF',
};

const getBucketForRow = (row) => {
  if ([14, 15, 20].includes(row.id))                        return 'Junior (4–6y)';
  if ([1, 3, 8, 9, 10, 11, 12, 17].includes(row.id))       return 'Senior (6–10y)';
  if ([2, 4, 5, 6, 7, 13, 16, 18, 19].includes(row.id))    return 'Lead (10y+)';
  return null;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const monthData = payload[0].payload;
  const roles     = monthData.roles || [];
  if (roles.length === 0) return null;

  const groupedByBucket = {};
  roles.forEach(role => {
    const bucket = getBucketForRow(role);
    if (bucket) {
      if (!groupedByBucket[bucket]) groupedByBucket[bucket] = [];
      groupedByBucket[bucket].push(role);
    }
  });

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "Inter, sans-serif", fontSize: 14 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6, fontWeight: 'bold' }}>
        {label} ({roles.length} role{roles.length !== 1 ? 's' : ''})
      </div>
      {BUCKETS.map(bucket => {
        if (!groupedByBucket[bucket]) return null;
        return (
          <div key={bucket} style={{ marginBottom: 6 }}>
            <div style={{ color: BUCKET_COLORS[bucket], fontWeight: 'bold', fontSize: 14, marginBottom: 2 }}>
              {bucket}
            </div>
            {groupedByBucket[bucket].map((role, idx) => (
              <div key={idx} style={{ color: '#ffffff', paddingLeft: 6, fontSize: 14, lineHeight: '1.4' }}>
                • {role.shortTitle} <span style={{ color: PALETTE.muted, fontSize: 14 }}></span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default function ExperienceDemandBar() {
  const { filteredPipeline } = useDateRange();
  const [hiddenBuckets, setHiddenBuckets] = useState({});

  const toggleBucket = (bucket) => {
    setHiddenBuckets(prev => ({ ...prev, [bucket]: !prev[bucket] }));
  };

  // Derive unique months from filteredPipeline (preserving order)
  const activeMonths = useMemo(() => {
    const seen = new Set();
    const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const chartData = useMemo(() =>
    activeMonths.map(month => {
      const entry = {
        month,
        'Junior (4–6y)':  0,
        'Senior (6–10y)': 0,
        'Lead (10y+)':    0,
        roles: [],
      };
      filteredPipeline.forEach(row => {
        if (row.month === month) {
          const bucket = getBucketForRow(row);
          if (bucket) {
            entry[bucket] += 1;
            entry.roles.push(row);
          }
        }
      });
      return entry;
    }),
  [filteredPipeline, activeMonths]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 8, fontFamily: "Inter, sans-serif", fontSize: 14, minHeight: 20, flexWrap: 'wrap' }}>
        {BUCKETS.map(bucket => {
          const isHidden = hiddenBuckets[bucket];
          return (
            <div key={bucket} onClick={() => toggleBucket(bucket)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', opacity: isHidden ? 0.4 : 1,
              userSelect: 'none', transition: 'opacity 0.2s ease',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: BUCKET_COLORS[bucket] }} />
              <span style={{ color: isHidden ? PALETTE.muted : '#ffffff', textDecoration: isHidden ? 'line-through' : 'none' }}>
                {bucket}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%" margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis dataKey="month"
              tick={{ fill: PALETTE.muted, fontSize: 14, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: PALETTE.border }} tickLine={false} />
            <YAxis
              tick={{ fill: PALETTE.muted, fontSize: 14, fontFamily: "Inter, sans-serif" }}
              axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            {BUCKETS.map(bucket => (
              <Bar key={bucket} dataKey={bucket} stackId="experience"
                fill={BUCKET_COLORS[bucket]} hide={hiddenBuckets[bucket]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}