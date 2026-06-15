// // components/charts/ExperienceDemandBar.jsx
// import { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { orionPipeline, MONTHS } from '../../data/notebookData';
// import { PALETTE } from '../../utils/theme';

// // All 6 months shown — empty months render as zero-height bars
// const PERIODS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
// const PERIOD_COLORS = {
//   'Dec': '#D2A8FF',
//   'Jan': '#9e8ccc',
//   'Feb': '#7a6ba8',
//   'Mar': '#3BC9A0',
//   'Apr': '#2a9478',
//   'May': '#58A6FF',
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;

//   const activeItems = payload.filter(p => p.value === 1);
//   if (activeItems.length === 0) return null;

//   const grouped = {};
//   activeItems.forEach(item => {
//     const period = item.dataKey.split('_')[0];
//     if (!grouped[period]) grouped[period] = [];
//     const roleName = item.payload[`${item.dataKey}_name`];
//     const roleExp  = item.payload[`${item.dataKey}_exp`];
//     grouped[period].push({ name: roleName, exp: roleExp });
//   });

//   return (
//     <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
//       <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
//       {Object.keys(grouped).map(period => (
//         <div key={period} style={{ marginBottom: 6 }}>
//           <div style={{ color: PERIOD_COLORS[period], fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>
//             {period} ({grouped[period].length} role{grouped[period].length !== 1 ? 's' : ''})
//           </div>
//           {grouped[period].map((role, idx) => (
//             <div key={idx} style={{ color: '#ffffff', paddingLeft: 6, fontSize: 12, lineHeight: '1.4' }}>
//               • {role.name} <span style={{ color: PALETTE.muted, fontSize: 11 }}>({role.exp})</span>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default function ExperienceDemandBar() {
//   const [activePeriod, setActivePeriod] = useState(null);

//   const getBucketForRow = (row) => {
//     if ([14, 15, 20].includes(row.id)) return 'Junior (4–6y)';
//     if ([1, 3, 8, 9, 10, 11, 12, 17].includes(row.id)) return 'Senior (6–10y)';
//     if ([2, 4, 5, 6, 7, 13, 16, 18, 19].includes(row.id)) return 'Lead (10y+)';
//     return null;
//   };

//   const chartData = ['Junior (4–6y)', 'Senior (6–10y)', 'Lead (10y+)'].map(bucket => {
//     const entry = { bucket };
//     PERIODS.forEach(p => {
//       const matchedRoles = orionPipeline.filter(row => row.month === p && getBucketForRow(row) === bucket);
//       matchedRoles.forEach((role, idx) => {
//         const key = `${p}_role_${idx}`;
//         entry[key] = 1;
//         entry[`${key}_name`] = role.shortTitle;
//         entry[`${key}_exp`]  = role.experience;
//       });
//     });
//     return entry;
//   });

//   const handleBarClick = (period) => {
//     setActivePeriod(prev => (prev === period ? null : period));
//   };

//   const displayedPeriods = activePeriod ? [activePeriod] : PERIODS;

//   // Jan, Feb, Apr have 0 roles — included so months appear in legend/axis
//   const maxRolesPerPeriod = {
//     'Dec': 2,
//     'Jan': 0,
//     'Feb': 0,
//     'Mar': 4,
//     'Apr': 0,
//     'May': 14,
//   };

//   return (
//     <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, paddingTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, minHeight: 20, flexWrap: 'wrap' }}>
//         {activePeriod ? (
//           <div onClick={() => setActivePeriod(null)} style={{ color: PALETTE.accent, cursor: 'pointer', textDecoration: 'underline' }}>
//             ← Show All Months
//           </div>
//         ) : (
//           PERIODS.map(p => (
//             <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, color: PALETTE.muted }}>
//               <span style={{ width: 10, height: 10, borderRadius: 2, background: PERIOD_COLORS[p] }} />
//               {p}
//             </div>
//           ))
//         )}
//       </div>

//       <div style={{ flex: 1 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={chartData} barGap={4} barCategoryGap="18%"
//             margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
//             onClick={() => setActivePeriod(null)}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
//             <XAxis dataKey="bucket"
//               tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
//               axisLine={{ stroke: PALETTE.border }} tickLine={false} />
//             <YAxis tick={{ fill: PALETTE.muted, fontSize: 13 }}
//               axisLine={false} tickLine={false} allowDecimals={false} />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
//             {displayedPeriods.flatMap(p =>
//               Array.from({ length: maxRolesPerPeriod[p] }).map((_, idx) => {
//                 const dataKey = `${p}_role_${idx}`;
//                 return (
//                   <Bar key={dataKey} dataKey={dataKey} stackId={p}
//                     fill={PERIOD_COLORS[p]} stroke="#0d1117" strokeWidth={1}
//                     style={{ cursor: 'pointer' }}
//                     onClick={(data, index, event) => {
//                       event.stopPropagation();
//                       handleBarClick(p);
//                     }}
//                   />
//                 );
//               })
//             )}
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
// components/charts/ExperienceDemandBar.jsx
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { orionPipeline, MONTHS } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const BUCKETS = ['Junior (4–6y)', 'Senior (6–10y)', 'Lead (10y+)'];

// Colors mapped strictly to experience buckets instead of time periods
const BUCKET_COLORS = {
  'Junior (4–6y)': '#3BC9A0',  // Mint Green
  'Senior (6–10y)': '#D2A8FF', // Soft Purple
  'Lead (10y+)': '#58A6FF',    // Bright Blue
};

const getBucketForRow = (row) => {
  if ([14, 15, 20].includes(row.id)) return 'Junior (4–6y)';
  if ([1, 3, 8, 9, 10, 11, 12, 17].includes(row.id)) return 'Senior (6–10y)';
  if ([2, 4, 5, 6, 7, 13, 16, 18, 19].includes(row.id)) return 'Lead (10y+)';
  return null;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  // Recharts passes the entire entry payload directly to the tooltip
  const monthData = payload[0].payload;
  const roles = monthData.roles || [];

  if (roles.length === 0) return null;

  // Group active roles by bucket for clear categorical layout in the tooltip
  const groupedByBucket = {};
  roles.forEach(role => {
    const bucket = getBucketForRow(role);
    if (bucket) {
      if (!groupedByBucket[bucket]) groupedByBucket[bucket] = [];
      groupedByBucket[bucket].push(role);
    }
  });

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 6, fontWeight: 'bold' }}>
        {label} ({roles.length} role{roles.length !== 1 ? 's' : ''})
      </div>
      {BUCKETS.map(bucket => {
        if (!groupedByBucket[bucket]) return null;
        return (
          <div key={bucket} style={{ marginBottom: 6 }}>
            <div style={{ color: BUCKET_COLORS[bucket], fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>
              {bucket}
            </div>
            {groupedByBucket[bucket].map((role, idx) => (
              <div key={idx} style={{ color: '#ffffff', paddingLeft: 6, fontSize: 12, lineHeight: '1.4' }}>
                • {role.shortTitle} <span style={{ color: PALETTE.muted, fontSize: 11 }}>({role.experience})</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default function ExperienceDemandBar() {
  // State to manage interactive legend visibility toggles
  const [hiddenBuckets, setHiddenBuckets] = useState({});

  const toggleBucket = (bucket) => {
    setHiddenBuckets(prev => ({
      ...prev,
      [bucket]: !prev[bucket]
    }));
  };

  // Dynamically map pipeline data to a chronological, month-first structure
  const chartData = MONTHS.map(month => {
    const entry = {
      month,
      'Junior (4–6y)': 0,
      'Senior (6–10y)': 0,
      'Lead (10y+)': 0,
      roles: [] // Storing raw rows here replaces the complex string-splitting key hack
    };

    orionPipeline.forEach(row => {
      if (row.month === month) {
        const bucket = getBucketForRow(row);
        if (bucket) {
          entry[bucket] += 1;
          entry.roles.push(row);
        }
      }
    });

    return entry;
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      
      {/* Dynamic Interactive Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, minHeight: 20, flexWrap: 'wrap' }}>
        {BUCKETS.map(bucket => {
          const isHidden = hiddenBuckets[bucket];
          return (
            <div 
              key={bucket} 
              onClick={() => toggleBucket(bucket)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, 
                cursor: 'pointer',
                opacity: isHidden ? 0.4 : 1,
                userSelect: 'none',
                transition: 'opacity 0.2s ease'
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 2, background: BUCKET_COLORS[bucket] }} />
              <span style={{ color: isHidden ? PALETTE.muted : '#ffffff', textDecoration: isHidden ? 'line-through' : 'none' }}>
                {bucket}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart Space */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData} 
            barCategoryGap="25%"
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
            <XAxis 
              dataKey="month"
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
            
            {BUCKETS.map(bucket => (
              <Bar 
                key={bucket} 
                dataKey={bucket} 
                stackId="experience" 
                fill={BUCKET_COLORS[bucket]} 
                hide={hiddenBuckets[bucket]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}